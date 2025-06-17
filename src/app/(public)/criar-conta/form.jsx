"use client";

import { Loader2, Eye, EyeOff } from "lucide-react";
import { useStudentForm } from "@/hooks/useStudentForm";
import { Sigup } from "@/api/Users/Students/register";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
export function StudentForm() {
  const { isSubmitting, handleSubmit, register, errors, setError } = useStudentForm();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const result = await Sigup(
        data.full_name,
        data.email,
        data.contact,
        data.password
      );

      if (result.success) {
        toast.success("Cadastro realizado com sucesso!");
        router.push("/login"); // Redireciona para a página de login
      } else {
        // Trata erros de validação da API
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            setError(key, {
              type: "manual",
              message: result.errors[key][0] // Pega a primeira mensagem de erro
            });
          });
        } else {
          toast.error(result.message || "Erro ao realizar cadastro");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    }
  };

  return (
    
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-7 flex flex-col gap-6 w-full"
    >
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Nome Completo
        </label>
        <input
          {...register("full_name")}
          type="text"
          placeholder="Seu nome completo"
          className="border-0 bg-transparent w-full rounded-md py-4 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none"
        />
        {errors.full_name && (
          <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">E-mail</label>
        <input
          {...register("email")}
          type="email"
          placeholder="seu@email.com"
          className="border-0 bg-transparent w-full rounded-md py-4 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Telefone</label>
        <input
          {...register("contact", { valueAsNumber: true })}
          type="number"
          placeholder="9xx xxx xxx"
          className="border-0 bg-transparent w-full rounded-md py-4 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none"
        />
        {errors.contact && (
          <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Senha</label>
        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="border-0 bg-transparent w-full rounded-md py-4 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="py-4 px-6 bg-gradient-to-br from-blue-900 to-blue-700 rounded shadow font-medium text-white text-sm sm:text-base hover:opacity-90 transition-opacity flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Cadastrando...
          </>
        ) : (
          "Criar conta"
        )}
      </button>

      <p className="space-x-1 text-center text-gray-600 text-sm">
        <span>Já tem uma conta?</span>
        <Link
          href="/login"
          className="text-blue-800 font-medium hover:underline"
        >
          Faça login
        </Link>
       <Toaster
        position="top-center"
        reverseOrder={false}
/>
      </p>
    </form>
  );
}