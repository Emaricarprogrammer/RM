"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { Footer } from "@/app/_components/Footer";

export default function PaymentApprovalPage() {
  // Estados para controle da UI
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' ou 'reject'
  const [isProcessing, setIsProcessing] = useState(false);

  // Dados mockados - TODOS com status 'pending'
  const [payments, setPayments] = useState([
    {
      id: "1", // ID interno apenas para React keys
      studentName: "João Miguel",
      email: "joao@example.com",
      courseName: "Programação Web Moderna",
      courseType: "online",
      amount: 25000,
      paymentDate: "2023-10-15",
      status: "pending",
    },
    {
      id: "2",
      studentName: "Maria Silva",
      email: "maria@example.com",
      courseName: "Design Gráfico",
      courseType: "presential",
      amount: 30000,
      paymentDate: "2023-10-16",
      status: "pending",
    },
    {
      id: "3",
      studentName: "Carlos Eduardo",
      email: "carlos@example.com",
      courseName: "Marketing Digital",
      courseType: "online",
      amount: 18000,
      paymentDate: "2023-10-14",
      status: "pending",
    },
  ]);

  // Filtrar apenas pagamentos pendentes (para busca)
  const filteredPayments = payments.filter((payment) => {
    return (
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("pt-AO", options);
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

  // Processar ação (aprovar/rejeitar)
  const processAction = () => {
    setIsProcessing(true);

    // Simular chamada à API
    setTimeout(() => {
      // Remover o pagamento da lista (pois não estará mais como 'pending')
      setPayments(
        payments.filter((payment) => payment.id !== selectedPayment.id)
      );

      // Fechar modais e resetar estados
      setIsProcessing(false);
      setIsConfirmationModalOpen(false);
      setIsDetailModalOpen(false);

      // Aqui você faria a chamada real ao backend para atualizar o status
      // fetch(`/api/payments/${selectedPayment.id}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: actionType === 'approve' ? 'approved' : 'rejected' })
      // })
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Pagamentos Pendentes
            </h1>
            <p className="text-gray-600">
              Aprove ou rejeite os pagamentos por transferência bancária
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

        {/* Cartões de pagamento (visão mobile) */}
        <div className="md:hidden space-y-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-4 h-4" />
                    <span className="ml-1">Pendente</span>
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
                      {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tipo</p>
                    <p className="font-medium">
                      {payment.courseType === "online"
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
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">
                Nenhum pagamento pendente encontrado
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
                  <th className="px-6 py-3 text-right font-medium text-white uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
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
                          {payment.courseType === "online"
                            ? "Online"
                            : "Presencial"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {formatDate(payment.paymentDate)}
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500 bg-gray-50"
                    >
                      Nenhum pagamento pendente encontrado
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
                Detalhes do Pagamento Pendente
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
                      {selectedPayment.courseType === "online"
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
                      {formatDate(selectedPayment.paymentDate)}
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
