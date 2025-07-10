"use client";
import { Search, Plus, ChevronLeft, ChevronRight, Loader2, Shield, Settings } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { Navbar } from "@/app/_components/Navbar";
import { AdminCard } from "./AdminCard";
import { AdminModalView } from "./AdminModalView";
import { AdminModalForm } from "./AdminModalForm";
import { AdminDeleteModal } from "./AdminDeleteModal";
import { toast, Toaster } from "react-hot-toast";
import { fetchAllAdmins, createAdmin, updateAdmin, deleteAdmin } from "@/api/Users/Admins/adminOperation";
import { useUserAuth } from "@/hooks/useAuth";
import { Loading } from "@/app/_components/Loading";
const ADMINS_PER_PAGE = 6;

export default function AdminsListPage() {
  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [admins, setAdmins] = useState([]);
  const {loading: isAuthLoading} = useUserAuth(["SUPER_ADMIN"])
  const [modalState, setModalState] = useState({
    add: false,
    view: false,
    edit: false,
    delete: false
  });
  const [selectedAdmin, setSelectedAdmin] = useState({
    view: null,
    edit: null,
    delete: null
  });
  const [newAdmin, setNewAdmin] = useState({ 
    username: "", 
    email: "", 
    password: "",
    contact: "" 
  });

  // Obter token JWT
  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('access');
      if (!token) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        window.location.href = "/login";
      }
      return token;
    }
    return null;
  }, []);

  // Carregar administradores
  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const { adminsData } = await fetchAllAdmins(token);
      setAdmins(adminsData);
    } catch (error) {
      console.error("Failed to load admins:", error);
      toast.error(error.message || "Falha ao carregar administradores");
      if (error.message.includes("Token") || error.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm);
    setCurrentPage(1);
  };

  const closeModal = () => {
    setModalState({
      add: false,
      view: false,
      edit: false,
      delete: false
    });
    setSelectedAdmin({
      view: null,
      edit: null,
      delete: null
    });
    setNewAdmin({ username: "", email: "", password: "", contact: "" });
  };

  // Operações CRUD
  const handleCreateAdmin = async () => {
    setIsSubmitting(true);
    try {
      const token = getToken();
      const response = await createAdmin(token, {
        full_name: newAdmin.username,
        email: newAdmin.email,
        password: newAdmin.password,
        contact: newAdmin.contact || ''
      });
        if (!response.success)
        {
          toast.error(response.message || "Ocorreu um erro");
        }
      
      await loadAdmins();
      toast.success("Administrador criado com sucesso");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Erro ao criar administrador");
    } finally {
      setIsSubmitting(false);
    }
  };

const handleUpdateAdmin = async (partialData) => {
  setIsSubmitting(true);
  try {
    const token = getToken();
    
    // Cria o payload com os campos no formato que o backend espera
    const payload = {
      ...(partialData.full_name && { full_name: partialData.full_name }),
      ...(partialData.email && { email: partialData.email }),
      ...(partialData.contact !== undefined && { contact: partialData.contact || '' }),
      // Mapeia corretamente os campos de senha
      ...(partialData.current_password && { password: partialData.current_password }),
      ...(partialData.new_password && { newPassword: partialData.new_password })
    };

    // Remove campos undefined (mas mantém string vazia para contact)
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    if (Object.keys(payload).length === 0) {
      toast.error("Nenhuma alteração válida para atualizar");
      return;
    }

    console.log("Payload final:", payload); // Para debug

    const response = await updateAdmin(token, selectedAdmin.edit.id_admin, payload);
    console.log(response)
    if (!response.success) {
      toast.error(response.message || "Ocorreu um erro");
      return;
    }
    await loadAdmins();
    toast.success(response.message);
    closeModal();
  } catch (error) {
    toast.error(error.message || "Erro ao atualizar administrador");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleDeleteAdmin = async () => {
    setIsSubmitting(true);
    try {
      const token = getToken();
      const response = await deleteAdmin(token, selectedAdmin.delete.id_admin);
      await loadAdmins();
      if (!response.success)
        {
          toast.error(response.message || "Ocorreu um erro");
        }
      toast.success( response.message || "Administrador removido com sucesso");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Erro ao remover administrador");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtros e paginação
  const filteredAdmins = admins.filter(admin =>
    submittedSearch === "" ||
    admin.full_name?.toLowerCase().includes(submittedSearch.toLowerCase()) ||
    admin.email?.toLowerCase().includes(submittedSearch.toLowerCase())
  );

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * ADMINS_PER_PAGE,
    currentPage * ADMINS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredAdmins.length / ADMINS_PER_PAGE);

  const handlePaginate = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isAuthLoading)
  {
    return (
      <Loading message="Academia Egaf..."/>
    )
  }
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="text-blue-600" />
              Gestão de Administradores
            </h1>
            <p className="text-gray-600">Gerencie os acessos ao sistema</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setModalState(prev => ({...prev, add: true}))}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Novo Administrador</span>
            </button>
            
            <Link 
              href="/super-admin/configuracoes-sistema" 
              className="flex items-center gap-2 justify-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-gray-950 transition-all shadow-md hover:shadow-lg"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Configurações</span>
            </Link>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar por nome ou email..."
              className="w-full pl-10 pr-24 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
            >
              Pesquisar
            </button>
          </div>
        </form>

        {/* Lista de Administradores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
          {paginatedAdmins.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {paginatedAdmins.map(admin => (
                  <AdminCard
                    key={admin.id_admin}
                    admin={{
                      id: admin.id_admin, 
                      username: admin.full_name, 
                      email: admin.email, 
                      contact: admin.contact, 
                      accessLevel: admin.access_level, 
                      createdAt: admin.createdAt 
                    }}
                    onView={() => {
                      setSelectedAdmin(prev => ({...prev, view: admin}));
                      setModalState(prev => ({...prev, view: true}));
                    }}
                    onEdit={() => {
                      setSelectedAdmin(prev => ({
                        ...prev,
                        edit: { 
                          ...admin, 
                          username: admin.full_name,
                          currentPassword: '',
                          newPassword: '' 
                        }
                      }));
                      setModalState(prev => ({...prev, edit: true}));
                    }}
                    onDelete={() => {
                      setSelectedAdmin(prev => ({...prev, delete: admin}));
                      setModalState(prev => ({...prev, delete: true}));
                    }}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePaginate}
                  totalItems={filteredAdmins.length}
                  itemsPerPage={ADMINS_PER_PAGE}
                />
              )}
            </>
          ) : (
            <EmptyState 
              hasSearch={submittedSearch !== ""}
              onClearSearch={() => setSubmittedSearch("")}
              onAddAdmin={() => setModalState(prev => ({...prev, add: true}))}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {modalState.view && (
        <AdminModalView 
          admin={selectedAdmin.view} 
          onClose={closeModal} 
        />
      )}
      
      {modalState.edit && (
        <AdminModalForm 
          mode="edit" 
          admin={selectedAdmin.edit} 
          onClose={closeModal} 
          onSubmit={handleUpdateAdmin} 
          onChange={(updatedAdmin) => setSelectedAdmin(prev => ({
            ...prev,
            edit: updatedAdmin
          }))} 
          isSubmitting={isSubmitting} 
        />
      )}
      
      {modalState.add && (
        <AdminModalForm 
          mode="add" 
          admin={newAdmin} 
          onClose={closeModal} 
          onSubmit={handleCreateAdmin} 
          onChange={setNewAdmin} 
          isSubmitting={isSubmitting} 
        />
      )}
      
      {modalState.delete && (
        <AdminDeleteModal 
          admin={selectedAdmin.delete} 
          onClose={closeModal} 
          onConfirm={handleDeleteAdmin} 
          isSubmitting={isSubmitting} 
        />
      )}
    </div>
  );
}

// Componentes auxiliares
function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) pages.push(1);
      if (startPage > 2) pages.push('...');
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) pages.push('...');
      if (endPage < totalPages) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
      <div className="text-sm text-gray-600 mb-2 sm:mb-0">
        Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}</span> de <span className="font-medium">{totalItems}</span> administradores
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg transition-colors ${currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Anterior</span>
        </button>
        
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? onPageChange(page) : null}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === page 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : typeof page === 'number' 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'cursor-default'
              }`}
              disabled={typeof page !== 'number'}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg transition-colors ${currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
        >
          <span className="text-sm font-medium">Próxima</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ hasSearch, onClearSearch, onAddAdmin }) {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
        <Shield className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">
        {hasSearch ? "Nenhum administrador encontrado" : "Nenhum administrador cadastrado"}
      </h3>
      <p className="mt-2 text-gray-500 max-w-md mx-auto">
        {hasSearch 
          ? "Não encontramos resultados para sua pesquisa. Tente ajustar os termos ou criar um novo administrador."
          : "Você ainda não possui administradores cadastrados. Comece adicionando o primeiro."}
      </p>
      <div className="mt-6">
        <button
          onClick={hasSearch ? onClearSearch : onAddAdmin}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">
            {hasSearch ? "Limpar pesquisa" : "Adicionar Administrador"}
          </span>
        </button>
      </div>
    </div>
  );
}