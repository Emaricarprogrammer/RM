"use client"
import { useState, useEffect } from "react";
import { Trash2, Plus, ChevronDown, Edit2, X, Folder, Film, User, ArrowLeft } from "lucide-react";
import { Footer } from "@/app/_components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/api/api";
import { Loading } from "@/app/_components/Loading";
import { useUserAuth } from "@/hooks/useAuth";
import { NotFoundPage } from "@/app/_components/Notfound";
import { DeleteVideo } from "@/api/Courses/videos/deleteVideo";
import { groupVideosIntoModules } from "@/api/Courses/videos/getModules";
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function VideosAdminPage() {
  const searchParams = useSearchParams();
  const idCurse = searchParams.get("id");
  const {loading: isAuthLoading} = useUserAuth(["ADMIN"]);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [expandedModules, setExpandedModules] = useState([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoData, setCurrentVideoData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    if (!idCurse) {
      setError("ID do curso não fornecido");
      setLoading(false);
      return;
    }

    if (!isAuthLoading) {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          setError(null);
          const { data } = await api.get(`/courses/${idCurse}`);
          
          if (data.success && data.response) {
            const results = data.response;
            
            const transformedCourse = {
              id_course: results.id_course,
              category: results.category || "Sem categoria",
              title: results.title,
              image_url: results.image_url,
              total_lessons: results.total_lessons,
              description: results.description,
              course_videos: results.course_type === "ONLINE" ? results.course_videos || [] : [],
              course_type: results.course_type,
              instructor_datas: results.instructors_datas || {},
              createdAt: results.createdAt,
              updatedAt: results.updatedAt,
            };
            
            setCourse(transformedCourse);
          } else {
            setError("Curso não encontrado");
          }
        } catch (err) {
          console.error("Erro ao buscar curso:", err);
          setError(err.message || "Erro ao carregar o curso");
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [idCurse, isAuthLoading]);

  // Atualiza os módulos quando os vídeos do curso mudam
  useEffect(() => {
    if (course?.course_videos) {
      const newModules = groupVideosIntoModules(course.course_videos);
      setModules(newModules);
    } else {
      setModules([]);
    }
  }, [course?.course_videos]);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const openDeleteModal = (video) => {
    setCurrentVideo({
      id: video.id,
      title: video.title
    });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const toastId = toast.loading('Deletando vídeo...');
      
      await DeleteVideo(currentVideo.id);
      
      // Atualização otimista do estado
      setCourse(prev => {
        const updatedVideos = prev.course_videos.filter(v => v.id_video !== currentVideo.id);
        return {
          ...prev,
          course_videos: updatedVideos,
          total_lessons: updatedVideos.length
        };
      });

      setIsDeleteModalOpen(false);
      toast.success('Vídeo deletado com sucesso!', { id: toastId });

      window.location.reload()
      
    } catch (error) {
      console.error("Erro ao deletar vídeo:", error);
      toast.error('Erro ao deletar vídeo');
    }
  };

  const handleVideoClick = (video) => {
    setCurrentVideoData({
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      id: video.id
    });
    setVideoModalOpen(true);
  };

  if (isAuthLoading) {
    return <Loading message="Academia Egaf..." />;
  }

  if (loading) {
    return <Loading message="Carregando os detalhes..." />;
  }

  if (error || !course) {
    return <NotFoundPage message="Desculpe, mas não conseguimos encontrar este curso!" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              href={`/cursos`}
              className="flex items-center bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent hover:from-blue-800 hover:to-blue-600 space-x-2"
            >
              <ArrowLeft className="w-5 h-5 text-blue-700" />
              <span>Ir todos os cursos </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Course Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4 lg:w-1/5">
              <div className="aspect-w-16 aspect-h-9 bg-white/10 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={course.image_url || "/default-course.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-course.jpg";
                  }}
                />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
                  {course.course_type === "ONLINE" ? "Online" : "Presencial"}
                </span>
                <span className="text-white/80 text-sm">
                  Criado em: {course.createdAt}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h2>
              <p className="text-white/90 mb-6 max-w-3xl">{course.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>Formador: {course.instructor_datas.user?.full_name || "Instrutor não definido"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Folder className="w-4 h-4" />
                  <span>{course.category}</span>
                </div>
                
                {course.course_type === "ONLINE" && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Film className="w-4 h-4" />
                      <span>{course.course_videos.length} vídeos</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {course.course_type !== "ONLINE" ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Curso Presencial
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Este é um curso presencial e não possui gestão de vídeos online.
            </p>
            <Link
              href="/admin/cursos"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Voltar para lista de cursos
            </Link>
          </div>
        ) : (
          <>
            {/* Actions */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Vídeos do Curso</h2>
              <Link
                href={`/admin/adicionar-videos?id=${idCurse}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="-ml-1 mr-2 h-4 w-4" />
                Adicionar Vídeo
              </Link>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {modules.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                    <Film className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Nenhum vídeo adicionado
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Comece adicionando vídeos para criar o conteúdo deste curso.
                  </p>
                  <Link
                    href={`/admin/adicionar-videos?id=${idCurse}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    Adicionar Primeiro Vídeo
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {modules.map((module) => (
                    <li key={module.title} className="hover:bg-gray-50 transition-colors">
                      <div className="px-6 py-4">
                        <button
                          onClick={() => toggleModule(module.title)}
                          className="w-full flex justify-between items-center text-left"
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-md mr-4">
                              <Folder className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-base font-medium text-gray-900">{module.title}</h3>
                              <p className="text-sm text-gray-500">
                                {module.lessons.length} vídeos
                              </p>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform ${
                              expandedModules.includes(module.title) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {expandedModules.includes(module.title) && (
                        <div className="px-6 pb-4">
                          <ul className="space-y-2">
                            {module.lessons.map((lesson) => (
                              <li
                                key={lesson.id}
                                className="group flex items-center justify-between p-3 rounded-md border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                              >
                                <button 
                                  onClick={() => handleVideoClick({
                                    title: lesson.title,
                                    description: lesson.description,
                                    video_url: lesson.videoUrl,
                                    id: lesson.id
                                  })}
                                  className="flex-1 min-w-0 text-left"
                                >
                                  <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                                  <p className="text-xs text-gray-500 mt-1 truncate">
                                    {lesson.description}
                                  </p>
                                </button>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Link
                                    href={`/admin/editar-video?id=${lesson.id}`}
                                    className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-100 transition-colors"
                                    title="Editar vídeo"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={() => openDeleteModal({
                                      id: lesson.id,
                                      title: lesson.title
                                    })}
                                    className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-100 transition-colors"
                                    title="Excluir vídeo"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Excluir vídeo</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja excluir o vídeo "{currentVideo?.title}"?
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {currentVideoData?.title || "Visualizar Vídeo"}
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-auto">
              {videoLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
              ) : (
                <>
                  {currentVideoData?.video_url ? (
                    <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                      <video
                        controls
                        className="w-full h-full"
                        src={currentVideoData.video_url}
                      >
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-red-500">URL do vídeo não disponível</p>
                    </div>
                  )}
                  
                  {currentVideoData?.description && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                      <p className="text-gray-600">{currentVideoData.description}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}