import { EditInstructorForm } from "./form";
import { getInstructorData } from "./api";

export default async function EditInstructorPage({ searchParams }) {
  const instructorId = searchParams?.id;
  const instructorData = instructorId
    ? await getInstructorData(instructorId)
    : null;

  if (!instructorData) {
    return <div>Formador não encontrado ou ID inválido.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 pt-8 md:pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-[1700px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-6 text-white">
            <h1 className="mt-3 text-2xl font-bold uppercase">
              Editar Formador
            </h1>

            <p className="text-blue-100 mt-4 text-lg">
              Edite os detalhes do formador para atualizar as informações na
              plataforma
            </p>
          </div>

          <EditInstructorForm
            initialData={instructorData}
            instructorId={instructorId}
          />
        </div>
      </div>
    </div>
  );
}
