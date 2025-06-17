// app/(private)/admin/editar-video/form.jsx
"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEditVideoForm } from "@/hooks/useEditVideoForm";
import { EditVideoUploader } from "./EditVideoUploader";
import { updateVideoData } from "./api";

export function EditVideoForm({ courseId, videoId }) {
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
  } = useEditVideoForm(courseId, videoId);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.video_file) {
        formData.append("video_file", data.video_file);
      }

      const result = await updateVideoData(videoId, formData);

      if (result.success) {
        router.push(
          `/admin/cursos/${courseId}?success=${encodeURIComponent(
            result.message
          )}`
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar vídeo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-800" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
      {videoData?.course && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200 flex">
          <div className="w-1/3 min-w-[120px] max-w-[200px] mr-6">
            <img
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt={videoData.course.title}
              className="w-full h-full min-h-[120px] object-cover rounded-md"
            />
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-lg md:text-xl font-semibold text-blue-800">
              Curso selecionado:
            </h2>
            <p className="text-blue-900 font-medium text-base md:text-lg">
              {videoData.course.title}
            </p>
            <p className="text-blue-700 text-sm md:text-base mt-1">
              {videoData.course.description}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Título do Vídeo
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <EditVideoUploader
              register={register}
              setValue={setValue}
              errors={errors}
              existingVideoUrl={watch("existing_video_url")}
            />

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                {...register("description")}
                rows="3"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-3 pb-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push(`/admin/cursos/${courseId}`)}
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
              "Salvar Alterações"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
