// app/(private)/admin/editar-video/page.jsx
import { EditVideoForm } from "./form";

export default function EditVideoPage({ searchParams }) {
  const { id, videoId } = searchParams;

  if (!id || !videoId) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 pt-8 md:pt-10 pb-8 px-4 sm:px-6">
        <div className="max-w-[1700px] mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Parâmetros inválidos
            </h1>
            <p className="mt-4 text-gray-700">
              Os parâmetros courseId e videoId são obrigatórios na URL
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
            <h1 className="mt-3 text-2xl font-bold uppercase">Editar Vídeo</h1>
            <p className="text-blue-100 mt-4 text-lg">
              Atualize os detalhes deste vídeo
            </p>
          </div>
          <EditVideoForm courseId={id} videoId={videoId} />
        </div>
      </div>
    </div>
  );
}
