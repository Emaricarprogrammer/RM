"use client";

import { Upload, X, Loader2 } from "lucide-react";
import { useInstructorForm } from "@/hooks/useInstructorForm";
import { submitInstructorData } from "./api";
import Link from "next/link";

export function InstructorForm() {
  const {
    previewImage,
    handleImageChange,
    removeImage,
    isSubmitting,
    handleSubmit,
    register,
    errors,
  } = useInstructorForm();

  const onSubmit = async (data) => {
    await submitInstructorData(data);
  };

  return (
    <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 lg:space-y-8"
      >
        <div className="grid grid-cols-1 gap-6 lg:gap-8 pb-8">
          {/* Image Upload */}
          <div className="mx-auto w-full max-w-lg space-y-4">
            <label className="block font-medium text-gray-700 text-center">
              Foto do Formador
            </label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 border-2 border-gray-300 border-dashed rounded-full overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <input
                      id="instructor-photo"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/png, image/jpeg, image/jpg"
                    />
                  </label>
                )}
              </div>
              {previewImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Remover foto
                </button>
              )}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Maria Souza"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Biografia */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Biografia</label>
            <textarea
              {...register("bio")}
              rows="6"
              placeholder="Descreva a experiência profissional, formação e especialidades do formador..."
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>
        </div>

        <div className="pt-3 pb-4 flex justify-end gap-4">
          <Link
            href="/admin/formadores"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium rounded-md shadow-md transition-colors flex items-center justify-center min-w-32"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Criando...
              </>
            ) : (
              "Adicionar Formador"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
