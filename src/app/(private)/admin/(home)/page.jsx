"use client";

import { Footer } from "@/app/_components/Footer";
import {
  BookText,
  Users,
  DollarSign,
  GraduationCap,
  PlusCircle,
  List,
} from "lucide-react";
import Link from "next/link";

export default function AdminHomePage() {
  const stats = [
    {
      id: 1,
      value: 1245,
      label: "Total de Alunos",
      icon: <Users size={28} />,
      link: "#",
      color: "from-blue-600 to-blue-400",
    },
    {
      id: 2,
      value: 42,
      label: "Total de Cursos",
      icon: <BookText size={28} />,
      link: "/cursos",
      color: "from-purple-600 to-purple-400",
    },
    {
      id: 3,
      value: 18,
      label: "Formadores",
      icon: <GraduationCap size={28} />,
      link: "/admin/formadores",
      color: "from-green-600 to-green-400",
    },
    {
      id: 4,
      value: 56,
      label: "Pagamentos Pendentes",
      icon: <DollarSign size={28} />,
      link: "/admin/pagamentos",
      color: "from-yellow-600 to-yellow-400",
    },
  ];

  // Ações rápidas
  const quickActions = [
    {
      id: 1,
      title: "Adicionar Novo Curso",
      description: "Crie um novo curso para a plataforma",
      icon: <PlusCircle size={24} />,
      link: "/admin/adicionar-curso",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      id: 2,
      title: "Gerenciar Cursos",
      description: "Edite ou remova cursos existentes",
      icon: <BookText size={24} />,
      link: "/cursos",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: 3,
      title: "Gerenciar Categorias",
      description: "Adicione ou edite categorias de cursos",
      icon: <List size={24} />,
      link: "/admin/categorias",
      color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    },
    {
      id: 4,
      title: "Adicionar Formador",
      description: "Registre um novo formador na plataforma",
      icon: <GraduationCap size={24} />,
      link: "/admin/adicionar-formador",
      color: "bg-green-100 text-green-800 border-green-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel de <span className="text-blue-700">Administração</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Gerencie todos os aspectos da plataforma de cursos, cliancando nos
            cards abaixo para navegar rapidamente entre as opções disponíveis.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Visão Geral
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Link
                key={stat.id}
                href={stat.link}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 h-full min-h-[180px] flex flex-col justify-between`}
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

        {/* Ações Rápidas */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                href={action.link}
                className={`${action.color} p-6 rounded-xl border-2 hover:shadow-md transition-all duration-300 h-full min-h-[160px] flex flex-col justify-center hover:border-opacity-50`}
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
