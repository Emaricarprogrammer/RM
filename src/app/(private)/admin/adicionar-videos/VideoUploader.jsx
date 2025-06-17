"use client";

import { Upload, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function VideoUploader({
  register,
  name,
  errors,
  setValue,
  videoIndex,
}) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setValue(`videos.${videoIndex}.video_file`, file);
    }
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPreview(null);
    setValue(`videos.${videoIndex}.video_file`, null);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="w-full space-y-2">
      <label className="block font-medium text-gray-700">
        Arquivo de Vídeo
      </label>

      <div className="relative w-full border-2 border-gray-300 border-dashed rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors min-h-48">
        {preview ? (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-full">
              <video
                controls
                className="w-full max-h-64 object-contain rounded-md"
                src={preview}
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <span className="mt-2 text-sm text-gray-500 truncate max-w-full">
              {inputRef.current?.files[0]?.name}
            </span>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6">
            <div className="flex flex-col items-center justify-center">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Clique para enviar</span>
              </p>
              <p className="text-xs text-gray-500">
                MP4, WEBM ou MOV (MAX. 500MB)
              </p>
            </div>
            <input
              {...register(`videos.${videoIndex}.video_file`)}
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
            />
          </label>
        )}
      </div>

      {errors?.videos?.[videoIndex]?.video_file && (
        <p className="text-red-500 text-sm mt-1">
          {errors.videos[videoIndex].video_file.message}
        </p>
      )}
    </div>
  );
}
