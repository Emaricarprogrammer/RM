"use client";

import { Loading } from "@/app/_components/Loading";
import { EditCourseForm } from "./form";
import { useCourse } from "@/api/Courses/coursesDetails";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect } from "react";
import toast from "react-hot-toast";
import { NotFoundPage } from "@/app/_components/Notfound";

export default function EditCoursePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const { course, loading, error } = useCourse(id);

  useEffect(() => {
    if (!id) {
      toast.error("ID do curso não fornecido");
      router.push("/admin/cursos");
      return;
    }

    if (error) {
      toast.error(error);
    }
  }, [error, id, router]);

  if (!id || loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-lg">
            {!id ? "Redirecionando..." : <Loading message="Carregando..."/>}
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <NotFoundPage message="Curso não encontrado!"/>
    );
  }

  // Transform API data to match form expectations
  const initialValues = {
    id_course: course.id_course,
    title: course.title,
    description: course.description,
    duration: course.duration,
    price: course.price,
    total_lessons: course.total_lessons,
    id_instructor_fk: course.instructors_datas?.id_instructor,
    id_category_course_fk: course.id_category,
    course_type: course.course_type,
    image_url: course.image_url,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 pt-8 md:pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-[1700px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="mt-3 text-2xl font-bold uppercase">Editar Curso</h1>
                <p className="text-blue-100 mt-4 text-lg">
                  Edite os detalhes do curso para atualizar as informações na plataforma
                </p>
              </div>
              <button
                onClick={() => router.push("/admin/cursos")}
                className="px-4 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
          <EditCourseForm initialValues={initialValues} />
        </div>
      </div>
    </div>
  );
}