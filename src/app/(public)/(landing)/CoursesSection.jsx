import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CoursesSection({ courses = [] }) {
  const displayedCourses =
    courses.length > 0 ? courses.slice(0, 8) : courses;
    
    if (!Array.isArray(courses) || courses.length === 0) {
    return (
      <section id="courses" className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Nenhum curso disponível no momento.</p>
        </div>
      </section>
    );
  }
  return (
    <section id="cursos" className="py-16 sm:py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto px-10 sm:px-10 md:px-12 lg:px-14 xl:px-16 max-w-[1800px]">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 mx-auto max-w-5xl">
          <span className="inline-block mb-3 px-3 py-1 text-xs sm:text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            Nossos Cursos
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Conheça nossos{" "}
            <span className="text-blue-600">cursos populares</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Cursos cuidadosamente elaborados para impulsionar sua carreira.
          </p>
        </div>

        {/* Grid de Cursos - 4 colunas em telas grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 sm:gap-8 xl:gap-12 mb-12 sm:mb-16 lg:mb-20">
          {displayedCourses.map((course) => (
            <article
              key={course.id}
              className="w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-transform border border-gray-200 flex flex-col h-full transform hover:-translate-y-1 duration-500"
            >
              {/* Imagem com aspect ratio 16:9 */}
              <div className="aspect-video bg-gray-200 overflow-hidden border-b border-gray-100 relative">
                <img
                  src={course.image}
                  alt={`Capa do curso ${course.title}`}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Conteúdo do card */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 flex-1">
                    {course.title}
                  </h3>
                  <span
                    className={`flex-shrink-0 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      course.type === "ONLINE"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {course.type === "ONLINE" ? "Online" : "Presencial"}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 sm:mb-5 line-clamp-3 flex-grow text-sm sm:text-base">
                  {course.description}
                </p>

                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5 flex-wrap gap-x-2 gap-y-1">
                  <span>{course.duration}</span>
                  <span aria-hidden="true">•</span>
                  <Link
                    href={`/perfil-formador?id=${course.instructorId}`}
                    className="text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    {course.instructor}
                  </Link>
                </div>

                <div className="border-t border-gray-200 pt-4 sm:pt-5">
                  <div className="flex items-baseline mb-3 sm:mb-4">
                    <span className="text-lg sm:text-xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                      {course.price.toLocaleString("pt-PT", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="ml-1 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                      Kz
                    </span>
                  </div>

                  <Link
                    href={`/detalhes-do-curso?id=${course.id}`}
                    className="w-full block text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2 sm:py-3 rounded-lg transition-all font-medium text-sm sm:text-base"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/cursos"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-700 font-medium text-base sm:text-lg rounded-lg shadow-md hover:shadow-lg border border-blue-200 hover:bg-blue-50 transition-all"
          >
            Ver Todos os Cursos <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
