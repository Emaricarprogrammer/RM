"use client";

import { Upload, X, Loader2, ChevronDown } from "lucide-react";
import { useCourseForm } from "@/hooks/useCourseForm";
import { submitCourseData } from "./api";

export function CourseForm() {
  const {
    previewImage,
    categories,
    instructors,
    handleImageChange,
    removeImage,
    isSubmitting,
    handleSubmit,
    register,
    errors,
  } = useCourseForm();

  const onSubmit = async (data) => {
    await submitCourseData(data);
  };

  return (
    <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 lg:space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-8">
          {/* Image Upload */}
          <div className="md:col-span-2 xl:col-span-3 mx-auto w-full max-w-lg space-y-4">
            <label className="block font-medium text-gray-700 text-center">
              Imagem de Capa
            </label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full h-64 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">
                          Clique para enviar
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG ou JPEG (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
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
                  Remover imagem
                </button>
              )}
            </div>
          </div>

          <div className="md:col-span-2 xl:col-span-3 space-y-2">
            <label className="block font-medium text-gray-700">
              Título do Curso
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="Introdução ao React.js"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 xl:col-span-3 space-y-2">
            <label className="block font-medium text-gray-700">Descrição</label>
            <textarea
              {...register("description")}
              rows="4"
              placeholder="Descreva o conteúdo do curso, objetivos e o que os alunos irão aprender..."
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Duração (horas)
            </label>
            <input
              {...register("duration", { valueAsNumber: true })}
              type="number"
              min="1"
              placeholder="20"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Preço (Kz)
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              min="0"
              placeholder="25000"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Total de Aulas
            </label>
            <input
              {...register("total_lessons", { valueAsNumber: true })}
              type="number"
              min="1"
              placeholder="10"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.total_lessons && (
              <p className="text-red-500 text-sm mt-1">
                {errors.total_lessons.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Instrutor</label>
            <div className="relative">
              <select
                {...register("id_instructor")}
                className="bg-gray-50 w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none appearance-none"
              >
                <option value="">Selecione um instrutor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.id_instructor && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_instructor.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Categoria</label>
            <div className="relative">
              <select
                {...register("id_category_course_fk")}
                className="bg-gray-50 w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none appearance-none"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.id_category_course_fk && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_category_course_fk.message}
              </p>
            )}
          </div>

          {/* Tipo de Curso */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Tipo de Curso
            </label>
            <div className="relative">
              <select
                {...register("course_type")}
                className="bg-gray-50 w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none appearance-none"
              >
                <option value="">Selecione o tipo</option>
                <option value="online">Online</option>
                <option value="presential">Presencial</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.course_type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.course_type.message}
              </p>
            )}
          </div>
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
                Criando...
              </>
            ) : (
              "Criar Curso"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
