"use client";

import { Footer } from "@/app/_components/Footer";
import { BookText, Users, DollarSign, GraduationCap, PlusCircle, List } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/app/_components/Loading";
import { BasicsManagements } from "@/api/Users/Admins/basicsManagements";
import { useUserAuth } from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";

export default function AdminHomePage() {
  const [dashboardData, setDashboardData] = useState({
    allStudents: 0,
    allCourses: 0,
    allInstructors: 0,
    allPendingsPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const {loading: isAuthLoading, isAuthorized, userType} = useUserAuth(["ADMIN"]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access');
      
      if (!token) {
        return;
      }

      const decodedToken = jwtDecode(token);
      const id_admin = decodedToken.userClaims.id_admin;

      if (!id_admin) {
        return;
      }

      const result = await BasicsManagements(token, id_admin);
      
      // Verifica tanto result.data quanto result.response para compatibilidade
      const data = result.data || result.response;
      
      if (result.success && data) {
        setDashboardData({
          allStudents: data.allStudents || 0,
          allCourses: data.allCourses || 0,
          allInstructors: data.allInstructors || 0,
          allPendingsPayments: data.allPendingsPayments || 0
        });
      } else {
        throw new Error(result.message || "Erro ao carregar dados do dashboard");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Erro desconhecido ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthorized) {
      fetchData();
    }
  }, [isAuthLoading, isAuthorized]); // Adicionei router como dependência para evitar warnings

  const stats = [
    {
      id: 1,
      value: dashboardData.allStudents.toLocaleString('pt-BR'),
      label: "Total de Alunos",
      icon: <Users size={28} />,
      link: "#",
      color: "from-blue-600 to-blue-400",
    },
    {
      id: 2,
      value: dashboardData.allCourses.toLocaleString('pt-BR'),
      label: "Total de Cursos",
      icon: <BookText size={28} />,
      link: "/cursos",
      color: "from-purple-600 to-purple-400",
    },
    {
      id: 3,
      value: dashboardData.allInstructors.toLocaleString('pt-BR'),
      label: "Formadores",
      icon: <GraduationCap size={28} />,
      link: "/admin/formadores",
      color: "from-green-600 to-green-400",
    },
    {
      id: 4,
      value: dashboardData.allPendingsPayments.toLocaleString('pt-BR'),
      label: "Pagamentos",
      icon: <DollarSign size={28} />,
      link: "/admin/pagamentos",
      color: "from-yellow-600 to-yellow-400",
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: "Adicionar Novo Curso",
      description: "Crie um novo curso para a plataforma",
      icon: <PlusCircle size={24} />,
      link: "/admin/adicionar-curso",
      color: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-50",
    },
    {
      id: 2,
      title: "Gerenciar Cursos",
      description: "Edite ou remova cursos existentes",
      icon: <BookText size={24} />,
      link: "/admin/cursos",
      color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-50",
    },
    {
      id: 3,
      title: "Gerenciar Categorias",
      description: "Adicione ou edite categorias de cursos",
      icon: <List size={24} />,
      link: "/admin/categorias",
      color: "bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-50",
    },
    {
      id: 4,
      title: "Adicionar Formador",
      description: "Registre um novo formador na plataforma",
      icon: <GraduationCap size={24} />,
      link: "/admin/adicionar-formador",
      color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-50",
    },
    
  ];

  if (isAuthLoading) {
      return <Loading message=" Academia Egaf..." />;
  }
  if (!isAuthorized)
  {
    return
  }

  if (loading) {
    return <Loading message="Carregando dados do dashboard..." />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg 
              className="h-6 w-6 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ocorreu um erro</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Tentar novamente
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Voltar ao início
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel de <span className="text-blue-700">Administração</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Gerencie todos os aspectos da plataforma de cursos, clicando nos
            cards abaixo para navegar rapidamente entre as opções disponíveis.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Visão Geral
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Link
                key={stat.id}
                href={stat.link}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 h-full min-h-[180px] flex flex-col justify-between hover:scale-[1.02]`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-white/90 text-lg">{stat.label}</p>
                  </div>
                  <div className="text-white/80 p-2 bg-white/20 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                href={action.link}
                className={`${action.color} p-6 rounded-xl border-2 hover:shadow-md transition-all duration-300 h-full min-h-[160px] flex flex-col justify-center hover:border-opacity-50 hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/50">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm opacity-80 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}