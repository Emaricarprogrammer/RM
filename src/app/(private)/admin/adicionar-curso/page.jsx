import { CourseForm } from "./form";

export default function CreateCoursePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 pt-8 md:pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-[1700px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-6 text-white">
            <h1 className="mt-3 text-2xl font-bold uppercase">
              Criar Novo Curso
            </h1>

            <p className="text-blue-100 mt-4 text-lg">
              Preencha os detalhes do curso para disponibilizá-lo na plataforma
            </p>
          </div>

          <CourseForm />
        </div>
      </div>
    </div>
  );
}
