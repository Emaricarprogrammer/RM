"use client";

import {
  BookOpen,
  Users,
  ArrowLeft,
  Search,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/app/_components/Footer";

export default function InstructorsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const instructorsPerPage = 6;

  // Gerador de formadores de exemplo
  const generateMockInstructors = () => {
    const mockInstructors = [];

    for (let i = 1; i <= 24; i++) {
      mockInstructors.push({
        id: i,
        name:
          i % 2 === 0
            ? `Maria Souza ${Math.floor(i / 2)}`
            : `João Silva ${Math.floor(i / 2)}`,
        bio: `Engenheiro(a) de software com ${
          8 + i
        } anos de experiência em desenvolvimento.`,
        image_url:
          i % 2 === 0
            ? `https://randomuser.me/api/portraits/women/${i % 50}.jpg`
            : `https://randomuser.me/api/portraits/men/${i % 50}.jpg`,
        total_courses: 5 + i,
        total_students: 5000 + i * 500,
      });
    }
    return mockInstructors;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleDeleteClick = (instructor) => {
    setInstructorToDelete(instructor);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Aqui você implementaria a lógica para deletar o formador
    console.log("Formador deletado:", instructorToDelete);
    setShowDeleteModal(false);
    setInstructorToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setInstructorToDelete(null);
  };

  // Filtra os formadores
  const filteredInstructors = generateMockInstructors().filter(
    (instructor) =>
      submittedSearch === "" ||
      instructor.name.toLowerCase().includes(submittedSearch.toLowerCase()) ||
      instructor.bio.toLowerCase().includes(submittedSearch.toLowerCase())
  );

  // Paginação
  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = filteredInstructors.slice(
    indexOfFirstInstructor,
    indexOfLastInstructor
  );
  const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col">
          {/* Cabeçalho com título, busca e botão de adicionar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                Nossos Formadores
              </h1>
              <Link
                href="/admin/adicionar-formador"
                className="flex items-center gap-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Adicionar
              </Link>
            </div>

            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <div className="flex gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Pesquise por formadores"
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-700 focus:border-blue-700 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium py-3 px-4 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  <Search className="w-5 h-5" />
                  Pesquisar
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Formadores */}
          {currentInstructors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentInstructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 relative"
                  >
                    {/* Botões de ação */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Link
                        href={`/admin/editar-formador?id=${instructor.id}`}
                        className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(instructor)}
                        className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                        title="Apagar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-6 pt-12">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={instructor.image_url}
                          alt={instructor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {instructor.name}
                          </h2>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {instructor.bio}
                      </p>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="w-4 h-4 mr-1" />
                          <span>{instructor.total_courses} cursos</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          <span>
                            {instructor.total_students.toLocaleString("pt-BR")}{" "}
                            alunos
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/admin/perfil-formador?id=${instructor.id}`}
                        className="w-full block text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-md transition-all"
                      >
                        Ver Perfil
                      </Link>
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                          className={`w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center ${
                            currentPage === pageNum
                              ? "bg-gradient-to-br from-blue-900 to-blue-700 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
                Nenhum formador encontrado com esse termo de busca.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Modal de Confirmação */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja remover o formador{" "}
              {instructorToDelete?.name}? Esta ação não pode ser desfeita.
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
    </div>
  );
}
