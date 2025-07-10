"use client";

import { Upload, X, Loader2, ChevronDown } from "lucide-react";
import { useEditCourseForm } from "@/hooks/useEditCourseForm";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EditCourse } from "@/api/Courses/editCourse";
import { Toaster, toast } from "react-hot-toast";
import { GetAllCategories } from "@/api/Courses/Categories/Categories";
import { AllInstrutors } from "@/api/Users/Instructors/allInstructors";
import { Loading } from "@/app/_components/Loading";
import { useUserAuth } from "@/hooks/useAuth";

export function EditCourseForm({ initialValues }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : null;
  const {loading: isAuthLoading} = useUserAuth(["ADMIN"])
  if (!token)
  {
    router.replace("/login")
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    setValue,
    watch,
    control,
  } = useEditCourseForm(initialValues);

  // Load categories and instructors
  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoadingData(true);
        const [categoriesRes, instructorsRes] = await Promise.all([
          GetAllCategories(),
          AllInstrutors(),
        ]);

        if (categoriesRes.success) {
          setCategories(categoriesRes.response);
        }

        if (instructorsRes.success) {
          setInstructors(instructorsRes.response);
        }
      } catch (error) {
        toast.error("Erro ao carregar dados adicionais");
        console.error("Erro:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadFormData();
    reset({
      ...initialValues,
      id_instructor: initialValues.id_instructor_fk,
      course_type: initialValues.course_type,
      id_category_course_fk: initialValues.id_category_course_fk
    });
  }, [initialValues, reset]);
    

  // Check for form changes
  const hasChanges = () => {
    const currentValues = watch();
    return Object.keys(dirtyFields).length > 0 || 
           (currentValues.image_url !== initialValues.image_url && 
            currentValues.image_url !== "");
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O tamanho da imagem não pode exceder 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("image_url", reader.result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("image_url", "", { shouldDirty: true });
    const fileInput = document.getElementById("dropzone-file");
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = async (data) => {
    if (!hasChanges()) {
      toast.error("Nenhuma alteração foi feita no formulário");
      return;
    }

    try {
      const formData = new FormData();
      
      // Add only changed fields
      if (dirtyFields.title) formData.append('title', data.title);
      if (dirtyFields.duration) formData.append('duration', data.duration);
      if (dirtyFields.price) formData.append('price', data.price);
      if (dirtyFields.total_lessons) formData.append('total_lessons', data.total_lessons);
      if (dirtyFields.description) formData.append('description', data.description);
      if (dirtyFields.id_instructor) formData.append('id_instructor_fk', data.id_instructor);
      if (dirtyFields.course_type) formData.append('course_type', data.course_type);
      if (dirtyFields.id_category_course_fk) {
        formData.append('id_category_course_fk', data.id_category_course_fk);
      }

      // Handle image upload
      const fileInput = document.getElementById("dropzone-file");
      if (fileInput?.files[0]) {
        formData.append("image_course", fileInput.files[0]);
      } else if (dirtyFields.image_url && !watch("image_url") && initialValues.image_url) {
        formData.append("remove_image", "true");
      }

      const response = await EditCourse(initialValues.id_course, formData, token);

      if (response.success) {
        toast.success("Curso atualizado com sucesso!");
        setTimeout(() => {
          router.push("/cursos");
        }, 1500);
      } else {
        toast.error(response.message || "Erro ao atualizar curso, tente novamentesss!");
      }
    } catch (error) {
      toast.error(error.message || "Erro ao atualizar curso, tente novamentes");
    }
  };
    if (isAuthLoading)
      {
        return <Loading message=" Academia Egaf..." />;
      }
  if (isLoadingData) {
    return (
      <Loading message="Carregando os detalhes do curso..."/>
    );
  }

  return (
    <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
        <Toaster 
          position="top-center" 
          reverseOrder={false}
        />
        
        {/* Image upload section */}
        <div className="md:col-span-2 xl:col-span-3 mx-auto w-full max-w-lg space-y-4">
          <label className="block font-medium text-gray-700 text-center">
            Imagem de Capa
          </label>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full h-64 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
              {watch("image_url") ? (
                <>
                  <img
                    src={watch("image_url")}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para enviar</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG ou JPEG (MAX. 5MB)
                  </p>
                </div>
              )}
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/jpg"
              />
              <label
                htmlFor="dropzone-file"
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-8">
          {/* Title */}
          <div className="md:col-span-2 xl:col-span-3 space-y-2">
            <label className="block font-medium text-gray-700">
              Título do Curso
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2 xl:col-span-3 space-y-2">
            <label className="block font-medium text-gray-700">Descrição</label>
            <textarea
              {...register("description")}
              rows="4"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Duração (horas)
            </label>
            <input
              {...register("duration", { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Preço (Kz)
            </label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Total Lessons */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Total de Aulas
            </label>
            <input
              {...register("total_lessons", { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.total_lessons && (
              <p className="text-red-500 text-sm mt-1">
                {errors.total_lessons.message}
              </p>
            )}
          </div>

          {/* Instructor */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Instrutor</label>
            <div className="relative">
              <select
                {...register("id_instructor")}
                className="bg-gray-50 w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none appearance-none"
              >
                <option value="">Selecione um instrutor</option>
                {instructors.map((instructor) => (
                  <option 
                    key={`instructor-${instructor.id_instructor}`}
                    value={instructor.id_instructor}
                  >
                    {instructor.full_name}
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

          {/* Category */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Categoria</label>
            <div className="relative">
              <select
                {...register("id_category_course_fk")}
                className="bg-gray-50 w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none appearance-none"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option 
                    key={`category-${category.id_category_course}`}
                    value={category.id_category_course}
                  >
                    {category.name_category_courses}
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

          {/* Course Type */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Tipo de Curso
            </label>
            <div className="relative">
              <select
                {...register("course_type")}
                className="bg-gray-50 w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none appearance-none"
              >
                <option value="ONLINE">Online</option>
                <option value="PRESENTIAL">Presencial</option>
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

        {/* Action buttons */}
        <div className="pt-3 pb-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/cursos")}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-6 py-3 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium rounded-md shadow-md transition-colors flex items-center justify-center min-w-32 ${
              !hasChanges ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting || !hasChanges}
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