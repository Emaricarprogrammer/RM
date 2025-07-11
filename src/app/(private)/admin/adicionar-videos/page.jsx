// app/admin/adicionar-videos/page.js
import { VideoForm } from "./form";

export default function AddVideosPage({ searchParams }) {
  const courseId = searchParams.id;
  if (!courseId) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 pt-8 md:pt-10 pb-8 px-4 sm:px-6">
        <div className="max-w-[1700px] mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
            <h2 className="text-xl font-bold text-red-600">
              Erro: ID do curso não fornecido
            </h2>
            <p className="mt-4">
              Por favor, acesse esta página através de um curso válido.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 pt-8 md:pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-[1700px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-6 text-white">
            <h1 className="mt-3 text-2xl font-bold uppercase">
              Adicionar Vídeos ao Curso
            </h1>
            <p className="text-blue-100 mt-4 text-lg">
              Adicione as videoaulas que compõem este curso
            </p>
          </div>
          <VideoForm courseId={courseId} />
        </div>
      </div>
    </div>
  );
}