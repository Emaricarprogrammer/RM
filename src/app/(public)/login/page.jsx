"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2} from "lucide-react";
import { Signin } from "@/api/Authorization/login";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await Signin(email, password);
      
      if (result?.success) {
        const token = localStorage.getItem('access');
        
        if (!token) {
          throw new Error("Token inválido ou ausente");
        }
        
        const decodeToken = jwtDecode(token);
        
        // Redirecionamento baseado no tipo de usuário
        switch(decodeToken.userClaims.userType) {
          case "student":
            router.push("/home");
            break;
          case "ADMIN":
            router.push("/admin");
            break;
          case "SUPER_ADMIN":
            router.push("/super-admin");
            break;
          default:
            router.push("/login");
        }
      } else {
        // Captura mensagem de erro da API
        const errorMessage = result?.data?.message || result?.message || "Credenciais inválidas";
        toast.error(errorMessage);
      }
    } catch (err) {
      // Tratamento hierárquico de erros
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Ocorreu um erro durante o login");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Área do formulário */}
      <div className="flex flex-col h-full w-full lg:w-[60%] px-8 sm:px-10 justify-center items-center">
        <div className="flex flex-col items-center gap-5 w-full max-w-2xl">
          {/* Títulos */}
          <div className="flex flex-col text-center gap-1 w-full">
            <h1 className="font-medium text-2xl text-blue-900 uppercase">
              Academia Egaf
            </h1>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-blue-900">
              Bem-vindo de volta!
            </h2>
            <p className="text-gray-700 text-sm sm:text-base">
              Inicie sessão com os seus dados
            </p>
          </div>

          {/* Mensagem de erro */}
          {error && (
  <div className="w-full p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-start gap-2">
    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
    <span>{error}</span>
  </div>
)}
          {/* Formulário */}
          <Toaster position="top-center" reverseOrder={false} className="flex flex-col text-center gap-1 w-full"/>
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex flex-col gap-6 w-full"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="border-0 bg-transparent w-full rounded-md py-4 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="border-0 bg-transparent w-full rounded-md py-4 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="text-sm">
                <Link
                  href={"/redefinir-senha"}
                  className="font-medium text-blue-800 hover:text-blue-700"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

      <button
        type="submit"
        className="py-4 px-6 bg-gradient-to-br from-blue-900 to-blue-700 rounded shadow font-medium text-white text-sm sm:text-base hover:opacity-90 transition-opacity flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Entrando...
          </>
        ) : (
          "Entrar conta"
        )}
      </button>
          </form>

          <p className="space-x-1 text-center text-gray-600 text-sm mt-4">
            <span>Não tem uma conta?</span>
            <Link
              href="/criar-conta"
              className="text-blue-800 font-medium hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      {/* Área da imagem */}
      <div className="hidden relative lg:flex lg:items-center lg:justify-center h-full w-[40%] bg-gradient-to-br from-blue-900 to-blue-700 bg-no-repeat bg-cover bg-center bg-blend-overlay">
        <div className="text-white absolute top-24 px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Continue sua jornada conosco
          </h3>
          <p className="text-blue-100 text-lg">
            Acesse seus cursos e materiais exclusivos
          </p>
        </div>

        <img
          src="/images/login.svg"
          alt="Ilustração de login"
          className="size-[530px] mt-10"
        />
      </div>
    </div>
  );
}