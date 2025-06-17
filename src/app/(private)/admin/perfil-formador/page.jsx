"use client";

import {
  BookOpen,
  Users,
  Clock,
  ArrowLeft,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/app/_components/Footer";

export default function InstructorProfilePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const coursesPerPage = 3;

  // Gerador de cursos de exemplo
  const generateMockCourses = () => {
    const mockCourses = [];
    for (let i = 1; i <= 12; i++) {
      mockCourses.push({
        id: i,
        title: `Curso ${i} - ${
          i % 2 === 0 ? "React Avançado" : "TypeScript Masterclass"
        }`,
        description:
          i % 2 === 0
            ? `Aprenda técnicas avançadas de React na edição ${i}`
            : `Domine TypeScript do zero ao avançado na edição ${i}`,
        image_url:
          i % 2 === 0
            ? "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            : "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*ud0sEpluCXzmf9Jr7x37UA.png",
        duration: 300 + i * 10,
        students: 500 + i * 50,
        price: 19999.99 + i * 500,
      });
    }
    return mockCourses;
  };

  const instructor = {
    id: 1,
    name: "Maria Souza",
    bio: `Engenheira de software com 8 anos de experiência em desenvolvimento front-end. Especialista em React e arquitetura de aplicações escaláveis. Já trabalhou em empresas como Netflix e Uber. Atualmente dedica-se ao ensino online, compartilhando conhecimento com milhares de alunos em toda a lusofonia. Participou de conferências internacionais como ReactConf e JSWorld.`,
    image_url: "https://randomuser.me/api/portraits/women/44.jpg",
    total_courses: 12,
    total_students: 12450,
    courses: generateMockCourses(),
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm);
    setCurrentPage(1);
  };

  const filteredCourses = instructor.courses.filter(
    (course) =>
      submittedSearch === "" ||
      course.title.toLowerCase().includes(submittedSearch.toLowerCase()) ||
      course.description.toLowerCase().includes(submittedSearch.toLowerCase())
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    console.log("Formador deletado:", instructor.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja remover o formador {instructor.name}? Esta
              ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirmar Remoção
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/admin/formadores"
          className="flex items-center bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent hover:from-blue-800 hover:to-blue-600 mb-6 space-x-2"
        >
          <ArrowLeft className="w-5 h-5 text-blue-700" />
          <span>Voltar para todos os formadores</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Conteúdo Principal - Ordem mobile: Perfil → Estatísticas → Cursos */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* 1. Card do Formador */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={instructor.image_url}
                  alt={instructor.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="w-full">
                  <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2">
                      {instructor.name}
                    </h1>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/editar-formador?id=${instructor.id}`}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
                        title="Editar perfil"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={handleDeleteClick}
                        className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
                        title="Apagar perfil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="w-5 h-5 text-gray-500 mr-2" />
                      <span>{instructor.total_courses} cursos</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 text-gray-500 mr-2" />
                      <span>
                        {instructor.total_students.toLocaleString("pt-BR")}{" "}
                        alunos
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {instructor.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Estatísticas (APENAS MOBILE) */}
            <div className="block lg:hidden">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Estatísticas
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 py-6 px-4 rounded-lg">
                    <div className="flex items-center">
                      <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Total de Cursos</p>
                        <p className="text-xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                          {instructor.total_courses}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 py-6 px-4 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Total de Alunos</p>
                        <p className="text-xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                          {instructor.total_students.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Cursos Ministrados */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent mb-6">
                Cursos Ministrados
              </h2>

              <div className="mb-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Pesquise por cursos"
                        className="w-full pl-10 pr-3 py-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-700 focus:border-blue-700 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-md transition-all whitespace-nowrap"
                    >
                      Pesquisar
                    </button>
                  </div>
                </form>
              </div>

              {currentCourses.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {currentCourses.map((course) => (
                      <div
                        key={course.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3">
                            <img
                              src={course.image_url}
                              alt={course.title}
                              className="w-full h-full min-h-[180px] object-cover"
                            />
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {course.title}
                              </h3>
                              <span className="text-xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                                {course.price.toLocaleString("pt-PT")} Kz
                              </span>
                            </div>

                            <p className="text-gray-600 mb-4">
                              {course.description}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="flex items-center text-gray-700">
                                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                                <span>{formatDuration(course.duration)}</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <Users className="w-5 h-5 text-gray-500 mr-2" />
                                <span>
                                  {course.students.toLocaleString("pt-BR")}{" "}
                                  alunos
                                </span>
                              </div>
                            </div>

                            <Link
                              href={`/detalhes-do-curso?id=${course.id}`}
                              className="inline-flex items-center bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent font-medium hover:from-blue-800 hover:to-blue-600"
                            >
                              Ver curso detalhes →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  currentPage === pageNum
                                    ? "bg-gradient-to-br from-blue-900 to-blue-700 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <span className="mx-1">...</span>
                        )}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-gray-700 hover:bg-gray-100"
                          >
                            {totalPages}
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Nenhum curso encontrado com esse termo de busca.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas (APENAS DESKTOP) */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Estatísticas
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 py-6 px-4 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total de Cursos</p>
                      <p className="text-xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                        {instructor.total_courses}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 py-6 px-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total de Alunos</p>
                      <p className="text-xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                        {instructor.total_students.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
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
