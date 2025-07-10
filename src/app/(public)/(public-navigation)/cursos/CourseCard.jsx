"use client"; // Add this at the top to ensure client-side rendering

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster} from "react-hot-toast";
import { deleteCourse } from "@/api/Courses/deleteCourse";
import { DeleteCourseModal } from "@/app/(private)/admin/detalhes-do-curso/DeleteCourseModal";

export default function CourseCard({ course, userType, hasPurchased }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
      if (!token) {
        router.replace("/login")
        return;
      }
      
      await deleteCourse(course.id_course, token);
      toast.success("Curso eliminado com sucesso!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Erro ao eliminar curso:", error);
      toast.error("Ocorreu um erro ao eliminar o curso");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200 flex flex-col h-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="h-48 bg-gray-200 overflow-hidden border-b border-gray-100 relative">
        <img
          src={course.image}
          alt={`Capa do curso ${course.title}`}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          width={320}
          height={192}
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 min-h-[56px]">
            {course.title}
          </h3>
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              course.type === "ONLINE"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-amber-100 text-amber-800 border border-amber-200"
            }`}
          >
            {course.type === "ONLINE" ? "Online" : "Presencial"}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {course.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap gap-x-2">
          <span>{course.duration}</span>
          <span aria-hidden="true">•</span>
          <Link
            href={`/perfil-formador?id=${course.instructorId}`}
            className="text-blue-700 hover:text-blue-900 hover:underline"
            prefetch={false}
          >
            {course.instructor}
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-baseline mb-3">
            <span className="text-xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
              {course.price.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
            </span>
            <span className="ml-1 bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
              Kz
            </span>
          </div>

          {userType === "ADMIN" ? (
            <div className="flex flex-col gap-4">
              <Link
                href={`/admin/detalhes-do-curso?id=${course.id_course}`}
                className="w-full text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                prefetch={false}
              >
                Ver Detalhes
              </Link>
              <div className="flex gap-3">
                <Link
                  href={`/admin/editar-curso?id=${course.id_course}`}
                  className="flex-1 text-center border border-blue-700 text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md text-sm transition-colors"
                  prefetch={false}
                >
                  Editar
                </Link>
                <button
                  onClick={handleDeleteClick}
                  className="flex-1 text-center border border-red-600 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm transition-colors"
                  disabled={isDeleting}
                  aria-label={`Apagar curso ${course.title}`}
                >
                  {isDeleting ? "Apagando..." : "Apagar"}
                </button>
                {
                  course.course_type === "ONLINE" ? (
                <Link
                href={`/admin/videos?id=${course.id_course}`}
                className="w-full text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                prefetch={false}
              >
                Gerenciar videos
              </Link>) :""
                }
              </div>
            </div>
          ) : userType === "student" && hasPurchased ? (
            <Link
              href={`/assistir-curso?id=${course.id_course}`}
              className="w-full block text-center bg-gradient-to-br from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white px-4 py-2 rounded-md transition-all"
              prefetch={false}
            >
              Assistir Curso
            </Link>
          ) : userType === "student" ? (
            <Link
              href={`/checkout?id=${course.id_course}`}
              className="w-full block text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-all"
              prefetch={false}
            >
              Comprar
            </Link>
          ) : userType === "SUPER_ADMIN" ?
          <Link
              href={`/detalhes-do-curso?id=${course.id_course}`}
              className="w-full block text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-all"
              prefetch={false}
            >
              Ver detalhes
            </Link> :(
            <Link
              href={`/criar-conta?redirect=/detalhes-do-curso/${course.id_course}`}
              className="w-full block text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-all"
              prefetch={false}
            >
              Comprar
            </Link>
          )}
        </div>
      </div>

      <DeleteCourseModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        courseTitle={course.title}
        isDeleting={isDeleting}
      />
    </article>
  );
}