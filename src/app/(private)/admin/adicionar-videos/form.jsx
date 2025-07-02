"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useVideoForm } from "@/hooks/useVideoForm";
import { VideoUploader } from "./VideoUploader";
import { submitVideos } from "./api";
import { ErrorPage } from "@/app/_components/ErrorPage";
import { NotFoundPage } from "@/app/_components/Notfound";
import { Loading } from "@/app/_components/Loading";

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
    loadingCourse,
    courseError,
  } = useVideoForm(courseId);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      // Ensure we only submit up to 4 videos
      const videosToSubmit = data.videos.slice(0, 4);
      const payload = {
        ...data,
        videos: videosToSubmit
      };

      const response = await submitVideos(payload);
      console.log(response)
      
      if (response.success) {
        setSubmitSuccess(response.message || "Vídeos enviados com sucesso!");
      } else {
        setSubmitError(response.message || "Erro ao enviar vídeos");
      }
    } catch (error) {
      setSubmitError(error.message || "Ocorreu um erro inesperado ao enviar os vídeos");
    } finally {
      setIsUploading(false);
    }
  };

  if (loadingCourse) {
    return <Loading message="Carregando os detalhes..." />;
  }

  if (courseError) {
    return <NotFoundPage message="Não conseguimos encontrar este curso." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Adicionar Vídeos</h1>
        <p className="text-gray-600">Preencha os detalhes das videoaulas para o curso (máximo de 4 vídeos por envio)</p>
      </div>

      {/* Course details card */}
      {courseDetails && (
        <div className="mb-8 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 bg-gray-100">
              <img
                src={courseDetails.image_url || "/placeholder-course.jpg"}
                alt={courseDetails.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            
            <div className="p-6 md:p-6 flex-1">
              <div className="mb-4">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded mb-2">
                  {courseDetails.category?.name || 'Geral'}
                </span>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {courseDetails.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {courseDetails.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{courseDetails.duration || '--'}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-700">{courseDetails.total_lessons || 0} aulas</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-700">
                    {courseDetails.instructors_datas?.full_name || 'Instrutor não definido'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {watch("videos").slice(0, 4).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Vídeo {index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeVideoField(index)}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                  disabled={isUploading}
                >
                  <Trash2 className="w-4 h-4" /> Remover
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                  {...register(`videos.${index}.title`)}
                  className="w-full p-2 border rounded"
                  placeholder="Título do vídeo"
                  disabled={isUploading}
                />
                {errors.videos?.[index]?.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.videos[index].title.message}</p>
                )}
              </div>

              <VideoUploader
                register={register}
                setValue={setValue}
                videoIndex={index}
                errors={errors}
                disabled={isUploading}
              />

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  {...register(`videos.${index}.description`)}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Descrição do vídeo"
                  disabled={isUploading}
                />
                {errors.videos?.[index]?.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.videos[index].description.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {videoCount < 4 && (
          <button
            type="button"
            onClick={addVideoField}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
            disabled={isUploading || videoCount >= 4}
          >
            <Plus className="w-4 h-4" /> Adicionar vídeo
          </button>
        )}

        {/* Feedback messages */}
        {submitSuccess && (
          <div className="p-4 bg-green-100 text-green-700 rounded-md">
            {submitSuccess}
          </div>
        )}
        
        {submitError && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {submitError}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading || videoCount === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Enviando...
              </>
            ) : (
              <>
                {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
                Salvar vídeos
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}