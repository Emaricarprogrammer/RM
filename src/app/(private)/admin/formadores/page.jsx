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
import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { AllInstrutors } from "@/api/Users/Instructors/allInstructors";
import { deleteInstructor } from "@/api/Users/Instructors/deleteInstructor";
import { Loading } from "@/app/_components/Loading";
import { toast, Toaster} from "react-hot-toast";
import { useUserAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function InstructorsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const instructorsPerPage = 6;
  const {loading: isAuthLoading} = useUserAuth(["ADMIN"])
  const router = useRouter()
  const token = localStorage.getItem("access")

  useEffect(() => {
    if (!isAuthLoading && token)
    {
    const fetchInstructors = async () => {
      try {
        const data = await AllInstrutors();
        setInstructors(data.response);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchInstructors()
  }
  }, [isAuthLoading, token]);
  
if (isAuthLoading)
{
  return (
    <Loading message="Academia Egaf..."/>
  )
}
  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleDeleteClick = (instructor) => {
    setInstructorToDelete(instructor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Pequeno delay para melhorar a experiência do usuário
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await deleteInstructor(instructorToDelete.id_instructor, token);
      
      // Atualiza a lista após deletar
      setInstructors(prev => prev.filter(i => i.id_instructor !== instructorToDelete.id_instructor));
      
      toast.success("Formador removido com sucesso!");
      
      
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Ocorreu um erro ao remover o formador");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setInstructorToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setInstructorToDelete(null);
  };

  // Função para contar cursos e alunos
  const getCourseAndStudentCounts = (instructor) => {
    const courseCount = instructor.my_courses?.courses?.length || 0;
    const studentCount = instructor.my_courses?.courses?.reduce(
      (total, course) => total + (course.students_count || 0), 0
    ) || 0;
    
    return { courseCount, studentCount };
  };

  // Filtra os formadores
  const filteredInstructors = instructors.filter(
    (instructor) =>
      submittedSearch === "" ||
      instructor.full_name.toLowerCase().includes(submittedSearch.toLowerCase()) ||
      instructor.biography?.toLowerCase().includes(submittedSearch.toLowerCase())
  );

  // Paginação
  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = filteredInstructors.slice(
    indexOfFirstInstructor,
    indexOfLastInstructor
  );
  const totalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);

  if (loading) {
    return <Loading message="Carregando os formadores..." />;
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} className="flex flex-col text-center gap-1 w-full"/>
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
                {currentInstructors.map((instructor) => {
                  const { courseCount, studentCount } = getCourseAndStudentCounts(instructor);
                  
                  return (
                    <div
                      key={instructor.id_instructor}
                      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 relative"
                    >
                      {/* Botões de ação */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Link
                          href={`/admin/editar-formador?id=${instructor.id_instructor}`}
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
                            src={instructor.profile_image || "https://via.placeholder.com/150"}
                            alt={instructor.full_name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">
                              {instructor.full_name}
                            </h2>
                            <p className="text-sm text-gray-500">{instructor.email}</p>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {instructor.biography || "Sem biografia disponível."}
                        </p>

                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <BookOpen className="w-4 h-4 mr-1" />
                            <span>{courseCount} cursos</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{studentCount.toLocaleString("pt-BR")} alunos</span>
                          </div>
                        </div>

                        <Link
                          href={`/admin/perfil-formador?id=${instructor.id_instructor}`}
                          className="w-full block text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-md transition-all"
                        >
                          Ver Perfil
                        </Link>
                      </div>
                    </div>
                  );
                })}
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
                {instructors.length === 0 
                  ? "Nenhum formador cadastrado ainda." 
                  : "Nenhum formador encontrado com esse termo de busca."}
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
              <span className="font-semibold">{instructorToDelete?.full_name}</span>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center min-w-24"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Removendo...
                  </>
                ) : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}