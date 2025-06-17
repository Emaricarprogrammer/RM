"use client";

import { Plus, Trash2, Loader2 } from "lucide-react";
import { useVideoForm } from "@/hooks/useVideoForm";
import { VideoUploader } from "./VideoUploader";
import { submitVideos } from "./api";

export function VideoForm({ courseId }) {
  const {
    isSubmitting,
    courseDetails,
    videoCount,
    register,
    handleSubmit,
    errors,
    addVideoField,
    removeVideoField,
    setValue,
    watch,
  } = useVideoForm(courseId);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await submitVideos(data);
      // Sucesso - redirecionar ou mostrar mensagem
    } catch (error) {
      console.error("Erro ao enviar vídeos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
      {/* {courseDetails && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800">
            Curso selecionado:
          </h2>
          <p className="text-blue-900 font-medium">{courseDetails.title}</p>
          <p className="text-blue-700 text-sm mt-1">
            {courseDetails.description}
          </p>
        </div>
      )} */}

      {courseDetails && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200 flex">
          {/* Adicionando a imagem à esquerda */}
          <div className="w-1/3 min-w-[120px] max-w-[200px] mr-6">
            <img
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt={courseDetails.title}
              className="w-full h-full min-h-[120px] object-cover rounded-md"
            />
          </div>

          {/* Mantendo o conteúdo existente à direita */}
          <div className="flex-1 space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-blue-800">
              Curso selecionado:
            </h2>
            <p className="text-blue-900 font-medium text-base md:text-lg">
              {courseDetails.title}
            </p>
            <p className="text-blue-700 text-sm md:text-base mt-1">
              {courseDetails.description}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          {watch("videos").map((_, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg bg-gray-50 relative"
            >
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeVideoField(index)}
                  className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                  title="Remover seção de vídeo"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <h3 className="text-lg font-medium text-gray-800 mb-6">
                Vídeo {index + 1}
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="block font-medium text-gray-700">
                    Título do Vídeo
                  </label>
                  <input
                    {...register(`videos.${index}.title`)}
                    type="text"
                    placeholder="Introdução ao React Hooks"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                  />
                  {errors.videos?.[index]?.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.videos[index].title.message}
                    </p>
                  )}
                </div>

                <VideoUploader
                  register={register}
                  setValue={setValue}
                  videoIndex={index}
                  errors={errors}
                />

                <div className="space-y-2">
                  <label className="block font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    {...register(`videos.${index}.description`)}
                    rows="3"
                    placeholder="Descreva o conteúdo deste vídeo..."
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                  />
                  {errors.videos?.[index]?.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.videos[index].description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {videoCount < 10 && (
            <button
              type="button"
              onClick={addVideoField}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
            >
              <Plus className="w-5 h-5" />
              Adicionar outro vídeo
            </button>
          )}

          {errors.videos?.message && (
            <p className="text-red-500 text-sm mt-1">{errors.videos.message}</p>
          )}
        </div>

        <hr />

        <div className="pt-3 pb-4 flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium rounded-md shadow-md transition-colors flex items-center justify-center min-w-32"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Salvando...
              </>
            ) : (
              "Salvar Vídeos"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
