"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { MyCourses } from "@/api/Users/Students/myCourses";
import { useRouter } from "next/navigation";

export function OngoingCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // 1. Obter o token do localStorage
        const token = localStorage.getItem('access');
        
        if (!token)
        {
          return;
        }

        // 2. Decodificar o token para obter o id_student
        const decodedToken = jwtDecode(token);
        const id_student = decodedToken.userClaims.id_student;

        if (!id_student)
        {
          return;
        }

        // 3. Buscar cursos da API
        const coursesData = await MyCourses(id_student, token);
        console.log(coursesData)
        
        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
          setFilteredCourses(coursesData);
        } else {
          setCourses([]);
          setFilteredCourses([]);
        }
      } catch (err) {
        console.error("Erro ao carregar cursos:", err);
        setError(err.message);
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const continueWatching = (courseId) => {
    window.location.href = `/assistir-curso?id=${courseId}`
  };

  if (loading) {
    return (
      <div className="text-gray-900">
        <div className="bg-white rounded-lg px-6 py-12 md:p-8 space-y-6 md:space-y-7 shadow-md">
          <h1 className="text-xl md:text-2xl text-center lg:text-left font-semibold text-blue-900">
            Cursos que está fazendo
          </h1>
          <div className="flex justify-center py-10">
            <p>Carregando cursos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-gray-900">
        <div className="bg-white rounded-lg px-6 py-12 md:p-8 space-y-6 md:space-y-7 shadow-md">
          <h1 className="text-xl md:text-2xl text-center lg:text-left font-semibold text-blue-900">
            Cursos que está fazendo
          </h1>
          <div className="text-red-500 text-center py-10">
            <p>Erro ao carregar cursos: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900">
      <div className="">
        <div className="bg-white rounded-lg px-6 py-12 md:p-8 space-y-6 md:space-y-7 shadow-md">
          <h1 className="text-xl md:text-2xl text-center lg:text-left font-semibold text-blue-900">
            Cursos que está fazendo
          </h1>

          <form onSubmit={handleSearch} className="space-y-12">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2">
              <input
                type="text"
                placeholder="Pesquise por cursos que está fazendo"
                className="w-full sm:max-w-96 border-0 bg-transparent rounded-md py-3 px-4 text-zinc-900 text-base ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="py-3 px-2 w-full sm:w-32 bg-gradient-to-br from-blue-900 to-blue-700 hover:opacity-90 transition-opacity text-white rounded shadow font-medium text-sm sm:text-base"
              >
                Pesquisar
              </button>
            </div>
          </form>

          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course.id_course}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 mb-2 sm:mb-12"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-full object-cover object-center border-b border-gray-200"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {course.description}
                      </p>
                      <button
                        className="w-full py-2 bg-gradient-to-br from-blue-900 to-blue-700 hover:opacity-90 transition-opacity text-white rounded-md font-medium"
                        onClick={() => continueWatching(course.id_course)}
                      >
                        Continuar assistindo
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 space-y-4">
                  <p className="text-gray-500">
                    {courses.length === 0 
                      ? "Você ainda não está matriculado em nenhum curso." 
                      : "Nenhum curso encontrado com o termo pesquisado."}
                  </p>
                  <div className="flex justify-center">
                    <Link href={"/cursos"}>
                      <button className="py-3 px-6 bg-gradient-to-br from-blue-900 to-blue-700 hover:opacity-90 transition-opacity text-white rounded shadow font-medium">
                        Pesquisar por outros cursos
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {filteredCourses.length > 0 && (
              <div className="flex justify-center sm:justify-start">
                <Link href={"/cursos"}>
                  <button className="py-3 px-8 bg-gradient-to-br from-blue-900 to-blue-700 hover:opacity-90 transition-opacity text-white rounded shadow font-medium">
                    Pesquisar por outros cursos
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}