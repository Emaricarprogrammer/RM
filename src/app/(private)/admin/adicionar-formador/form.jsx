"use client";

import { Upload, X, Loader2, EyeOff, Eye } from "lucide-react";
import { useInstructorForm } from "@/hooks/useInstructorForm";
import { CreateInstructor } from "@/api/Users/Instructors/createInstructor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {toast, Toaster} from "react-hot-toast";
import { useUserAuth } from "@/hooks/useAuth";
import { Loading } from "@/app/_components/Loading";

export function InstructorForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    previewImage,
    handleImageChange,
    removeImage,
    isSubmitting,
    handleSubmit,
    register,
    errors,
    setValue,
    reset,
  } = useInstructorForm();
  const isAuthLoading = useUserAuth(["ADMIN"])

  useEffect(() => {
    register("image_instructor");
  }, [register]);

      useEffect(() => {
      if (!isAuthLoading) {
        InstructorForm();
      }
    }, [isAuthLoading]);
  
  if (isAuthLoading) {
        return <Loading message=" Academia Egaf..." />;
      }
const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("access") || "";
      const result = await CreateInstructor(data, token);
      
      if (result.success) {
        toast.success("Formador criado com sucesso!");
        reset();
        router.push("/admin/formadores");
      } else {
        toast.error(result.message || "Erro ao criar formador");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    }
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageChange(e);
      setValue("image_instructor", e.target.files);
    }
  };

  return (
    <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
      <Toaster position="top-center" reverseOrder={false} className="flex flex-col text-center gap-1 w-full"/>
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
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/jpg"
                    />
                  </label>
                )}
              </div>
              {previewImage && (
                <button
                  type="button"
                  onClick={() => {
                    removeImage();
                    setValue("image_instructor", null);
                  }}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Remover foto
                </button>
              )}
            </div>
            {errors.image_instructor && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {errors.image_instructor.message}
              </p>
            )}
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              {...register("full_name")}
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
              Email
            </label>
            <input
              {...register("email")}
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
              Contacto
            </label>
            <input
              {...register("contact", {valueAsNumber: true})}
              type="number"
              placeholder="9x-xxx-xxx"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
            )}
          </div>

          <div className="space-y-2 relative">
            <label className="block font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Biografia */}
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Biografia</label>
            <textarea
              {...register("biography")}
              rows="6"
              placeholder="Descreva a experiência profissional, formação e especialidades do formador..."
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
            />
            {errors.biography && (
              <p className="text-red-500 text-sm mt-1">{errors.biography.message}</p>
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