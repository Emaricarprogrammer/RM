"use client";

import { ArrowLeft, Clock, Banknote, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/app/_components/Footer";
import {jwtDecode} from "jwt-decode";
import { BuyCourse } from "@/api/Users/Students/buyCourse";
import { getCourse } from "@/api/Courses/coursesDetails";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const id_course = searchParams.get("id");
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [idStudent, setIdStudent] = useState(null);

  useEffect(() => {
    // Decodificar o token para obter o id_student
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIdStudent(decoded.id_student);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }

    // Carregar dados do curso
    if (id_course) {
      const fetchCourseData = async () => {
        try {
          const { course: courseData } = await getCourse(id_course);
          if (courseData) {
            setCourse(courseData);
          }
        } catch (error) {
          console.error("Error fetching course:", error);
        } finally {
          setLoadingCourse(false);
        }
      };
      
      fetchCourseData();
    }
  }, [id_course]);

  const handleConfirm = async () => {
    if (!idStudent) {
      console.error("ID do estudante não disponível");
      return;
    }

    setIsLoading(true);
    try {
      const response = await BuyCourse(idStudent, id_course);
      
      if (response.success) {
        setStep(2);
      } else {
        console.error("Erro na compra:", response.message);
      }
    } catch (error) {
      console.error("Erro ao confirmar compra:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setStep(1);
  };

  if (loadingCourse) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Curso não encontrado</h1>
          <Link
            href="/"
            className="text-primary hover:text-primary-hover underline"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/detalhes-do-curso?id=${id_course}`}
          className="flex items-center text-primary hover:text-primary-hover mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para o curso
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Conteúdo principal */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
              <h1 className="text-2xl font-bold text-primary mb-6">
                Finalizar Compra
              </h1>

              {step === 1 ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-primary mb-4">
                      Método de Pagamento
                    </h2>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Banknote className="h-6 w-6 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-800">
                          Transferência Bancária
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Faça a transferência para a conta abaixo e envie o
                        comprovativo para o nosso email.
                      </p>

                      <div className="bg-white p-4 rounded border border-gray-200">
                        <div className="mb-2">
                          <span className="block text-sm font-medium text-gray-500">
                            Banco
                          </span>
                          <span className="font-medium">
                            BFA - Banco de Fomento Angola
                          </span>
                        </div>

                        <div className="mb-2">
                          <span className="block text-sm font-medium text-gray-500">
                            Titular
                          </span>
                          <span className="font-medium">
                            Egaf Oil & Gás, Lda
                          </span>
                        </div>

                        <div>
                          <span className="block text-sm font-medium text-gray-500">
                            IBAN
                          </span>
                          <span className="font-sans font-bold text-lg">
                            0006 0000 1248 5137 3016 0
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirm}
                    disabled={isLoading || !idStudent}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Processando...
                      </>
                    ) : (
                      "Confirmar Compra"
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <Clock className="h-16 w-16 text-blue-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-blue-800">
                      Aguardando Confirmação
                    </h3>
                    <p className="text-gray-600">
                      Assim que confirmarmos o recebimento do pagamento, seu
                      acesso será liberado automaticamente.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      Envie o comprovativo para{" "}
                      <strong>pagamentos@academia.com</strong> para agilizar o
                      processo.
                    </p>

                    <div className="mt-6">
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumo do pedido */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 sticky top-4">
              <h2 className="text-xl font-bold text-primary mb-4">
                Resumo do Pedido
              </h2>

              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-gray-500">
                    {course.duration} de conteúdo
                  </p>
                </div>
              </div>

              <div className="text-primary flex justify-between text-xl font-bold pt-5 border-t border-gray-200">
                <span>Total</span>
                <span>{course.price.toLocaleString("pt-PT")} Kz</span>
              </div>

              {step === 1 && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    Importante
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Após a transferência, envie o comprovativo para{" "}
                    <strong>pagamentos@academia.com</strong> com seu nome para
                    agilizar a liberação do acesso.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}