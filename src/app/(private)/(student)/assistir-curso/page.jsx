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
import { useState, useEffect } from "react";
import { Footer } from "@/app/_components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCourse } from "@/api/Courses/coursesDetails";
import { Loading } from "@/app/_components/Loading";
import { NotFoundPage } from "@/app/_components/Notfound";

export default function CourseDetailPage() {
  const [activeModule, setActiveModule] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const searchParams = useSearchParams();
  const id_course = searchParams.get('id');
  const { course, loading, error } = useCourse(id_course);

  // Seleciona o primeiro vídeo por padrão quando os dados são carregados
  useEffect(() => {
    if (course?.modules?.length > 0 && course.modules[0]?.lessons?.length > 0) {
      setSelectedVideo(course.modules[0].lessons[0]);
    }
  }, [course]);

  const toggleModule = (index) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  if (loading) {
    return <Loading message="Carregando dados do curso..." />;
  }

  if (error || !course) {
    return <NotFoundPage message={error || "Curso não encontrado"} />;
  }

  // Funções auxiliares para formatação
  const formatDuration = (minutes) => {
    if (!minutes) return "0h 0min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Data não disponível";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
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
            {/* Player de vídeo principal */}
            <div className="bg-slate-100 rounded-lg overflow-hidden mb-6 shadow-lg">
              {selectedVideo ? (
                <div className="aspect-video">
                  <video
                    controls
                    autoPlay
                    className="w-full h-full rounded-lg"
                    src={selectedVideo.videoUrl}
                  >
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">Nenhum vídeo selecionado</p>
                </div>
              )}
            </div>

            {/* Descrição do curso */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
                {course.title}
              </h1>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {course.description?.trim() || "Descrição não disponível"}
              </p>
            </div>

            {/* Instrutor (desktop) */}
            <div className="hidden lg:block bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Sobre o formador
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={course.instructors_datas?.profile_image || "/placeholder-instructor.jpg"}
                  alt={course.instructors_datas?.full_name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-2xl sm:text-lg mb-4 sm:mb-1 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                    {course.instructors_datas?.full_name || "Instrutor não disponível"}
                  </h4>
                  <div className="relative">
                    <p className="text-gray-600 mb-3">
                      {showFullBio
                        ? course.instructors_datas?.biography || "Biografia não disponível"
                        : `${(course.instructors_datas?.biography || "Biografia não disponível").slice(0, 160)}...`}
                    </p>
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent font-medium hover:from-blue-800 hover:to-blue-600"
                    >
                      {showFullBio ? "Mostrar menos" : "Mostrar mais"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra lateral */}
          <div className="lg:w-1/3 space-y-6">
            {/* Informações do curso */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-600 text-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <span className="text-2xl font-bold">
                  {course.price?.toLocaleString("pt-PT", { style: "currency", currency: "AOA" }) || "Preço não disponível"}
                </span>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center">
                  <Tag className="w-5 h-5 mr-3" />
                  <span>{course.category || "Categoria não disponível"}</span>
                </li>

                <li className="flex items-center">
                  {course.course_type === "ONLINE" ? (
                    <Monitor className="w-5 h-5 mr-3" />
                  ) : (
                    <MapPin className="w-5 h-5 mr-3" />
                  )}
                  <span>{course.course_type === "ONLINE" ? "Online" : "Presencial"}</span>
                </li>

                <li className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3" />
                  <span>{course.modules?.length || 0} Módulos</span>
                </li>

                <li className="flex items-center">
                  {course.course_type === "ONLINE" ? (
                    <Video className="w-5 h-5 mr-3" />
                  ) : (
                    <Presentation className="w-5 h-5 mr-3" />
                  )}
                  <span>{course.total_lessons || 0} Aulas</span>
                </li>

                <li className="flex items-center">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>{formatDuration(course.duration)}</span>
                </li>

                <li className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  <span>{(course.total_watching || 0).toLocaleString("pt-BR")} alunos</span>
                </li>

                <li className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>Lançado em {course.createdAt}</span>
                </li>
              </ul>
            </div>

            {/* Módulos do curso */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="px-6 py-4 bg-gradient-to-br from-blue-900 to-blue-700">
                <h2 className="text-lg font-semibold text-white">
                  Conteúdo do Curso
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {course.modules?.map((module, index) => (
                  <div key={index}>
                    <button
                      className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-blue-50"
                      onClick={() => toggleModule(index)}
                    >
                      <span className="font-semibold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                        {module.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          activeModule === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeModule === index && (
                      <div className="px-6 pb-4">
                        <ul className="space-y-2">
                          {module.lessons?.map((lesson, lessonIndex) => (
                            <li
                              key={lessonIndex}
                              className={`flex items-center justify-between py-2 px-3 rounded hover:bg-blue-50 cursor-pointer ${
                                selectedVideo?.id === lesson.id ? 'bg-blue-100' : ''
                              }`}
                              onClick={() => handleVideoSelect(lesson)}
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <Play className="w-3 h-3 text-blue-600" />
                                </div>
                                <span className="text-gray-600">
                                  {lesson.title}
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

          {/* Instrutor (mobile) */}
          <div className="lg:hidden bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Sobre o formador
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={course.instructors_datas?.profile_image || "/placeholder-instructor.jpg"}
                alt={course.instructors_datas?.full_name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-2xl sm:text-lg mb-4 sm:mb-1 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                  {course.instructors_datas?.full_name || "Instrutor não disponível"}
                </h4>
                <div className="relative">
                  <p className="text-gray-600 mb-3">
                    {showFullBio
                      ? course.instructors_datas?.biography || "Biografia não disponível"
                      : `${(course.instructors_datas?.biography || "Biografia não disponível").slice(0, 160)}...`}
                  </p>
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent font-medium hover:from-blue-800 hover:to-blue-600"
                  >
                    {showFullBio ? "Mostrar menos" : "Mostrar mais"}
                  </button>
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