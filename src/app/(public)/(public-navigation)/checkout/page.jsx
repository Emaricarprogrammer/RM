"use client";

import { ArrowLeft, Clock, Banknote, Loader2, CheckCircle, AlertCircle, Mail, Phone } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
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
import { MyCourses } from "@/api/Users/Students/myCourses";
import { GetCredentials } from "@/api/Users/Admins/SuperAdmin/getCredentials";
import dayjs from "dayjs";

const useCourseStatus = (courseId, idStudent, accessToken) => {
  const [status, setStatus] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`course-status-${courseId}`);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const saveStatus = useCallback((newStatus) => {
    setStatus(newStatus);
    if (typeof window !== 'undefined') {
      if (newStatus) {
        sessionStorage.setItem(`course-status-${courseId}`, JSON.stringify(newStatus));
      } else {
        sessionStorage.removeItem(`course-status-${courseId}`);
      }
    }
  }, [courseId]);

  const loadCourseStatus = useCallback(async (isSilent = false) => {
    if (!idStudent || !accessToken || !courseId) return;

    try {
      if (!isSilent) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const [myCourses, enrollments] = await Promise.all([
        MyCourses(idStudent, accessToken),
        MyEnrolls(idStudent, accessToken)
      ]);

      const approvedCourse = myCourses.find(c => c.id_course === courseId);
      const enrollment = enrollments.response?.find(e => e.id_course === courseId);

      if (approvedCourse) {
        const newStatus = {
          status: approvedCourse.course_status,
          createdAt: approvedCourse.createdAt,
          paymentProofRequired: false
        };
        
        // Se o curso foi aprovado, registrar o watching
        if (approvedCourse.course_status === 'APPROVED') {
          await WatchingCourse(idStudent, courseId, accessToken);
        }
        
        saveStatus(newStatus);
        return;
      }

      if (enrollment) {
        const newStatus = {
          status: enrollment.status,
          createdAt: enrollment.createdAt || new Date().toISOString(),
          updatedAt: enrollment.updatedAt,
          paymentProofRequired: enrollment.payment_proof_required || false
        };
        
        // Se a matrícula foi aprovada, registrar o watching
        if (enrollment.status === 'APPROVED') {
          await WatchingCourse(idStudent, courseId, accessToken);
        }
        
        saveStatus(newStatus);
      } else {
        saveStatus(null);
      }
    } catch (error) {
      console.error("Erro ao carregar status do curso:", error);
      saveStatus(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [courseId, idStudent, accessToken, saveStatus]);

  const resetStatus = useCallback(() => {
    saveStatus(null);
  }, [saveStatus]);

  useEffect(() => {
    loadCourseStatus();
  }, [loadCourseStatus]);

  return { 
    status, 
    isLoading, 
    isRefreshing,
    refresh: loadCourseStatus, 
    resetStatus,
    updateStatus: saveStatus
  };
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const id_course = searchParams.get("id");
  const router = useRouter();
  const { loading: isAuthLoading, isAuthorized, userType } = useUserAuth(["student"]);
  
  const { course, loading: loadingCourse, error: courseError } = useCourse(id_course);
  
  const [isLoading, setIsLoading] = useState(false);
  const [idStudent, setIdStudent] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);
  const [nextCheckIn, setNextCheckIn] = useState(0);
  const [checkCount, setCheckCount] = useState(0);
  const MAX_CHECK_ATTEMPTS = 20;
  const [credentials, setCredentials] = useState(null);

  
  const { 
    status: courseStatus, 
    isLoading: loadingStatus, 
    isRefreshing,
    refresh: refreshStatus, 
    resetStatus,
    updateStatus
  } = useCourseStatus(id_course, idStudent, accessToken);
  
  const checkingInterval = useRef(null);
  const countdownInterval = useRef(null);
  const isMounted = useRef(false);

  const getCurrentStep = useCallback(() => {
    if (loadingStatus) return 0;
    if (!courseStatus) return 1;
    
    switch(courseStatus.status) {
      case 'PENDING': return 2;
      case 'APPROVED': return 3;
      case 'REJECTED': return 4;
      case 'PRESENTIAL_REQUESTED': return 5;
      default: return 1;
    }
  }, [courseStatus, loadingStatus]);

  const [step, setStep] = useState(getCurrentStep());

  useEffect(() => {
    if (isMounted.current) {
      setStep(getCurrentStep());
    } else {
      isMounted.current = true;
    }
  }, [getCurrentStep]);
  
  useEffect(() => {
    async function fetchCredentials() {
      try {
        const data = await GetCredentials();
        setCredentials(data.Private_credentials || null);
      } catch (err) {
        setError("Erro ao carregar informações de contato");
        console.error(err);
      }
    }

    fetchCredentials();
  }, []);

  useEffect(() => {
    const initializeStudent = async () => {
      const token = localStorage.getItem("access");
      if (!token)
      {
        router.replace("/login")
      }
      if (!isAuthLoading && token && isAuthorized) {
        try {
          const decoded = jwtDecode(token);
          if (!decoded.userClaims.id_student) {
            throw new Error("Token inválido");
          }
          setIdStudent(decoded.userClaims.id_student);
          setAccessToken(token);
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
          toast.error("Sessão inválida. Faça login novamente.");
          router.push('/login');
        }
      }
    };

    initializeStudent();
  }, [isAuthLoading, isAuthorized, router]);

  const clearIntervals = useCallback(() => {
    if (checkingInterval.current) {
      clearInterval(checkingInterval.current);
      checkingInterval.current = null;
    }
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
  }, []);

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!idStudent || !accessToken || !id_course) return;
      
      try {
        await refreshStatus(true);
        setCheckCount(prev => prev + 1);
        
        if (courseStatus?.status !== 'PENDING' || checkCount >= MAX_CHECK_ATTEMPTS) {
          clearIntervals();
          if (checkCount >= MAX_CHECK_ATTEMPTS) {
            toast("Verificação automática encerrada. Contate o suporte.", { icon: "⚠️" });
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status da matrícula:", error);
        if (error.response?.status === 401) {
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          router.push('/login');
        }
      }
    };

    const startPeriodicCheck = () => {
      clearIntervals();
      
      checkingInterval.current = setInterval(checkEnrollmentStatus, 30000);
      
      countdownInterval.current = setInterval(() => {
        setNextCheckIn(prev => (prev > 0 ? prev - 1 : 30));
      }, 1000);
    };

    if (step === 2 && course?.course_type !== 'PRESENTIAL') {
      setNextCheckIn(30);
      startPeriodicCheck();
    }

    return clearIntervals;
  }, [step, idStudent, accessToken, checkCount, course?.course_type, clearIntervals, courseStatus, refreshStatus, router]);

  const handleConfirm = async () => {
    if (courseStatus && (courseStatus.status === 'APPROVED' || courseStatus.status === 'REJECTED')) {
      toast.error("Esta matrícula já foi processada");
      return;
    }

    if (!idStudent) {
      toast.error("Por favor, faça login para continuar");
      router.push('/login');
      return;
    }

    if (!id_course) {
      toast.error("Curso inválido");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setCheckCount(0);
    
    try {
      const response = await BuyCourse(idStudent, id_course);
      
      if (response.success) {
        const newStatus = {
          status: course?.course_type === 'PRESENTIAL' ? 'PRESENTIAL_REQUESTED' : 'PENDING',
          createdAt: dayjs(new Date()).format("DD-MM-YY : HH:MM:ss"),
          paymentProofRequired: course?.course_type !== 'PRESENTIAL'
        };
        updateStatus(newStatus);

        if (course?.course_type === 'PRESENTIAL') {
          toast.success("Solicitação de matrícula enviada com sucesso!");
        } else {
          toast.success("Compra realizada com sucesso! Aguarde a confirmação.");
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

  const handleTryAgain = () => {
    resetStatus();
  };

  if (isAuthLoading || loadingStatus) {
    return <Loading message="Academia Egaf..."/>;
  }
  
  if (!isAuthorized) {
    return <NotFoundPage message="Desculpe, mas não conseguimos encontrar este curso!" />;
  }
  
  if (loadingCourse) {
    return <Loading message="Carregando os detalhes..." />;
  }

  if (!course) {
    return <NotFoundPage message="Desculpe, mas não conseguimos encontrar este curso!" />;
  }

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
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100 relative">
                {isRefreshing && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                  </div>
                )}
                
                <h1 className="text-2xl font-bold text-primary mb-6">
                  Finalizar Compra
                </h1>

                {/* Step 0: Carregando */}
                {step === 0 && (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                  </div>
                )}

                {/* Step 1: Método de pagamento */}
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
                                {credentials.bank_name ? credentials.bank_name : "BFA - Banco de Fomento Angola"}
                              </span>
                            </div>

                            <div className="mb-2">
                              <span className="block text-sm font-medium text-gray-500">
                                Titular
                              </span>
                              <span className="font-medium">
                                {credentials.account_holder_name ? credentials.account_holder_name : "Egaf Oil & Gás, Lda"}
                              </span>
                            </div>

                            <div>
                              <span className="block text-sm font-medium text-gray-500">
                                IBAN
                              </span>
                              <span className="font-sans font-bold text-lg">
                                {credentials.iban ? `AO ${credentials.iban}` : "AO 0006 0000 1248 5137 3016 0"}
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

                {/* Step 2: Aguardando confirmação */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <Clock className="h-16 w-16 text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-blue-800">
                        Aguardando Confirmação
                      </h3>
                      <p className="text-gray-600">
                        Assim que confirmarmos o recebimento do pagamento, seu
                        acesso será liberado automaticamente.
                      </p>
                      {courseStatus?.createdAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Solicitação enviada em: {courseStatus.createdAt}
                        </p>
                      )}
                      {courseStatus?.paymentProofRequired && (
                        <p className="text-sm text-gray-500 mt-4">
                          Envie o comprovativo para{" "}
                          <strong>{credentials.private_email ? credentials.private_email : "pagamentos@academia.com"}</strong> para agilizar o
                          processo.
                        </p>
                      )}

                      {nextCheckIn > 0 && (
                        <p className="text-sm text-blue-600 mt-2">
                          Próxima verificação em: {nextCheckIn}s
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Matrícula confirmada */}
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
                      {courseStatus?.createdAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Confirmado em: {courseStatus.updatedAt}
                        </p>
                      )}
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
                              </div>
                            </div>
                            <Link
                              href="/cursos"
                              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                            >
                              Ver Outros Cursos
                            </Link>
                          </div>
                        ) : (
                          <Link
                            href={`/assistir-curso?id=${id_course}`}
                            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                          >
                            Acessar Curso
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Matrícula rejeitada */}
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
                      {courseStatus?.createdAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Rejeitado em: {courseStatus.updatedAt}
                        </p>
                      )}

                      <div className="mt-6 space-x-4">
                        <button
                          onClick={handleTryAgain}
                          className="inline-flex items-center bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
                        >
                          Tentar Novamente
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Matrícula presencial solicitada */}
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
                      {courseStatus?.createdAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Solicitado em: {courseStatus.createdAt}
                        </p>
                      )}

                      <div className="mt-6 space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-left">
                          <h4 className="font-bold text-lg mb-2">Informações de Contato</h4>
                          <div className="flex items-center mb-2">
                            <Mail className="w-5 h-5 mr-2 text-blue-600" />
                            <span>{credentials.private_email ? credentials.private_email : "pagamentos@academia.com"}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 mr-2 text-blue-600" />
                            <span>{credentials.private_phone ? credentials.private_phone : "+244 123 456 789"}</span>
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
                      {course.duration} horas de conteúdo
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

                {/* Mensagens de status */}
                {step === 1 && course.course_type !== 'PRESENTIAL' && (
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      Importante
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Após a transferência, envie o comprovativo para{" "}
                      <strong>{credentials.private_email ? credentials.private_email : "pagamentos@academia.com"}</strong> com seu nome para
                      agilizar a liberação do acesso.
                    </p>
                  </div>
                )}

                {step === 3 && courseStatus && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">
                      Acesso Liberado
                    </h4>
                    <p className="text-sm text-green-700">
                      Sua matrícula foi confirmada em: {courseStatus.updatedAt}
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