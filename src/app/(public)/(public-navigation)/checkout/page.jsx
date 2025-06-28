"use client";

import { ArrowLeft, Clock, Banknote, Loader2, X, CheckCircle, AlertCircle, Mail, Phone } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/app/_components/Footer";
import { jwtDecode } from "jwt-decode";
import { BuyCourse } from "@/api/Users/Students/buyCourse";
import { NotFoundPage } from "@/app/_components/Notfound";
import { useCourse } from "@/api/Courses/coursesDetails";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/_components/Loading";
import { toast, Toaster } from "react-hot-toast";
import { MyEnrolls } from "@/api/Users/Students/myEnrolls";
import { WatchingCourse } from "@/api/Users/Students/watchingCourse";
import { useUserAuth } from "@/hooks/useAuth";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const id_course = searchParams.get("id");
  const router = useRouter();
  const isAuthLoading = useUserAuth(["student"])
  
  const { course, loading: loadingCourse, error: courseError } = useCourse(id_course);
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [idStudent, setIdStudent] = useState(null);
  const [error, setError] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [nextCheckIn, setNextCheckIn] = useState(0);
  const [checkCount, setCheckCount] = useState(0);
  const MAX_CHECK_ATTEMPTS = 20;

  useEffect(() => {
    const savedStep = sessionStorage.getItem(`checkout-step-${id_course}`);
    if (savedStep) {
      setStep(parseInt(savedStep, 10));
    }
  }, [id_course]);

  useEffect(() => {
    if (id_course && step !== 1) {
      sessionStorage.setItem(`checkout-step-${id_course}`, step.toString());
    }
  }, [step, id_course]);

  const checkEnrollmentStatus = useCallback(async () => {
    if (!idStudent || !accessToken || !id_course) return false;
    
    setCheckingStatus(true);
    try {
      const response = await MyEnrolls(idStudent, accessToken);
      const enrollmentsData = response.response || [];
      
      if (Array.isArray(enrollmentsData)) {
        setEnrollments(enrollmentsData);
        
        const enrollment = enrollmentsData.find(
          (enroll) => enroll.id_course === id_course
        );
        
        if (enrollment) {
          if (enrollment.status === 'APPROVED') {
            setStep(3);
            toast.success("Matrícula aprovada com sucesso!");
            if (course?.course_type !== 'PRESENTIAL')
            {
              await WatchingCourse(idStudent, id_course, accessToken);
            }
            return true;
          } else if (enrollment.status === 'PENDING') {
            setStep(2);
            return true;
          } else if (enrollment.status === 'REJECTED') {
            setStep(4);
            toast.error("Matrícula rejeitada. Por favor, entre em contato com o suporte.");
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error("Erro ao verificar status da matrícula:", error);
      if (error.response?.status === 401) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        router.push('/login');
      }
      return false;
    } finally {
      setCheckingStatus(false);
    }
  }, [idStudent, accessToken, id_course, router]);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!isAuthLoading && token)
    {

    try {
      const decoded = jwtDecode(token);
      if (!decoded.userClaims.id_student) {
        throw new Error("Token inválido");
      }
      setIdStudent(decoded.userClaims.id_student);
      setAccessToken(token);
      checkEnrollmentStatus();
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      toast.error("Sessão inválida. Faça login novamente.");
      router.push('/login');
    }
  }}, [router, checkEnrollmentStatus, isAuthLoading, accessToken]);

  useEffect(() => {
    let interval;
    let timeout;
    
    const startChecking = () => {
      checkEnrollmentStatus();
      
      interval = setInterval(async () => {
        setNextCheckIn(30);
        const found = await checkEnrollmentStatus();
        setCheckCount(prev => prev + 1);
        
        if (found || checkCount >= MAX_CHECK_ATTEMPTS) {
          clearInterval(interval);
          if (checkCount >= MAX_CHECK_ATTEMPTS) {
            toast("Verificação automática encerrada após várias tentativas. Por favor, contate o suporte.", { icon: "⚠️" });
          }
        }
      }, 30000);
      
      timeout = setInterval(() => {
        setNextCheckIn(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    };
    
    if (step === 2 && idStudent && accessToken && course?.course_type !== 'PRESENTIAL') {
      startChecking();
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearInterval(timeout);
    };
  }, [step, idStudent, accessToken, checkEnrollmentStatus, checkCount, course?.course_type]);

  const handleConfirm = async () => {
    if (!idStudent) {
      toast.error("Por favor, faça login para continuar");
      router.push('/login');
      return;
    }

    if (!id_course) {
      toast.error("Curso inválido");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCheckCount(0);
    
    try {
      const response = await BuyCourse(idStudent, id_course);
      
      if (response.success) {
        if (course?.course_type === 'PRESENTIAL') {
          setStep(5); // Special step for in-person courses
        } else {
          setStep(2);
          toast.success("Compra realizada com sucesso! Aguarde a confirmação.");
          await checkEnrollmentStatus();
        }
        localStorage.removeItem('cart');
      } else {
        setError(response.message || "Erro ao processar a compra");
        toast.error(response.message || "Erro ao processar a compra");
      }
    } catch (error) {
      console.error("Erro ao confirmar compra:", error);
      setError("Ocorreu um erro ao processar sua compra. Tente novamente.");
      toast.error("Ocorreu um erro ao processar a compra");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setStep(1);
    sessionStorage.removeItem(`checkout-step-${id_course}`);
    toast("Compra cancelada", { icon: "❌" });
  };

  if (isAuthLoading)
  {
    return (
      <Loading message="Academia Egaf..."/>
    )
  }
  if (loadingCourse) {
    return <Loading message="Carregando os detalhes..." />;
  }

  if (!course) {
    return <NotFoundPage message="Desculpe, mas não conseguimos encontrar este curso!" />;
  }

  const courseEnrollment = enrollments.find(enroll => enroll.id_course === id_course);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Link
            href={`/detalhes-do-curso?id=${id_course}`}
            className="flex items-center text-primary hover:text-primary-hover mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para o curso
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
                <h1 className="text-2xl font-bold text-primary mb-6">
                  Finalizar Compra
                </h1>

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-primary mb-4">
                        Método de Pagamento
                      </h2>

                      {course.course_type === 'PRESENTIAL' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Banknote className="h-6 w-6 text-blue-600 mr-2" />
                            <span className="font-medium text-blue-800">
                              Pagamento presencial
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Para cursos presenciais, entre em contato conosco para realizar sua matrícula.
                          </p>
                        </div>
                      ) : (
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
                      )}
                    </div>

                    <div>
                      <button
                        onClick={handleConfirm}
                        disabled={isLoading || !idStudent}
                        className={`w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center ${
                          isLoading || !idStudent ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Processando...
                          </>
                        ) : course.course_type === 'PRESENTIAL' ? (
                          "Solicitar Matrícula"
                        ) : (
                          "Confirmar Compra"
                        )}
                      </button>
                      {error && (
                        <p className="mt-2 text-sm text-red-600 text-center">
                          {error}
                        </p>
                      )}
                      {!idStudent && (
                        <p className="mt-2 text-sm text-yellow-600 text-center">
                          Você precisa estar logado para finalizar a compra
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <div className="flex justify-center mb-4">
                        {checkingStatus ? (
                          <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                        ) : (
                          <Clock className="h-16 w-16 text-blue-500" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-blue-800">
                        Aguardando Confirmação
                      </h3>
                      <p className="text-gray-600">
                        Assim que confirmarmos o recebimento do pagamento, seu
                        acesso será liberado automaticamente.
                      </p>
                      {courseEnrollment?.createdAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Solicitação enviada em: {courseEnrollment.createdAt}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-4">
                        Envie o comprovativo para{" "}
                        <strong>pagamentos@academia.com</strong> para agilizar o
                        processo.
                      </p>

                      {nextCheckIn > 0 && (
                        <p className="text-sm text-blue-600 mt-2">
                          Próxima verificação em: {nextCheckIn}s
                        </p>
                      )}

                      <div className="mt-6">
                        <button
                          onClick={handleCancel}
                          disabled={checkingStatus}
                          className={`inline-flex items-center bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none transition-colors ${
                            checkingStatus ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <X className="w-5 h-5 mr-2" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                      <h3 className="text-2xl font-bold text-green-800">
                        {course.course_type === 'PRESENTIAL' ? 'Matrícula Confirmada!' : 'Matrícula Confirmada!'}
                        </h3>
                        <p className="text-gray-600">
                          {course.course_type === 'PRESENTIAL' 
                          ? 'Sua matrícula neste curso presencial foi confirmada. Entraremos em contato com mais informações.'
                          : 'Sua matrícula neste curso foi aprovada e seu acesso está liberado.'}
                          </p>
                          <div className="mt-6">
                            {course.course_type === 'PRESENTIAL' ? (
                              <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg border border-gray-200 text-left">
                                  <h4 className="font-bold text-lg mb-2">Informações de Contato</h4>
                                  <div className="flex items-center mb-2">
                                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                                    <span>matriculas@academia.com</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Phone className="w-5 h-5 mr-2 text-blue-600" />
                                      <span>+244 123 456 789</span>
                                      </div></div>
                                      <Link
                                      href="/cursos"
                                      className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                                      >
                                        Ver Outros Cursos</Link>
                                        </div>
                                        ) : (<Link
                                          href={`/assistir-curso?id=${id_course}`}
                                          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors">
                                            Acessar Curso
                                            </Link>
                                          )}</div>
                                          </div>
                                          </div>)}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                      <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                      <h3 className="text-2xl font-bold text-red-800">
                        Matrícula Rejeitada
                      </h3>
                      <p className="text-gray-600">
                        Sua matrícula não pôde ser confirmada. Por favor, verifique o comprovante enviado ou entre em contato com o suporte.
                      </p>

                      <div className="mt-6 space-x-4">
                        <button
                          onClick={() => setStep(1)}
                          className="inline-flex items-center bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
                        >
                          Tentar Novamente
                        </button>
                        <Link
                          href="/suporte"
                          className="inline-flex items-center bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                        >
                          Contatar Suporte
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <Mail className="h-16 w-16 text-blue-500 mx-auto" />
                      <h3 className="text-2xl font-bold text-blue-800">
                        Matrícula presencial solicitada
                      </h3>
                      <p className="text-gray-600">
                        Para cursos presenciais, entre em contato conosco para finalizar sua matrícula.
                      </p>

                      <div className="mt-6 space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-left">
                          <h4 className="font-bold text-lg mb-2">Informações de Contato</h4>
                          <div className="flex items-center mb-2">
                            <Mail className="w-5 h-5 mr-2 text-blue-600" />
                            <span>matriculas@academia.com</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 mr-2 text-blue-600" />
                            <span>+244 123 456 789</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Link
                            href="/cursos"
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                          >
                            Ver Outros Cursos
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                    {course.course_type === 'PRESENTIAL' && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                        presencial
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-primary flex justify-between text-xl font-bold pt-5 border-t border-gray-200">
                  <span>Total</span>
                  <span>{course.price.toLocaleString("pt-PT")} Kz</span>
                </div>

                {(step === 1 || step === 2) && course.course_type !== 'PRESENTIAL' && (
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

                {step === 3 && courseEnrollment && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">
                      Acesso Liberado
                    </h4>
                    <p className="text-sm text-green-700">
                      Sua matrícula foi confirmada em: {courseEnrollment.updatedAt}
                    </p>
                  </div>
                )}

                {step === 4 && (
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">
                      Problema na Matrícula
                    </h4>
                    <p className="text-sm text-red-700">
                      Por favor, entre em contato com o suporte para resolver.
                    </p>
                  </div>
                )}

                {step === 5 && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Matrícula presencial
                    </h4>
                    <p className="text-sm text-blue-700">
                      Nossa equipe entrará em contato para finalizar sua matrícula.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}