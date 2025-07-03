"use client";

import { Upload, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { EditInstructor } from "@/api/Users/Instructors/editInstructor";
import { toast, Toaster } from "react-hot-toast";
import { useUserAuth } from "@/hooks/useAuth";
import { Loading } from "@/app/_components/Loading";

export function EditInstructorForm({ initialValues = {}, instructorId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialValues.profile_image || null);
  const fileInputRef = useRef(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem("access") : null;
  const { loading: isAuthLoading } = useUserAuth(["ADMIN"]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      full_name: initialValues.full_name || "",
      email: initialValues.email || "",
      contact: initialValues.contact || "",
      biography: initialValues.biography || "",
      profile_image: initialValues.profile_image || null,
    }
  });

  if (!token) {
    if (typeof window !== 'undefined') {
      router.push("/");
    }
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setValue("profile_image", reader.result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("profile_image", null, { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasChanges = () => {
    return isDirty;
  };

  const onSubmit = async (data) => {
    if (!hasChanges()) {
      toast.error("Nenhuma alteração foi feita no formulário");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Adiciona apenas os campos modificados
      if (dirtyFields.full_name) formData.append('full_name', data.full_name);
      if (dirtyFields.email) formData.append('email', data.email);
      if (dirtyFields.contact) formData.append('contact', data.contact);
      if (dirtyFields.biography) formData.append('biography', data.biography);

      // Tratamento da imagem
      const fileInput = fileInputRef.current;
      if (fileInput?.files[0]) {
        formData.append("profile_image", fileInput.files[0]);
      } else if (dirtyFields.profile_image && !imagePreview && initialValues.profile_image) {
        formData.append("remove_image", "true");
      }

      // Debug: Verifica o conteúdo do FormData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await EditInstructor(instructorId, formData, token);

      if (response.success) {
        toast.success("Formador atualizado com sucesso!");
        // Atualiza os valores iniciais para evitar reenvio acidental
        reset({
          ...data,
          profile_image: imagePreview
        });
        setTimeout(() => {
          router.push("/admin/formadores");
        }, 1500);
      } else {
        toast.error(response.message || "Erro ao atualizar formador");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      toast.error(error.message || "Erro ao atualizar formador");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return <Loading message="Carregando..." />;
  }

  return (
    <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:gap-8 pb-8">
          {/* Image Upload */}
          <div className="mx-auto w-full max-w-lg space-y-4">
            <label className="block font-medium text-gray-700 text-center">
              Foto do Formador
            </label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 border-2 border-gray-300 border-dashed rounded-full overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <input
                      id="instructor-photo"
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/png, image/jpeg, image/jpg"
                    />
                  </label>
                )}
              </div>
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
            disabled={isLoading || !hasChanges()}
          >
            {isLoading ? (
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