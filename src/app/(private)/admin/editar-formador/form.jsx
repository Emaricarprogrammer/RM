"use client";

import { Upload, X, Loader2 } from "lucide-react";
import { useEditInstructorForm } from "@/hooks/useEditInstructorForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditInstructor } from "@/api/Users/Instructors/editInstructor";
import { toast, Toaster} from "react-hot-toast";
import { useUserAuth } from "@/hooks/useAuth";
import { Loading } from "@/app/_components/Loading";

export function EditInstructorForm({ initialValues = {}, instructorId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : null;
  const {loading: isAuthLoading} = useUserAuth(["ADMIN"])
  if (!token) {
    if (typeof window !== 'undefined') {
      router.push("/");
    }
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    setValue,
    watch,
    handleImageChange,
    removeImage,
    hasChanges,
  } = useEditInstructorForm(initialValues);

    useEffect(() => {
      if (!isAuthLoading) {
        EditInstructorForm();
      }
      }, [isAuthLoading]);
    
    if (isAuthLoading)
      {
        return <Loading message=" Academia Egaf..." />;
      }

  const onSubmit = async (data) => {
    if (!hasChanges()) {
      toast.error("Nenhuma alteração foi feita no formulário");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      
      if (dirtyFields.full_name) formData.append('full_name', data.full_name);
      if (dirtyFields.email) formData.append('email', data.email);
      if (dirtyFields.contact) formData.append('contact', data.contact);
      if (dirtyFields.biography) formData.append('biography', data.biography);

      const fileInput = document.getElementById("instructor-photo");
      if (fileInput?.files[0]) {
        formData.append("profile_image", fileInput.files[0]);
      } else if (dirtyFields.profile_image && !watch("profile_image") && initialValues?.profile_image) {
        formData.append("remove_image", "true");
      }

      const response = await EditInstructor(instructorId, formData, token);

      if (response.success) {
        toast.success("Formador atualizado com sucesso!");
        setTimeout(() => {
          router.push("/admin/formadores");
        }, 1500);
      } else {
        toast.error(response.message || "Erro ao atualizar formador");
      }
    } catch (error) {
      toast.error(error.message || "Erro ao atualizar formador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
        <Toaster position="top-center" reverseOrder={false} className="flex flex-col text-center gap-1 w-full"/>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:gap-8 pb-8">
          {/* Image Upload */}
          <div className="mx-auto w-full max-w-lg space-y-4">
            <label className="block font-medium text-gray-700 text-center">
              Foto do Formador
            </label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 border-2 border-gray-300 border-dashed rounded-full overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                {watch("profile_image") ? (
                  <img
                    src={watch("profile_image")}
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
              {watch("profile_image") && (
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

          {/* Personal Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Nome Completo *
              </label>
              <input
                {...register("full_name", { required: "Nome é obrigatório" })}
                type="text"
                placeholder="Maria Souza"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Email *
              </label>
              <input
                {...register("email", { 
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-700">
                Contacto *
              </label>
              <input
                {...register("contact", { 
                  required: "Contacto é obrigatório",
                  minLength: {
                    value: 9,
                    message: "Contacto deve ter pelo menos 9 dígitos"
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Apenas números são permitidos"
                  }
                })}
                type="tel"
                placeholder="9x-xxx-xxx"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
              )}
            </div>
          </div>

          {/* Biography Section */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Biografia</label>
            <textarea
              {...register("biography", {
                maxLength: {
                  value: 500,
                  message: "A biografia não pode exceder 500 caracteres"
                }
              })}
              rows="6"
              placeholder="Descreva a experiência profissional, formação e especialidades do formador..."
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.biography && (
              <p className="text-red-500 text-sm mt-1">{errors.biography.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1 text-right">
              {watch("biography")?.length || 0}/500 caracteres
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-3 pb-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/formadores")}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-6 py-3 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium rounded-md shadow-md transition-colors flex items-center justify-center min-w-32 ${
              !hasChanges() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting || !hasChanges()}
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