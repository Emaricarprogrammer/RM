"use client";

import { GraduationCap, Mail, Phone } from "lucide-react";
import Link from "next/link";
import getInitials from "@/utils/getInitials";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { MyProfile } from "@/api/Users/Students/profile";
import { Loading } from "@/app/_components/Loading";
import { useUserAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function StudentData() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Hook de autenticação melhorado
  const { loading: isAuthLoading, isAuthorized, userType } = useUserAuth(["student"]);

  // Constantes para as estatísticas
  const ICON_SIZE = 18;
  const stats = [

  ];

  useEffect(() => {
    if (!isAuthLoading && isAuthorized) {
      const fetchStudentData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const token = localStorage.getItem('access');
          
          if (!token) {
            throw new Error("Sessão expirada. Faça login novamente.");
          }

          const decodedToken = jwtDecode(token);
          const id_student = decodedToken.userClaims.id_student;

          if (!id_student) {
            throw new Error("ID do estudante não encontrado no token.");
          }

          const result = await MyProfile(id_student, token);
          
          if (result.success) {
            setStudent({
              profileImage: result.data?.profile_image || "",
              name: result.data?.full_name || "",
              fullName: result.data?.full_name || "",
              phone: result.data?.contact || "",
              email: result.data?.email || "",
            });
          } else {
            throw new Error(result.message || "Erro ao carregar perfil");
          }
        } catch (err) {
          setError(err.message || "Falha ao carregar dados do perfil");
          console.error("Erro ao carregar perfil:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [isAuthLoading, isAuthorized]);

  // Estados de carregamento e autorização
  if (isAuthLoading) {
    return <Loading message="Academia Egaf..." />;
  }

  if (!isAuthorized) {
    return;
  }

  if (loading) {
    return <Loading message="Carregando seu perfil..." />;
  }

  if (error) {
    return (
      <div className="text-white">
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 py-8 md:py-24 px-8 md:px-16 drop-shadow-lg shadow-black rounded-xl text-center">
          <p className="text-red-300">{error}</p>
          <div className="flex justify-center gap-4 mt-6">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
            >
              Tentar novamente
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="px-4 py-2 bg-blue-600/70 rounded hover:bg-blue-600 transition-colors"
            >
              Página inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-white">
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 py-8 md:py-24 px-8 md:px-16 drop-shadow-lg shadow-black rounded-xl text-center">
          <p>Não foi possível carregar os dados do estudante.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 py-8 md:py-24 px-8 md:px-16 drop-shadow-lg shadow-black rounded-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">
            Meu <span className="text-blue-300">Perfil</span>
          </h1>

          <Link
            href="/editar-perfil"
            className="px-5 py-2.5 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 border border-white/20"
            aria-label="Editar perfil"
          >
            Editar Perfil
          </Link>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
          {/* Avatar */}
          <div className="relative group w-full lg:w-auto">
            {student.profileImage ? (
              <img 
                src={student.profileImage} 
                alt={student.name}
                className="w-32 h-32 rounded-2xl object-cover border-2 border-white/20 shadow-lg group-hover:shadow-xl transition-all"
                width={128}
                height={128}
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center mx-auto lg:mx-0 shadow-lg group-hover:shadow-xl transition-all">
                <span className="text-5xl font-bold text-white">
                  {getInitials(student.name)}
                </span>
              </div>
            )}
            <div className="absolute -inset-2 rounded-2xl bg-blue-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* Student Info */}
          <div className="flex-1 w-full space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">{student.name}</h2>
              <p className="text-blue-200">{student.fullName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-blue-600/30">
                  <Mail size={18} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Email</p>
                  <p className="text-white font-medium break-words">
                    {student.email || "Não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-blue-600/30">
                  <Phone size={18} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Telefone</p>
                  <p className="text-white font-medium">
                    {student.phone || "Não informado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex overflow-x-auto pb-2 gap-4 scrollbar-hide">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex-shrink-0 flex items-center gap-4 p-5 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all border border-white/10 min-w-[220px]"
            >
              <div className="p-3 rounded-lg bg-blue-500/20">{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-blue-200">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}