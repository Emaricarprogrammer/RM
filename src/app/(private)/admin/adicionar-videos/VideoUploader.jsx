"use client";

import { Upload, X, Loader2, CheckCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";

export function VideoUploader({ register, setValue, videoIndex, errors, disabled }) {
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const videoRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Formato não suportado. Use MP4, WEBM, OGG ou MOV', {
        position: 'top-center',
        style: { background: '#fef2f2', color: '#b91c1c' },
      });
      return false;
    }
    
    if (file.size > 3 * 1024 * 1024 * 1024) {
      toast.error('Arquivo muito grande (máximo 3GB)', {
        position: 'top-center',
        style: { background: '#fef2f2', color: '#b91c1c' },
      });
      return false;
    }
    
    return true;
  };

  const handleFileUpload = async (file) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const uploadPromise = new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min(prev + 10, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            resolve(file);
            return 100;
          }
          return newProgress;
        });
      }, 300);
    });

    try {
      const uploadedFile = await uploadPromise;
      const previewUrl = URL.createObjectURL(uploadedFile);
      
      setPreview(previewUrl);
      setValue(`videos.${videoIndex}.video_file`, uploadedFile);
      
      toast.success('Vídeo carregado com sucesso!', {
        position: 'top-center',
        style: { background: '#ecfdf5', color: '#059669' },
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    if (disabled || !e.target.files?.[0]) return;
    handleFileUpload(e.target.files[0]);
  };

  const handleRemove = () => {
    if (disabled) return;
    
    if (preview) URL.revokeObjectURL(preview);
    if (inputRef.current) inputRef.current.value = "";
    
    setPreview(null);
    setUploadProgress(0);
    setValue(`videos.${videoIndex}.video_file`, null);
    
    toast('Vídeo removido', {
      position: 'top-center',
      icon: '🗑️',
      style: { background: '#f3f4f6', color: '#4b5563' },
    });
  };

  // Drag and drop handlers
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlight = () => {
      dropArea.classList.add('border-blue-500', 'bg-blue-50');
      dropArea.classList.remove('border-gray-300');
    };
    
    const unhighlight = () => {
      dropArea.classList.remove('border-blue-500', 'bg-blue-50');
      if (!preview) dropArea.classList.add('border-gray-300');
    };

    const handleDrop = (e) => {
      preventDefaults(e);
      if (disabled) return;
      
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
      
      unhighlight();
    };

    const events = {
      dragenter: highlight,
      dragover: highlight,
      dragleave: unhighlight,
      drop: handleDrop
    };

    Object.entries(events).forEach(([event, handler]) => {
      dropArea.addEventListener(event, handler);
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        dropArea.removeEventListener(event, handler);
      });
    };
  }, [disabled, preview]);

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Show validation errors
  useEffect(() => {
    if (errors?.videos?.[videoIndex]?.video_file) {
      toast.error(errors.videos[videoIndex].video_file.message, {
        position: 'top-center',
        id: `video-error-${videoIndex}`,
      });
    }
  }, [errors, videoIndex]);

  return (
    <div className="space-y-3 w-full">
      <Toaster position="top-center" />
      
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Vídeo {videoIndex + 1}
        </label>
        {preview && !isUploading && (
          <span className="flex items-center text-xs text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Pronto para enviar
          </span>
        )}
      </div>
      
      <div 
        ref={dropRef}
        className={`border-2 rounded-lg transition-all w-full overflow-hidden ${
          disabled ? 'bg-gray-100 border-gray-200' : 
          preview ? 'border-gray-200' : 'border-gray-300 hover:border-gray-400 cursor-pointer'
        }`}
      >
        {preview ? (
          <div className="relative w-full">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <div className="w-full max-w-xs mx-auto mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center text-gray-500 mt-2">
                    Enviando... {uploadProgress}%
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-black w-full flex items-center justify-center">
                  <video 
                    ref={videoRef}
                    controls 
                    src={preview} 
                    className="w-full h-auto max-h-[70vh] object-contain"
                    playsInline
                  />
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-600 truncate max-w-xs">
                    {inputRef.current?.files[0]?.name || 'Vídeo selecionado'}
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                      aria-label="Remover vídeo"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <label className={`block p-8 w-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <div className="flex flex-col items-center justify-center space-y-3">
              {isUploading ? (
                <>
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                  <div className="w-full max-w-xs mx-auto">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Preparando upload... {uploadProgress}%</p>
                </>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 rounded-full">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      <span className="text-blue-600">Clique para enviar</span> ou arraste o vídeo
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: MP4, WEBM, OGG, MOV (até 3GB)
                    </p>
                  </div>
                </>
              )}
            </div>
            <input
              {...register(`videos.${videoIndex}.video_file`, {
                required: "Selecione um arquivo de vídeo",
              })}
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleInputChange}
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              disabled={disabled}
            />
          </label>
        )}
      </div>
      
      {errors?.videos?.[videoIndex]?.video_file && !preview && (
        <p className="mt-1 text-sm text-red-600 font-medium px-1">
          {errors.videos[videoIndex].video_file.message}
        </p>
      )}
    </div>
  );
}