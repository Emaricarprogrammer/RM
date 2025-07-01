"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ForgotPassword, ResetPassword } from "@/api/Users/forgotPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-blue-800" />
    </div>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams ? searchParams.get("auth") : null;

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (token) {
      setStep(2);
      toast.success("Por favor, crie sua nova senha");
    }
  }, [token]);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await ForgotPassword(email);
      
      if (response.success) {
        toast.success(response.message || "Email enviado com sucesso! Verifique sua caixa de entrada.");
      } else {
        toast.error(response.message || "Erro ao enviar email. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao enviar email. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token de autenticação não encontrado");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      const response = await ResetPassword({newPassword, auth: token});
      
      if (response.success) {
        toast.success(response.message || "Senha redefinida com sucesso!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(response.message || "Erro ao redefinir senha. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na chamada da API:", error);
      toast.error("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Área do formulário */}
      <div className="flex flex-col h-full w-full lg:w-[60%] px-8 sm:px-10 justify-center items-center">
        <div className="flex flex-col items-center gap-5 w-full max-w-2xl">
          {/* Títulos */}
          <div className="flex flex-col text-center gap-1 w-full">
            <h1 className="font-medium text-2xl text-blue-900 uppercase">
              Academia Egaf
            </h1>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-blue-900">
              {step === 1 ? "Redefinir senha" : "Crie uma nova senha"}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base">
              {step === 1
                ? "Digite seu e-mail para receber o link de redefinição"
                : "Digite e confirme sua nova senha"}
            </p>
          </div>

          {/* Formulário */}
          {step === 1 ? (
            <form
              onSubmit={handleSubmitEmail}
              className="mt-7 flex flex-col gap-6 w-full"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 bg-transparent w-full rounded-md py-4 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none"
                />
              </div>

              <button
                type="submit"
                className="py-4 px-6 bg-gradient-to-br from-blue-900 to-blue-700 rounded shadow font-medium text-white text-sm sm:text-base hover:opacity-90 transition-opacity flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Enviando...
                  </>
                ) : (
                  "Redefinir senha"
                )}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitNewPassword}
              className="mt-7 flex flex-col gap-6 w-full"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border-0 bg-transparent w-full rounded-md py-4 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border-0 bg-transparent w-full rounded-md py-4 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="py-4 px-6 bg-gradient-to-br from-blue-900 to-blue-700 rounded shadow font-medium text-white text-sm sm:text-base hover:opacity-90 transition-opacity flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Enviando...
                  </>
                ) : (
                  "Redefinir senha"
                )}
              </button>
            </form>
          )}

          <p className="space-x-1 text-center text-gray-600 text-sm mt-4">
            <span>Lembrou da senha?</span>
            <Link
              href="/login"
              className="text-blue-800 font-medium hover:underline"
            >
              Voltar para login
            </Link>
          </p>
        </div>
      </div>

      {/* Área da imagem */}
      <div className="hidden relative lg:flex lg:items-center lg:justify-center h-full w-[40%] bg-gradient-to-br from-blue-900 to-blue-700 bg-no-repeat bg-cover bg-center bg-blend-overlay">
        <div className="text-white absolute top-24 px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            {step === 1 ? "Problemas com a senha?" : "Crie uma senha segura"}
          </h3>
          <p className="text-blue-100 text-lg">
            {step === 1
              ? "Vamos te ajudar a recuperar o acesso"
              : "Use uma combinação de letras, números e símbolos"}
          </p>
        </div>

        <img
          src={step === 1 ? "/images/login.svg" : "/images/login.svg"}
          alt="Ilustração de redefinição de senha"
          className="size-[530px] mt-10"
        />
      </div>
    </div>
  );
}