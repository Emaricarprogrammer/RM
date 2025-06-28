"use client";

import { EditInstructorForm } from "./form";
import { useSearchParams } from "next/navigation";
import { InstrutorProfile } from "@/api/Users/Instructors/InstructorProfile";
import { useState, useEffect } from "react";
import { Loading } from "@/app/_components/Loading";
import { NotFoundPage } from "@/app/_components/Notfound";
import { AlertCircle } from "lucide-react";

export default function EditInstructorPage() {
  const searchParams = useSearchParams();
  const instructorId = searchParams.get("id");
  const [instructorData, setInstructorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (instructorId) {
          const data = await InstrutorProfile(instructorId);
          setInstructorData(data.response);
        }
      } catch (err) {
        setError("Ocorreu um erro ao carregar os dados do formador");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [instructorId]);

  if (loading) return <Loading message="Carregando os dados do formador" />;
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-bold text-red-600">Ocorreu um erro</h2>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!instructorData) return <NotFoundPage message="Lamentamos, mas não conseguimos encontrar este formador!" />;

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
            initialValues={instructorData}
            instructorId={instructorId}
          />
        </div>
      </div>
    </div>
  );
}