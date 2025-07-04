// app/(private)/admin/editar-video/EditVideoUploader.jsx
"use client";

import { Upload, X, Video, Replace } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function EditVideoUploader({
  register,
  setValue,
  errors,
  existingVideoUrl,
  disabled,
}) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  // Função para lidar com a seleção de arquivo
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    handleFileChange(file); // Chama a função do hook
  }
};

  // Função para remover o vídeo selecionado
  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // Limpa o input file
      setPreview(null);
      setValue("video_file", null, { shouldValidate: true });
    }
  };

  // Função para acionar o input file programaticamente
  const handleSelectFile = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Aciona o clique no input file
    }
  };

  // Limpeza do objeto URL quando o componente desmontar
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="w-full h-[calc(100vh-200px)] flex flex-col">
      <label className="block font-medium text-gray-700 mb-2">
        Arquivo de Vídeo
      </label>

      <div className="relative w-full flex-1 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex flex-col">
        {/* Área principal do vídeo */}
        <div className="flex-1 relative bg-black">
          {preview ? (
            <video
              controls
              className="absolute inset-0 w-full h-full object-contain"
              src={preview}
            />
          ) : existingVideoUrl ? (
            <video
              controls
              className="absolute inset-0 w-full h-full object-contain"
              src={existingVideoUrl}
            />
          ) : (
            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-16 h-16 mb-4 text-gray-400" />
              <p className="text-lg text-gray-500 mb-1">Clique para enviar</p>
              <p className="text-sm text-gray-400">ou arraste o arquivo aqui</p>
            </label>
          )}
        </div>

        {/* Área de controles fixa na base */}
        <div className="p-4 bg-white border-t">
          {preview ? (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 truncate max-w-[60%]">
                {inputRef.current?.files?.[0]?.name}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSelectFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  disabled={disabled}
                >
                  <Replace className="w-4 h-4" />
                  Trocar
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-2"
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </div>
          ) : existingVideoUrl ? (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Vídeo atual selecionado
              </span>
              <button
                type="button"
                onClick={handleSelectFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                disabled={disabled}
              >
                <Video className="w-4 h-4" />
                Substituir
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Nenhum vídeo selecionado
            </p>
          )}
        </div>

        {/* Input file oculto */}
        <input
          {...register("video_file")}
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          disabled={disabled}
        />
      </div>

      {errors?.video_file && (
        <p className="text-red-500 text-sm mt-2">{errors.video_file.message}</p>
      )}
    </div>
  );
}