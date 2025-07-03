"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Mail,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Footer } from "@/app/_components/Footer";
import { Loading } from "@/app/_components/Loading";
import { toast, Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import { Enrrols } from "@/api/Users/Admins/basicsManagements";
import { setEnrollStatus } from "@/api/Users/Admins/basicsManagements";
import { useUserAuth } from "@/hooks/useAuth";

// Componente de abas para navegação
const StatusTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "PENDING", label: "Pendentes", icon: <Clock className="w-4 h-4" /> },
    { id: "APPROVED", label: "Aprovados", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "REJECTED", label: "Rejeitados", icon: <XCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === tab.id
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.icon}
          <span className="ml-2">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default function PaymentApprovalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {loading: isAuthLoading, isAuthorized, userType} = useUserAuth(["ADMIN"])
  
  const token = localStorage.getItem("access");

  // Função para buscar matrículas
  const fetchEnrollments = async () => {
    try {
      if (!token)
      {
        return
      }
      const response = await Enrrols(token);
      console.log(response)
      
      if (response.success) {
        const allEnrolls = response.response.map(enroll => ({
          id: enroll.id_enroll,
          status: enroll.status,
          studentName: enroll.enroll_datas?.student_name || "Nome não disponível",
          email: enroll.enroll_datas?.student_email || "Email não disponível",
          courseName: enroll.enroll_datas?.course_name || "Curso não disponível",
          courseType: enroll.enroll_datas?.course_type || "Tipo não disponível",
          amount: enroll.enroll_datas?.course_price || 0,
          paymentDate: enroll.enroll_datas?.course_date,
          rawData: enroll
        }));
        
        setEnrollments(allEnrolls);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError(response.message || "Erro ao carregar matrículas");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Buscar matrículas inicialmente
    useEffect(() => {
    fetchEnrollments();
  }, [token]);
  


  // Configurar atualização automática a cada 1 minuto
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isDetailModalOpen && !isConfirmationModalOpen && !isAuthLoading && isAuthorized) {
        fetchEnrollments();
      }
    }, 60000); // 1 minuto

    return () => clearInterval(intervalId);
  }, [token, isDetailModalOpen, isConfirmationModalOpen, isAuthLoading, isAuthorized]);

  // Filtrar pagamentos por termo de busca e status
  const filteredPayments = enrollments.filter((payment) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchLower) ||
      payment.courseName.toLowerCase().includes(searchLower);
    
    const matchesStatus = payment.status === activeTab;
    
    return matchesSearch && matchesStatus;
  });

  // Formatar valor em Kz
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);
  };

  // Formatar data
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm:ss");
  };

  // Obter cor e ícone com base no status
  const getStatusStyles = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: "Aprovado"
        };
      case "REJECTED":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          icon: <XCircle className="w-4 h-4" />,
          label: "Rejeitado"
        };
      default:
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          icon: <Clock className="w-4 h-4" />,
          label: "Pendente"
        };
    }
  };

  // Abrir modal de detalhes
  const openDetailModal = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  // Abrir modal de confirmação
  const openConfirmationModal = (type) => {
    setActionType(type);
    setIsConfirmationModalOpen(true);
  };

  const processAction = async () => {
    setIsProcessing(true);

    try {
        const email = selectedPayment.rawData.enroll_datas.student_email;
        const id_enroll = selectedPayment.id;
        const status = actionType === "approve" ? "APPROVED" : "REJECTED";
        
        const response = await setEnrollStatus(id_enroll, email, status, token);

        if (response && response.success !== false) {
            setEnrollments(prev => 
                prev.map(enroll => 
                    enroll.id === selectedPayment.id 
                        ? { ...enroll, status } 
                        : enroll
                )
            );

            toast.success(
                actionType === "approve" 
                    ? "Pagamento aprovado com sucesso!" 
                    : "Pagamento rejeitado com sucesso!"
            );
        } else {
            throw new Error(response?.message || "Falha ao processar a ação");
        }
    } catch (err) {
        toast.error(err.message || "Ocorreu um erro ao processar a ação");
        console.error("Process error:", err);
    } finally {
        setIsProcessing(false);
        setIsConfirmationModalOpen(false);
        setIsDetailModalOpen(false);
        fetchEnrollments(); // Atualiza a lista após ação
    }
  };

  // Função para atualização manual
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchEnrollments();
  };

  
  if (isAuthLoading)
  {
    return (
      <Loading message="Academia Egaf..."/>
    )
  }
  if (!isAuthorized)
  {
    return
  }
  if (isLoading) {
    return <Loading message="Carregando pagamentos..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={handleManualRefresh} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Gerenciamento de Pagamentos
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-gray-600">
                Aprove, rejeite ou visualize os pagamentos por transferência bancária
              </p>
              <button 
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="text-blue-600 hover:text-blue-800"
                title="Atualizar dados"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Atualizado em: {lastUpdate ? formatDate(lastUpdate) : "Carregando..."}
              {isRefreshing && " (Atualizando...)"}
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Barra de pesquisa */}
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar pagamentos"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-800 focus:border-blue-800 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Abas de navegação */}
        <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Cartões de pagamento (visão mobile) */}
        <div className="md:hidden space-y-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => {
              const statusStyles = getStatusStyles(payment.status);
              return (
                <div
                  key={payment.id}
                  className="bg-white rounded-lg shadow p-4 border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {payment.studentName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {payment.courseName}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles.bgColor} ${statusStyles.textColor}`}>
                      {statusStyles.icon}
                      <span className="ml-1">{statusStyles.label}</span>
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Valor</p>
                      <p className="font-medium">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Data</p>
                      <p className="font-medium">
                        {payment.paymentDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tipo</p>
                      <p className="font-medium">
                        {payment.courseType === "ONLINE"
                          ? "Online"
                          : "Presencial"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => openDetailModal(payment)}
                      className="text-blue-800 hover:text-blue-600 text-sm font-medium"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">
                {enrollments.length === 0
                  ? "Nenhuma matrícula encontrada"
                  : `Nenhum pagamento ${activeTab === "PENDING" ? "pendente" : activeTab === "APPROVED" ? "aprovado" : "rejeitado"} encontrado`}
              </p>
            </div>
          )}
        </div>

        {/* Tabela de pagamentos (visão desktop) */}
        <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-br from-blue-900 to-blue-700">
                <tr className="text-sm">
                  <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-white uppercase tracking-wider">
                    Detalhes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => {
                    const statusStyles = getStatusStyles(payment.status);
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium text-gray-900">
                                {payment.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payment.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {payment.courseName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.courseType === "ONLINE"
                              ? "Online"
                              : "Presencial"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {payment.paymentDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles.bgColor} ${statusStyles.textColor}`}>
                            {statusStyles.icon}
                            <span className="ml-1">{statusStyles.label}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openDetailModal(payment)}
                            className="text-blue-800 hover:text-blue-600"
                          >
                            Ver detalhes
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500 bg-gray-50"
                    >
                      {enrollments.length === 0
                        ? "Nenhuma matrícula encontrada"
                        : `Nenhum pagamento ${activeTab === "PENDING" ? "pendente" : activeTab === "APPROVED" ? "aprovado" : "rejeitado"} encontrado`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {isDetailModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 relative">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                disabled={isProcessing}
              >
                <XCircle className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Detalhes do Pagamento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Informações do Aluno
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Nome:</span>{" "}
                      {selectedPayment.studentName}
                    </p>
                    <p>
                      <span className="text-gray-600">Email:</span>{" "}
                      {selectedPayment.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Informações do Curso
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Curso:</span>{" "}
                      {selectedPayment.courseName}
                    </p>
                    <p>
                      <span className="text-gray-600">Tipo:</span>{" "}
                      {selectedPayment.courseType === "ONLINE"
                        ? "Online"
                        : "Presencial"}
                    </p>
                    <p>
                      <span className="text-gray-600">Valor:</span>{" "}
                      {formatCurrency(selectedPayment.amount)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Informações do Pagamento
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Data:</span>{" "}
                      {selectedPayment.paymentDate}
                    </p>
                    <p>
                      <span className="text-gray-600">Status:</span>{" "}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusStyles(selectedPayment.status).bgColor
                      } ${
                        getStatusStyles(selectedPayment.status).textColor
                      }`}>
                        {getStatusStyles(selectedPayment.status).icon}
                        <span className="ml-1">
                          {getStatusStyles(selectedPayment.status).label}
                        </span>
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Comprovativo
                  </h4>
                  <div className="mt-2">
                    <div className="inline-flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>Verificar comprovativo no email</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      O aluno enviou o comprovativo para pagamentos@seusite.com
                    </p>
                  </div>
                </div>
              </div>

              {selectedPayment.status === "PENDING" && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openConfirmationModal("reject")}
                    disabled={isProcessing}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 flex items-center"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Rejeitar Pagamento
                  </button>
                  <button
                    onClick={() => openConfirmationModal("approve")}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Aprovar Pagamento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 relative">
              <button
                onClick={() => setIsConfirmationModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                disabled={isProcessing}
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {actionType === "approve"
                    ? "Confirmar Aprovação"
                    : "Confirmar Rejeição"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {actionType === "approve"
                    ? "Tem certeza que deseja aprovar este pagamento e liberar o acesso ao curso?"
                    : "Tem certeza que deseja rejeitar este pagamento? Esta ação não pode ser desfeita."}
                </p>

                <div className="flex justify-center gap-3 w-full">
                  <button
                    onClick={() => setIsConfirmationModalOpen(false)}
                    disabled={isProcessing}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={processAction}
                    disabled={isProcessing}
                    className={`px-4 py-2 text-white rounded-md disabled:opacity-50 flex-1 ${
                      actionType === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isProcessing ? "Processando..." : "Confirmar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}