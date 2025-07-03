// app/(private)/admin/editar-video/form.jsx
"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEditVideoForm } from "@/hooks/useEditVideoForm";
import { EditVideoUploader } from "./EditVideoUploader";
import { updateVideoData } from "./api";
import { ErrorPage } from "@/app/_components/ErrorPage";
import { NotFoundPage } from "@/app/_components/Notfound";
import { Loading } from "@/app/_components/Loading";
import { useEffect, useState } from "react";

export function EditVideoForm({videoId }) {
  const router = useRouter();
  const {
    isLoading,
    isSubmitting,
    videoData,
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    setIsSubmitting,
    courseError,
  } = useEditVideoForm(courseId, videoId);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Preenche os valores iniciais do formulário quando os dados do vídeo são carregados
  useEffect(() => {
    if (videoData) {
      setValue("title", videoData.title);
      setValue("description", videoData.description);
      setValue("existing_video_url", videoData.video_url);
    }
  }, [videoData, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.video_file) {
        formData.append("video_file", data.video_file);
      }

      const result = await updateVideoData(videoId, formData);

      if (result.success) {
        setSubmitSuccess(result.message || "Vídeo atualizado com sucesso!");
        router.push(
          `/admin/cursos/${courseId}?success=${encodeURIComponent(
            result.message
          )}`
        );
      } else {
        setSubmitError(result.message || "Erro ao atualizar vídeo");
      }
    } catch (error) {
      setSubmitError("Erro ao atualizar vídeo: " + error.message);
      console.error("Erro ao atualizar vídeo:", error);
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading message="Carregando os detalhes do vídeo..." />;
  }

  if (courseError) {
    return <NotFoundPage message="Não conseguimos encontrar este vídeo." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Vídeo</h1>
        <p className="text-gray-600">Atualize os detalhes da videoaula</p>
      </div>

      {/* Video details card */}
      {videoData && (
        <div className="mb-8 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Detalhes do Vídeo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">ID do Vídeo</p>
                  <p className="text-gray-700">{videoData.id_video}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Criado em</p>
                  <p className="text-gray-700">{videoData.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última atualização</p>
                  <p className="text-gray-700">{videoData.updatedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">URL do Vídeo</p>
                  <p className="text-gray-700 truncate">{videoData.video_url}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course details card */}
      {videoData?.curse_associated && (
        <div className="mb-8 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 bg-gray-100">
              <img
                src={videoData.curse_associated.image_url || "/placeholder-course.jpg"}
                alt={videoData.curse_associated.title}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            
            <div className="p-6 md:p-6 flex-1">
              <div className="mb-4">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded mb-2">
                  {videoData.curse_associated.category?.name || 'Geral'}
                </span>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Curso Associado: {videoData.curse_associated.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {videoData.curse_associated.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">{videoData.curse_associated.duration || '--'}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-700">{videoData.curse_associated.total_lessons || 0} aulas</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-700">
                    {videoData.curse_associated.instructors_datas?.full_name || 'Instrutor não definido'}
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
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título do Vídeo</label>
              <input
                {...register("title")}
                className="w-full p-2 border rounded"
                placeholder="Título do vídeo"
                disabled={isUploading}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <EditVideoUploader
              register={register}
              setValue={setValue}
              errors={errors}
              existingVideoUrl={watch("existing_video_url")}
              disabled={isUploading}
            />

            <div>
              <label className="block text-sm font-medium mb-1">Descrição do Vídeo</label>
              <textarea
                {...register("description")}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Descrição do vídeo"
                disabled={isUploading}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

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
            onClick={() => router.push(`/admin/cursos/${courseId}`)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
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
                Salvar alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}