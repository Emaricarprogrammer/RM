"use client"
import {
  Target,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Flame,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState} from "react";
export function TargetAudienceSection() {
const [userType, setUserType] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("access");
      if (token) {
        const decoded = jwtDecode(token);
        setUserType(decoded.userClaims?.userType || null);
      }
    } catch (error) {
      console.error("Erro ao verificar token:", error);
    }
  }, []);
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            <Sparkles size={18} />
            Para quem é este curso?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Você só precisa de{" "}
            <span className="text-blue-600">vontade de aprender</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Não exigimos conhecimentos prévios, apenas comprometimento e paixão
            pelo aprendizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Iniciantes Absolutos
            </h3>
            <p className="text-gray-600 mb-4">
              Nunca estudou o tema? Perfeito! Começaremos do zero juntos.
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              <ArrowUpRight size={18} className="mr-1" />
              Ideal para você
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Mudança de Carreira
            </h3>
            <p className="text-gray-600 mb-4">
              Quer entrar numa nova área? Este é seu ponto de partida.
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              <ArrowUpRight size={18} className="mr-1" />
              Comece aqui
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all">
            <div className="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center mb-6 text-amber-600">
              <Flame size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Auto-Motivados
            </h3>
            <p className="text-gray-600 mb-4">
              Com disciplina, você chegará mais longe do que imagina.
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              <ArrowUpRight size={18} className="mr-1" />
              Sua hora é agora
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all">
            <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 text-emerald-600">
              <Lightbulb size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Curiosos</h3>
            <p className="text-gray-600 mb-4">
              Se tem interesse e vontade, você já tem o necessário.
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              <ArrowUpRight size={18} className="mr-1" />
              Explore conosco
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
            <Link
            href={!userType ? "/criar-conta": "/cursos"}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            {!userType ? "Quero Me Inscrever" :"Começar agora"} <ArrowUpRight size={20} className="ml-2" />
          </Link>

        </div>
      </div>
    </section>
  );
}
