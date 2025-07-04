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
  CheckCircle,
  FileText,
  Award,
  BarChart2,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Footer } from "@/app/_components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCourse } from "@/api/Courses/coursesDetails";
import { Loading } from "@/app/_components/Loading";
import { NotFoundPage } from "@/app/_components/Notfound";
import { useRouter } from "next/navigation";
import { useCourseAccess } from "@/hooks/useVerifyAccess";
import { useUserAuth } from "@/hooks/useAuth";
import { ErrorPage } from "@/app/_components/ErrorPage";

export default function CourseDetailPage() {
  // Component states
  const [activeModule, setActiveModule] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Get course parameters and data
  const searchParams = useSearchParams();
  const id_course = searchParams.get('id');
  const { course, loading: courseLoading, error: courseError } = useCourse(id_course);
  const {loading: isAuthLoading} = useUserAuth(["student"])
  const router = useRouter();

  // Use the access verification hook
  const accessState = useCourseAccess(id_course);

  // Select first video when course is loaded
  useEffect(() => {
    if (course?.modules?.length > 0 && course.modules[0]?.lessons?.length > 0) {
      setSelectedVideo(course.modules[0].lessons[0]);
    }
  }, [course]);

  // Helper functions
  const toggleModule = (index) => {
    setActiveModule(activeModule === index ? null : index);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    if (window.innerWidth < 1024) {
      document.getElementById('video-player')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      month: "long",
      year: "numeric",
    });
  };

  // Calculate total lessons
  const totalLessons = course?.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;

  if(isAuthLoading)
  {
    return (
      <Loading message="Academia Egaf..."/>
    )
  }
  // Conditional rendering flow
  if (accessState.loading || courseLoading) {
    return <Loading message="Carregando dados do curso..." />;
  }

  if (accessState.error) {
    return (
      <ErrorPage message="Ocorreu um erro"/>
    );
  }

  if (!accessState.hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Acesso não autorizado</h2>
        <p className="text-gray-700 mb-6">
          Você não tem permissão para acessar este conteúdo. Por favor, adquira o curso.
        </p>
        <Link 
          href={`/cursos/comprar?id=${id_course}`} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Adquirir curso
        </Link>
      </div>
    );
  }

  if (courseError || !course) {
    return <NotFoundPage message={courseError || "Curso não encontrado"} />;
  }

  // Course content rendering
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/cursos"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para cursos
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex flex-col lg:w-2/3">
            {/* Main video player */}
            <div className="bg-gray-900 rounded-xl overflow-hidden mb-6 shadow-xl" id="video-player">
              {selectedVideo ? (
                <div className="aspect-video relative">
                  <video
                    controls
                    autoPlay
                    className="w-full h-full rounded-lg"
                    src={selectedVideo.videoUrl}
                    poster={selectedVideo.thumbnailUrl}
                  >
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
                    {selectedVideo.duration || '00:00'}
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-800 flex items-center justify-center rounded-lg text-white">
                  <p>Selecione uma aula para começar</p>
                </div>
              )}
            </div>

            {/* Title and actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {course.title}
              </h1>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-full ${isBookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Course metadata */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <Tag className="w-4 h-4 mr-2" />
                {course.category || "Categoria não disponível"}
              </div>
              <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <BarChart2 className="w-4 h-4 mr-2" />
                {course.course_type || "Tipo de curso não especificado"}
              </div>
              <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                <Users className="w-4 h-4 mr-2" />
                {(course.total_watching || 0).toLocaleString("pt-BR")} alunos
              </div>
            </div>

            {/* Course description */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Sobre este curso</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line mb-4">
                  {course.description?.trim() || "Descrição não disponível"}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">O que você vai aprender</h3>
                      <ul className="mt-2 space-y-2 text-gray-600">
                        {course.learnings?.split('\n').filter(Boolean).map((item, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        )) || <li>Habilidades valiosas para seu desenvolvimento</li>}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Requisitos</h3>
                      <ul className="mt-2 space-y-2 text-gray-600">
                        {course.requirements?.split('\n').filter(Boolean).map((req, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        )) || <li>Nenhum requisito prévio necessário</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor (desktop) */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Sobre o formador
              </h3>
              <div className="flex gap-6">
                <img
                  src={course.instructors_datas?.profile_image || "/placeholder-instructor.jpg"}
                  alt={course.instructors_datas?.full_name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-100"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-xl text-gray-900 mb-1">
                        {course.instructors_datas?.full_name || "Instrutor não disponível"}
                      </h4>
                      <p className="text-blue-600 text-sm mb-3">
                        {course.instructors_datas?.title || "Formador"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <p className={`text-gray-600 ${showFullBio ? '' : 'line-clamp-3'}`}>
                      {course.instructors_datas?.biography || "Biografia não disponível"}
                    </p>
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-1"
                    >
                      {showFullBio ? "Mostrar menos" : "Mostrar mais"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Info card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-6">
              <div className="p-6">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <Video className="w-5 h-5 text-blue-600 mr-3" />
                    <span>{totalLessons} aulas em vídeo sob demanda</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <span>{formatDuration(course.duration)} de conteúdo</span>
                  </li>
                  <li className="flex items-center">
                    <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                    <span>{course.modules?.length || 0} módulos completos</span>
                  </li>
                  <li className="flex items-center">
                    {course.course_type === "ONLINE" ? (
                      <Monitor className="w-5 h-5 text-blue-600 mr-3" />
                    ) : (
                      <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                    )}
                    <span>{course.course_type === "ONLINE" ? "Acesso vitalício" : "Datas flexíveis"}</span>
                  </li>
                </ul>
              </div>
              
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h3 className="font-medium text-gray-900 mb-2">Este curso inclui:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Acesso no celular
                  </span>
                  <span className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Certificado
                  </span>
                  <span className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Recursos para download
                  </span>
                  <span className="flex items-center text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Suporte do instrutor
                  </span>
                </div>
              </div>
            </div>

            {/* Course modules */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Conteúdo do Curso
                  </h2>
                  <span className="text-sm text-gray-500">
                    {totalLessons} aulas • {formatDuration(course.duration)}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {course.modules?.map((module, index) => (
                  <div key={index} className="bg-gray-50 even:bg-white">
                    <button
                      className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-100 transition-colors"
                      onClick={() => toggleModule(index)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-900">
                          {module.title}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-3">
                          {module.lessons?.length || 0} aulas
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            activeModule === index ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {activeModule === index && (
                      <div className="px-6 pb-4">
                        <ul className="space-y-2">
                          {module.lessons?.map((lesson, lessonIndex) => (
                            <li
                              key={lessonIndex}
                              className={`flex items-center justify-between py-2 px-3 rounded-lg transition-all ${
                                selectedVideo?.id === lesson.id 
                                  ? 'bg-blue-50 border border-blue-100' 
                                  : 'hover:bg-gray-100 cursor-pointer'
                              }`}
                              onClick={() => handleVideoSelect(lesson)}
                            >
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                  selectedVideo?.id === lesson.id 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                  <Play className="w-3 h-3" />
                                </div>
                                <div>
                                  <span className={`block ${
                                    selectedVideo?.id === lesson.id 
                                      ? 'text-blue-600 font-medium' 
                                      : 'text-gray-700'
                                  }`}>
                                    {lesson.title}
                                  </span>
                                </div>
                              </div>
                              {lesson.is_preview && (
                                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">
                                  Grátis
                                </span>
                              )}
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

          {/* Instructor (mobile) */}
          <div className="lg:hidden bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Sobre o formador
            </h3>
            <div className="flex gap-4">
              <img
                src={course.instructors_datas?.profile_image || "/placeholder-instructor.jpg"}
                alt={course.instructors_datas?.full_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                  {course.instructors_datas?.full_name || "Instrutor não disponível"}
                </h4>
                
                <div className="relative">
                  <p className={`text-gray-600 text-sm ${showFullBio ? '' : 'line-clamp-2'}`}>
                    {course.instructors_datas?.biography || "Biografia não disponível"}
                  </p>
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-1"
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