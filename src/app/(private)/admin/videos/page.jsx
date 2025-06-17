"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, ChevronDown, Play, Edit2, X } from "lucide-react";
import { Footer } from "@/app/_components/Footer";
import Link from "next/link";

export default function VideosAdminPage() {
  const [isReady, setIsReady] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [expandedModules, setExpandedModules] = useState([]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Mock de dados do curso e módulos
  const videoData = {
    course: {
      id: 1,
      title: "Curso de Desenvolvimento Web Avançado",
      description:
        "Aprenda as técnicas mais modernas de desenvolvimento web com projetos práticos",
    },
    modules: [
      {
        id: 1,
        title: "Módulo 1",
        videos: [
          { id: 101, title: "Introdução ao Curso" },
          { id: 102, title: "Configurando o Ambiente" },
          { id: 103, title: "Primeiros Passos" },
        ],
      },
      {
        id: 2,
        title: "Módulo 2",
        videos: [
          { id: 201, title: "React Avançado" },
          { id: 202, title: "Gerenciamento de Estado" },
        ],
      },
      {
        id: 3,
        title: "Módulo 3",
        videos: [
          { id: 301, title: "Node.js e Express" },
          { id: 302, title: "Autenticação JWT" },
        ],
      },
    ],
  };

  // Função para alternar módulos expandidos
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const openDeleteModal = (video) => {
    setCurrentVideo(video);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    // Lógica para deletar o vídeo
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Seção do Curso Selecionado */}
        {videoData?.course && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200 flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 min-w-[120px] max-w-[200px] mr-0 md:mr-6 mb-4 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt={videoData.course.title}
                className="w-full h-full min-h-[120px] object-cover rounded-md"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-lg md:text-xl font-semibold text-blue-800">
                Curso selecionado:
              </h2>
              <p className="text-blue-900 font-medium text-base md:text-lg">
                {videoData.course.title}
              </p>
              <p className="text-blue-700 text-sm md:text-base mt-1">
                {videoData.course.description}
              </p>
            </div>
          </div>
        )}

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Gestão de Vídeos
            </h1>
            <p className="text-gray-600">Gerencie os vídeos deste curso</p>
          </div>

          <div className="w-full md:w-auto">
            <Link
              href="/admin/adicionar-videos"
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity w-full md:w-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar vídeos</span>
            </Link>
          </div>
        </div>

        {/* Lista de Módulos e Vídeos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <h2 className="px-6 py-4 bg-gradient-to-br from-blue-900 to-blue-700 text-lg font-semibold text-white">
            Conteúdo do Curso
          </h2>

          <div className="divide-y divide-gray-200">
            {videoData.modules.map((module) => (
              <div key={module.id}>
                <button
                  className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-gray-700 hover:bg-blue-50"
                  onClick={() => toggleModule(module.id)}
                >
                  <span className="font-semibold text-blue-900">
                    {module.title}
                  </span>
                  {isReady && (
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        expandedModules.includes(module.id) ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {expandedModules.includes(module.id) && (
                  <div className="px-6 pb-4">
                    <ul className="space-y-2">
                      {module.videos.map((video) => (
                        <li
                          key={video.id}
                          className="flex items-center justify-between py-2 px-3 rounded hover:bg-blue-50"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <Play className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-gray-600">{video.title}</span>
                          </div>
                          <div className="flex gap-3">
                            <Link
                              href={`/admin/editar-video?courseId=${videoData.course.id}&videoId=${video.id}`}
                              className="text-blue-800 hover:text-blue-600"
                              title="Editar vídeo"
                            >
                              <Edit2 className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => openDeleteModal(video)}
                              className="text-red-600 hover:text-red-800"
                              title="Excluir vídeo"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
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

      {/* Modal de Exclusão */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 relative">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Confirmar Exclusão
              </h3>
              <p className="text-gray-700 mb-6">
                Tem certeza que deseja excluir o vídeo "{currentVideo?.title}"?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
