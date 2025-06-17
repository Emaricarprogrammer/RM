"use client";

import {
  ChevronDown,
  Play,
  Clock,
  Users,
  Calendar,
  Video,
  BookOpen,
  MapPin,
  Monitor,
  Tag,
  Presentation,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "@/app/_components/Footer";
import Link from "next/link";

export default function CourseDetailPage() {
  const [activeModule, setActiveModule] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);

  const toggleModule = (index) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const course = {
    title: "Introdução ao Desenvolvimento Web Moderno",
    description: `Neste curso você aprenderá os fundamentos do desenvolvimento web moderno, incluindo HTML5, CSS3, JavaScript e frameworks populares como React e Next.js.

O curso é projetado para iniciantes que desejam entrar no mundo do desenvolvimento front-end.

Principais tópicos:
- Fundamentos de HTML e CSS
- JavaScript moderno (ES6+)
- Introdução ao React
- Next.js para aplicações full-stack
- Boas práticas de desenvolvimento`,
    instructor: {
      name: "João Silva",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      bio: "Desenvolvedor front-end com mais de 10 anos de experiência, especializado em React e Vue.js. Já trabalhou em grandes empresas como Google e Facebook, e agora dedica seu tempo a ensinar novos desenvolvedores. Acredita que a educação de qualidade pode transformar vidas e carreiras.",
    },
    stats: {
      modules: 3,
      videos: 9,
      duration: "8h 15min",
      students: 1245,
      launchDate: "15/03/2023",
      type: "online", // ou "presencial"
      category: "Desenvolvimento Web",
    },
    videoUrl: "https://www.youtube.com/embed/l2UDgpLz20M",
    modules: [
      {
        title: "Módulo 1",
        videos: [
          { title: "O que é HTML5?" },
          { title: "Estrutura básica de um documento HTML" },
          { title: "Tags semânticas" },
        ],
      },
      {
        title: "Módulo 2",
        videos: [
          { title: "Introdução ao CSS" },
          { title: "Seletores e propriedades" },
          { title: "Flexbox e Grid" },
        ],
      },
      {
        title: "Módulo 3",
        videos: [
          { title: "Sintaxe e variáveis" },
          { title: "Funções e eventos" },
          { title: "Manipulação do DOM" },
        ],
      },
    ],
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/cursos"
          className="flex items-center bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent hover:from-blue-800 hover:to-blue-600 mb-6 space-x-2"
        >
          <ArrowLeft className="w-5 h-5 text-blue-700" />
          <span>Voltar para todos os cursos</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Container principal - Vídeo, detalhes e formador (este último vai para baixo em mobile) */}
          <div className="flex flex-col lg:w-2/3">
            {/* Sessão do vídeo */}
            <div className="bg-slate-100 rounded-lg overflow-hidden mb-6 shadow-lg">
              <iframe
                className="w-full aspect-video rounded-lg"
                src={course.videoUrl}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Descrição */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
                {course.title}
              </h1>

              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {course.description.trim()}
              </p>
            </div>

            {/* Em telas grandes, o formador fica na esquerda */}
            <div className="hidden lg:block bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
              <h3 className="text-center sm:text-left text-xl font-semibold text-blue-800 mb-4">
                Sobre o formador
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={course.instructor.image}
                  alt={course.instructor.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
                />
                <div>
                  <h4 className="font-semibold text-2xl sm:text-lg text-center sm:text-left -mt-2 sm:mt-0 mb-4 sm:mb-1 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                    {course.instructor.name}
                  </h4>
                  <p className="text-gray-600 mb-3">
                    {showFullBio
                      ? course.instructor.bio
                      : `${course.instructor.bio.slice(0, 160)}...`}
                  </p>
                  <Link
                    href={`/perfil-formador?id=${course.instructor.id || "1"}`} // substitua '1' pelo ID real se disponível
                    className="bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent font-medium hover:from-blue-800 hover:to-blue-600"
                  >
                    Ver perfil completo
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Container da direita - Informações e módulos */}
          <div className="lg:w-1/3">
            {/* Informações relevantes */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg shadow-lg -mt-6 lg:-mt-0 p-6 mb-6 text-white">
              <h3 className="text-2xl font-bold mb-4">Informações do Curso</h3>

              <ul className="space-y-5">
                <li className="flex items-center">
                  <Tag className="w-5 h-5 mr-3" />
                  <span>{course.stats.category}</span>
                </li>

                <li className="flex items-center">
                  {course.stats.type === "online" ? (
                    <Monitor className="w-5 h-5 mr-3" />
                  ) : (
                    <MapPin className="w-5 h-5 mr-3" />
                  )}
                  <span>{course.stats.type}</span>
                </li>

                <li className="flex items-center">
                  {course.stats.type === "online" ? (
                    <Video className="w-5 h-5 mr-3" />
                  ) : (
                    <Presentation className="w-5 h-5 mr-3" />
                  )}
                  <span>{course.stats.videos} Aulas</span>
                </li>

                <li className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3" />
                  <span>{course.stats.modules} Módulos</span>
                </li>

                <li className="flex items-center">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>{course.stats.duration} totais</span>
                </li>

                <li className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <span>
                    {course.stats.students.toLocaleString("pt-BR")} alunos
                  </span>
                </li>

                <li className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Lançado em {course.stats.launchDate}</span>
                </li>
              </ul>
            </div>

            {/* Módulos */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <h2 className="px-6 py-4 bg-gradient-to-br from-blue-900 to-blue-700 text-lg font-semibold text-white">
                Conteúdo do Curso
              </h2>

              <div className="divide-y divide-gray-200">
                {course.modules.map((module, index) => (
                  <div key={index} className="border-b border-gray-200">
                    <button
                      className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                      onClick={() => toggleModule(index)}
                    >
                      <span className="font-semibold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                        {module.title}
                      </span>

                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          activeModule === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeModule === index && (
                      <div className="px-6 pb-4">
                        <ul className="space-y-2">
                          {module.videos.map((video, videoIndex) => (
                            <li
                              key={videoIndex}
                              className="flex items-center justify-between py-2 px-3 rounded hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <Play className="w-3 h-3 text-blue-600" />
                                </div>

                                <span className="text-gray-600">
                                  {video.title}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Em telas pequenas, o formador fica depois de tudo */}
          <div className="lg:hidden bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-center sm:text-left text-xl font-semibold text-blue-800 mb-4">
              Sobre o formador
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={course.instructor.image}
                alt={course.instructor.name}
                className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
              />
              <div>
                <h4 className="font-semibold text-2xl sm:text-lg text-center sm:text-left -mt-2 sm:mt-0 mb-4 sm:mb-1 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                  {course.instructor.name}
                </h4>
                <p className="text-gray-600 mb-3">
                  {showFullBio
                    ? course.instructor.bio
                    : `${course.instructor.bio.slice(0, 160)}...`}
                </p>
                <Link
                  href={`/perfil-formador?id=${course.instructor.id || "1"}`} // substitua '1' pelo ID real se disponível
                  className="bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent font-medium hover:from-blue-800 hover:to-blue-600"
                >
                  Ver perfil completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
