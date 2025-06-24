"use client";

import { Search, ChevronDown, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Footer } from "@/app/_components/Footer";
import CourseCard from "./CourseCard";
import CourseFilters from "./CourseFilters";
import CoursePagination from "./CoursePagination";
import Link from "next/link";
import { GetAllCategories } from "@/api/Courses/Categories/allCategories";
import { GetAllCourses } from "@/api/Courses/allCourses";
import { Loading } from "@/app/_components/Loading";
import {jwtDecode} from "jwt-decode"; // Importe jwt-decode

const COURSES_PER_PAGE = 6;

// Função para obter o userType do token no localStorage
const getUserType = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.userClaims?.userType || null;
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
      }
    }
  }
  return null;
};

// Função para obter os IDs dos cursos comprados (se necessário)
const getPurchasedCourses = () => {
  // Implemente conforme sua lógica de obtenção de cursos comprados
  return [];
};

export default function CourseSearchPage() {
  // Estado para os filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [courseTypes, setCourseTypes] = useState(["online", "presential"]);
  const [currentPage, setCurrentPage] = useState(1);

  // Estados para os dados do usuário
  const [userType, setUserType] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);

  // Estados para os dados da API
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar dados do usuário e da API ao montar o componente
  useEffect(() => {
    // Obter userType do token
    setUserType(getUserType());
    // Obter cursos comprados (se necessário)
    setPurchasedCourses(getPurchasedCourses());

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Buscar categorias
        const categoriesResponse = await GetAllCategories();
        const formattedCategories = categoriesResponse.response.map(cat => ({
          id: cat.id_category_course,
          name: cat.name_category_courses
        }));
        setCategories(formattedCategories);
        
        // Buscar cursos
        const coursesResponse = await GetAllCourses();
        setCourses(coursesResponse.response);
        
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar cursos. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // Funções de manipulação
  function handleSearch(e) {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  }

  function handleCategoryChange(categoryId) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
    setCurrentPage(1);
  }

  function handleCourseTypeChange(type) {
    setCourseTypes((prev) => {
      const newTypes = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];

      // Não permite remover todos - pelo menos um deve estar selecionado
      return newTypes.length === 0 ? [type] : newTypes;
    });
    setCurrentPage(1);
  }

  function resetCategoryFilters() {
    setSelectedCategories([]);
    setCurrentPage(1);
  }

  // Filtrar e ordenar cursos
  function getFilteredCourses() {
    return courses
      .filter((course) => {
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(course.id_category);
        
        const matchesSearch =
          searchQuery === "" ||
          course.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = courseTypes.includes(
          course.course_type.toLowerCase() === "presential" 
            ? "presential" 
            : "online"
        );

        return matchesCategory && matchesSearch && matchesType;
      })
      .sort((a, b) => {
        // Converter createdAt para Date para ordenação
        const dateA = new Date(a.createdAt.split('-').reverse().join('-'));
        const dateB = new Date(b.createdAt.split('-').reverse().join('-'));

        switch (sortOption) {
          case "recent":
            return dateB - dateA;
          case "oldest":
            return dateA - dateB;
          case "title-az":
            return a.title.localeCompare(b.title, "pt");
          case "title-za":
            return b.title.localeCompare(a.title, "pt");
          default:
            return 0;
        }
      });
  }

  const filteredCourses = getFilteredCourses();
  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * COURSES_PER_PAGE,
    currentPage * COURSES_PER_PAGE
  );

  // Função para formatar o preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA"
    }).format(price / 100);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2">
            {userType === "ADMIN" ? "Gerenciar Cursos" : "Nossos Cursos"}
          </h1>
          <p className="text-gray-600 mb-6">
            {userType === "ADMIN"
              ? "Gerencie todos os cursos da plataforma"
              : "Encontre o curso perfeito para impulsionar sua carreira"}
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 lg:gap-14"
          >
            <div className="flex flex-grow gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Pesquisar cursos..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={20}
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-6 py-3 rounded-md transition-all whitespace-nowrap"
              >
                Pesquisar
              </button>
            </div>

            <div className="relative flex-grow min-w-[250px]">
              <select
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent appearance-none bg-white"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recent">Mais recentes primeiro</option>
                <option value="oldest">Mais antigos primeiro</option>
                <option value="title-az">Título (A-Z)</option>
                <option value="title-za">Título (Z-A)</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-3.5 text-gray-400"
                size={20}
              />
            </div>
          </form>
        </div>

        {isLoading ? (
         <Loading message="Carregando os cursos..."/>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros */}
            <div className="w-full lg:w-1/4">
              <CourseFilters
                categories={categories}
                selectedCategories={selectedCategories}
                handleCategoryChange={handleCategoryChange}
                courseTypes={courseTypes}
                handleCourseTypeChange={handleCourseTypeChange}
                resetCategoryFilters={resetCategoryFilters}
              />
            </div>

            {/* Lista de cursos */}
            <div className="w-full lg:w-3/4">
              {userType === "ADMIN" && (
                <div className="mb-6 flex justify-end">
                  <Link
                    href="/admin/adicionar-curso"
                    className="bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Adicionar Novo Curso
                  </Link>
                </div>
              )}

              {currentCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentCourses.map((course) => (
                      <CourseCard
                        key={course.id_course}
                        course={{
                          ...course,
                          priceFormatted: course.price.toLocaleString("pt-PT"),
                          type: course.course_type,
                          instructor: course.instructors_datas?.full_name || "Instrutor não disponível",
                          instructorId: course.instructors_datas?.id_instructor,
                          duration: `${course.duration} horas`,
                          image: course.image_url
                        }}
                        userType={userType}
                        hasPurchased={
                          userType === "student" &&
                          purchasedCourses.includes(course.id_course)
                        }
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <CoursePagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Nenhum curso encontrado
                  </h3>
                  <p className="text-gray-500">
                    Tente ajustar seus filtros ou termos de pesquisa
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}