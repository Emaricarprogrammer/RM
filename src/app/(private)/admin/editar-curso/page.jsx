import { EditCourseForm } from "./form";

async function getCourseData(id) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: "some-unique-id",
    title: "Introdução ao React.js (Editado)",
    description: "Descrição atualizada do curso de React.js...",
    duration: 25,
    price: 30000,
    total_lessons: 12,
    id_instructor: "1",
    id_category_course_fk: "1",
    course_type: "online",
    image_url:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/1*vHHBwcUFUaHWXntSnqKdCA.png",
  };
}

export default async function EditCoursePage({ searchParams }) {
  const courseData = await getCourseData(12);

  if (!courseData) {
    return <div>Curso não encontrado ou ID inválido.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 pt-8 md:pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-[1700px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-6 text-white">
            <h1 className="mt-3 text-2xl font-bold uppercase">Editar Curso</h1>
            <p className="text-blue-100 mt-4 text-lg">
              Edite os detalhes do curso para atualizar as informações na
              plataforma
            </p>
          </div>
          <EditCourseForm initialValues={courseData} />
        </div>
      </div>
    </div>
  );
}
