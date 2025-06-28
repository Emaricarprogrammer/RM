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
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Footer } from "@/app/_components/Footer";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCourse } from "@/api/Courses/coursesDetails";
import { Loading } from "@/app/_components/Loading";
import { NotFoundPage } from "@/app/_components/Notfound";
import { jwtDecode } from "jwt-decode";
import { deleteCourse } from "@/api/Courses/deleteCourse";
import toast from "react-hot-toast";
import { DeleteCourseModal } from "./DeleteCourseModal";
import { useUserAuth } from "@/hooks/useAuth";

export default function CourseDetailPage() {
  const [activeModule, setActiveModule] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id_course = searchParams.get('id');
  const { course, loading, mutate } = useCourse(id_course);
  const isAuthLoading = useUserAuth(["ADMIN"])

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserType(decodedToken.userClaims?.userType?.toLowerCase());
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }, []);
  if (isAuthLoading)
    {
      return <Loading message=" Academia Egaf..." />;
    }

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

  const handleEdit = () => {
    router.push(`/admin/editar-curso?id=${id_course}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('access');
      await deleteCourse(id_course, token);
      toast.success("Curso eliminado com sucesso!");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay para visualização do toast
      router.push("/cursos");
    } catch (error) {
      console.error("Erro ao eliminar curso:", error);
      toast.error("Ocorreu um erro ao eliminar o curso");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando os dados do curso..." />;
  }

  if (!course) {
    return <NotFoundPage message="Desculpe mas, não encontramos este curso!" />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Modal de confirmação de exclusão */}
      <DeleteCourseModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        courseTitle={course.title}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho com botão de voltar */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href={userType === 'admin' ? "/cursos" : "/cursos"}
            className="flex items-center bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent hover:from-blue-800 hover:to-blue-600 space-x-2"
          >
            <ArrowLeft className="w-5 h-5 text-blue-700" />
            <span>Voltar para todos os cursos</span>
            </Link>
        </div>

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
            {/* Card de informações */}
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
                  <span>{course.course_type === "ONLINE" ? "Online" : "Presencial"}</span>
                </li>

                <li className="flex items-center">
                  {course.course_type === "ONLINE" ? (
                    <Video className="w-5 h-5 mr-3" />
                  ) : (
                    <Presentation className="w-5 h-5 mr-3" />
                  )}
                  <span>{course.total_lessons} aulas</span>
                </li>
                
                {course.course_type === "ONLINE" && (
                  <li className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-3" />
                    <span>{`${course.modules} módulos`}</span>
                  </li>
                )}

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

                {/* Botão de gerenciar vídeos para admin */}
                {userType === 'admin' && course.course_type=== 'ONLINE'?
                  <li className="pt-4 border-t border-blue-400">
                    <button
                      onClick={() => router.push(`/admin/videos/?id=${id_course}`)}
                      className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-700 hover:bg-blue-800 rounded-md transition-colors"
                    >
                      <Video className="w-5 h-5" />
                      Gerenciar Vídeos
                    </button>
                  </li>
                 : ""}
              </ul>

              {/* Botões de ação para admin */}
              {userType === 'admin' && (
                <div className="mt-6 space-y-2">
                  <button
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white text-blue-700 hover:bg-gray-100 rounded-md transition-colors"
                    disabled={isDeleting}
                  >
                    <Edit className="w-5 h-5" />
                    Editar Curso
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="animate-pulse">Eliminando...</span>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        Eliminar Curso
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Botão de compra para estudantes */}
              {userType === 'student' && (
                <Link
                  href={`/checkout?courseId=${course.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="mt-6 block w-full bg-white hover:bg-gray-100 text-blue-800 font-medium py-3 px-4 rounded-md transition-colors text-center"
                >
                  Comprar Curso
                </Link>
              )}
            </div>

            {/* Módulos */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
              <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-br from-blue-900 to-blue-700">
                <h2 className="text-lg font-semibold text-white">
                  Conteúdo do Curso
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {course.modules && course.modules.map((module, index) => (
                  <div key={index}>
                    <button
                      className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-700 hover:bg-blue-50"
                      onClick={() => toggleModule(index)}
                    >
                      <span className="font-semibold block bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                        Módulo {index + 1}: {module.title}
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
                          {module.lessons && module.lessons.map((lesson, lessonIndex) => (
                            <li
                              key={lessonIndex}
                              className="flex items-center justify-between py-2 px-3 rounded hover:bg-blue-50"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                  <Play className="w-3 h-3 text-blue-600" />
                                </div>
                                <span className="text-gray-600">
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDuration(lesson.duration)}
                              </span>
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

          {/* Instrutor - Visível apenas em mobile */}
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