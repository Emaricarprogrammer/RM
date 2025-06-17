"use client";

import {
  ChevronDown,
  Play,
  Clock,
  Calendar,
  Video,
  BookOpen,
  Monitor,
  Users,
  ArrowLeft,
  Tag,
  MapPin,
  Presentation,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "@/app/_components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getCourse } from "@/api/Courses/coursesDetails";
import { Loading } from "@/app/_components/Loading";
import { NotFoundPage } from "@/app/_components/Notfound";

export default function CourseDetailPage() {
  const [activeModule, setActiveModule] = useState(null);
  const searchParams = useSearchParams();
  const id_course = searchParams.get('id');
  const {course, loading} = getCourse(id_course)
  const toggleModule = (index) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  if (loading)
  {
    return (
      <Loading message="Carregando os dados do curso..."/>
    )
  }

if (!course)
{
  return (
    <NotFoundPage message="Desculpe mas, não encontramos este curso!"/>
  )
}
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Voltar */}
        <Link
          href="/cursos"
          className="flex items-center bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent hover:from-blue-800 hover:to-blue-600 mb-6 space-x-2"
        >
          <ArrowLeft className="w-5 h-5 text-blue-700" />
          <span>Voltar para todos os cursos</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Conteúdo principal */}
          <div className="flex flex-col lg:w-2/3">
            {/* Imagem */}
            <div className="bg-slate-100 rounded-lg overflow-hidden mb-6 shadow-lg">
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-[505px] rounded-lg object-cover"
              />
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

            {/* Instrutor - Visível apenas em desktop */}
            <div className="hidden lg:block bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
              <h3 className="text-xl text-center sm:text-left font-semibold text-blue-800 mb-4">
                Sobre o formador
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={course.instructors_datas.profile_image}
                  alt={course.instructors_datas.full_name}
                  className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
                />
                <div>
                  <h4 className="font-semibold text-2xl sm:text-lg text-center sm:text-left -mt-2 sm:mt-0 mb-4 sm:mb-1 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                    {course.instructors_datas.full_name}
                  </h4>
                  <div className="relative">
                    <p className="text-gray-600 mb-3 line-clamp-3">
                      {course.instructors_datas.biography}
                    </p>
                    <Link
                      href={`/perfil-formador?id=${course.instructors_datas.id_instructor}`}
                      className="bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent font-medium hover:from-blue-800 hover:to-blue-600"
                    >
                      Ver perfil completo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lateral direita */}
          <div className="lg:w-1/3 space-y-6">
            {/* Card de informações - com margem ajustada */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-600 text-white rounded-lg shadow-lg -mt-6 lg:-mt-0 p-6 border border-gray-100">
              <div className="mb-4">
                <span className="space-x-2 text-2xl font-bold">
                  <span>{course.price.toLocaleString("pt-PT")}</span>
                  <span>Kz</span>
                </span>
              </div>

              <ul className="space-y-5">
                <li className="flex items-center">
                  <Tag className="w-5 h-5 mr-3" />
                  <span>{course.category}</span>
                </li>

                <li className="flex items-center">
                  {course.course_type === "ONLINE" ? (
                    <Monitor className="w-5 h-5 mr-3" />
                  ) : (
                    <MapPin className="w-5 h-5 mr-3" />
                  )}
                  <span>Presencial</span>
                </li>

                <li className="flex items-center">
                  {course.course_type === "ONLINE" ? (
                    <Video className="w-5 h-5 mr-3" />
                  ) : (
                    <Presentation className="w-5 h-5 mr-3" />
                  )}
                  <span>{course.total_lessons} aulas</span>
                </li>
                
              
                {course.course_type === "ONLINE" ? (
                  <>
                <li className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3" />
                  <span>{`${course.modules} modulos`}</span>
              </li>
                </>
              ) : ""}
              

                <li className="flex items-center">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>{formatDuration(course.duration)} totais</span>
                </li>

                <li className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <span>{course.total_watching.toLocaleString("pt-BR")} alunos</span>
                </li>

                <li className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Lançado em {formatDate(course.createdAt)}</span>
                </li>
              </ul>

              {/* Botão */}
              <Link
                href={`/checkout?courseId=${course.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="mt-6 block w-full bg-white hover:bg-gray-100 text-blue-800 font-medium py-3 px-4 rounded-md mb- transition-colors text-center"
              >
                Comprar Curso
              </Link>
            </div>

            {/* Módulos */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <h2 className="px-6 py-4 bg-gradient-to-br from-blue-900 to-blue-700 text-lg font-semibold text-white">
                Conteúdo do Curso
              </h2>

              <div className="divide-y divide-gray-200">
                {/*course.modules.map((module, index) => (
                  <div key={index}>
                    <button
                      className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-700 hover:bg-blue-50"
                      onClick={() => toggleModule(index)}
                      aria-expanded={activeModule === index}
                      aria-controls={`module-${index}-content`}
                    >
                      <span className="font-semibold block bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                        {module.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          activeModule === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeModule === index && (
                      <div id={`module-${index}-content`} className="px-6 pb-4">
                        <ul className="space-y-2">
                          {module.videos.map((video, videoIndex) => (
                            <li
                              key={videoIndex}
                              className="flex items-center justify-between py-2 px-3 rounded hover:bg-blue-50"
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
                ))*/}
              </div>
            </div>
          </div>

          {/* Instrutor - Visível apenas em mobile (aparece no final) */}
          <div className="lg:hidden bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-xl text-center sm:text-left font-semibold text-blue-800 mb-4">
              Sobre o formador
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={course.instructors_datas.profile_image}
                alt={course.instructors_datas.full_name}
                className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
              />
              <div>
                <h4 className="font-semibold text-2xl sm:text-lg text-center sm:text-left -mt-2 sm:mt-0 mb-4 sm:mb-1 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                  {course.instructors_datas.full_name}
                </h4>
                <div className="relative">
                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {course.instructors_datas.biography}
                  </p>
                  <Link
                    href={`/perfil-formador?id=${course.instructors_datas.id_instructor}`}
                    className="bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent font-medium hover:from-blue-800 hover:to-blue-600"
                  >
                    Ver perfil completo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
