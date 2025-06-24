"use client";

import { BookOpen, Users, Clock, ArrowLeft, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { InstrutorProfile } from "@/api/Users/Instructors/InstructorProfile";
import { useSearchParams } from "next/navigation";
import { Loading } from "@/app/_components/Loading";
import { NotFoundPage } from "@/app/_components/Notfound";

export default function InstructorProfilePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [instructor, setInstructor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const coursesPerPage = 3;

    const searchParams = useSearchParams();
    const id_instructor = searchParams.get('id');

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setIsLoading(true);
        const response = await InstrutorProfile(id_instructor);
        setInstructor(response.response);
      } catch (err) {
        console.error("Error fetching instructor data:", err);
        setError("Erro ao carregar perfil do instrutor. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructorData();
  }, [id_instructor]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA"
    }).format(price / 100);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <Loading message="Carregando os dados do perfil..."/>
    );
  }

  if (error) {
    return (
      <NotFoundPage message="Desculpe, mas não conseguimos encontrar este perfil..."/>
    );
  }

  if (!instructor) {
    return (
      <NotFoundPage message="Desculpe, mas não conseguimos encontrar este perfil..."/>
    );
  }

  const filteredCourses = instructor.instructors_courses.courses.filter(
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
  const totalStudents = instructor.instructors_courses.courses.reduce(
    (sum, course) => sum + (course.total_watching || 0),
    0
  );

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
          {/* Conteúdo Principal */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* 1. Card do Formador */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={instructor.profile_image}
                  alt={instructor.full_name}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2">
                    {instructor.full_name}
                  </h1>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="w-5 h-5 text-gray-500 mr-2" />
                      <span>{instructor.instructors_courses.courses.length} cursos</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-5 h-5 text-gray-500 mr-2" />
                      <span>{totalStudents.toLocaleString("pt-BR")} alunos</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {instructor.biography}
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
                          {instructor.instructors_courses.courses.length}
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
                          {totalStudents.toLocaleString("pt-BR")}
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
                        key={course.id_course}
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
                                {formatPrice(course.price)}
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
                                  {(course.total_watching || 0).toLocaleString("pt-BR")} alunos
                                </span>
                              </div>
                            </div>

                            <Link
                              href={`/detalhes-do-curso?id=${course.id_course}`}
                              className="inline-flex items-center bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent font-medium hover:from-blue-800 hover:to-blue-600"
                            >
                              Ver detalhes →
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
                        {instructor.instructors_courses.courses.length}
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
                        {totalStudents.toLocaleString("pt-BR")}
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