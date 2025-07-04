"use client";

import { Search, Plus, UserCog, ChevronLeft, ChevronRight, Loader2, Shield, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Footer } from "@/app/_components/Footer";
import { Navbar } from "@/app/_components/Navbar";
import { AdminCard } from "./AdminCard";
import { AdminModalView } from "./AdminModalView";
import { AdminModalForm } from "./AdminModalForm";
import { AdminDeleteModal } from "./AdminDeleteModal";
import { toast } from "sonner";

const API_BASE_URL = 'https://academia-egaf-api.onrender.com/academia.egaf.ao';

export default function AdminsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [adminToView, setAdminToView] = useState(null);
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adminsPerPage = 6;

  const getToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('access');
      if (!token) {
        toast.error("Token de acesso não encontrado. Faça login novamente.");
        window.location.href = "/login";
      }
      return token;
    }
    throw new Error("Ambiente não suportado");
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await axios.get(`${API_BASE_URL}/users/admins/all/admins`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        timeout: 10000
      });

      let adminsData = response.data?.response || response.data;
      if (!adminsData) throw new Error("Dados recebidos estão vazios");
      if (!Array.isArray(adminsData)) {
        adminsData = adminsData.data || adminsData.users || adminsData.admins || [];
      }

      const formattedAdmins = adminsData.map(admin => ({
        id_admin: admin.id_admin || admin.id || null,
        full_name: admin.full_name || admin.name || admin.username || 'Não informado',
        email: admin.email || 'Não informado',
        contact: admin.contact || '',
        access_level: admin.access_level || admin.role || 'standard',
        createdAt: admin.createdAt || admin.creation_date || new Date().toISOString(),
        id_account: admin.id_account || null,
        id_user_fk: admin.id_user_fk || admin.user_id || null
      }));

      setAdmins(formattedAdmins);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao carregar administradores";
      toast.error(errorMessage);
      if (err.message.includes("Token") || err.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") fetchAdmins();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedSearch(searchTerm);
    setCurrentPage(1);
  };

  const closeModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowAddModal(false);
    setShowDeleteModal(false);
    setAdminToView(null);
    setAdminToEdit(null);
    setAdminToDelete(null);
    setNewAdmin({ username: "", email: "", password: "" });
  };

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true);
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/users/admins/delete/${adminToDelete?.id_admin}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      await fetchAdmins();
      toast.success('Administrador deletado com sucesso!');
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao deletar administrador');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveEditedAdmin = async () => {
    try {
      setIsSubmitting(true);
      const token = getToken();
      const payload = {};

      if (adminToEdit.full_name && adminToEdit.full_name.trim() !== "") payload.full_name = adminToEdit.full_name;
      if (adminToEdit.email && adminToEdit.email.trim() !== "") payload.email = adminToEdit.email;
      if (adminToEdit.contact && adminToEdit.contact.trim() !== "") payload.contact = adminToEdit.contact;
      if (adminToEdit.currentPassword && adminToEdit.currentPassword.trim() !== "") payload.password = adminToEdit.currentPassword;
      if (adminToEdit.newPassword && adminToEdit.newPassword.trim() !== "") payload.newPassword = adminToEdit.newPassword;

      if (Object.keys(payload).length === 0) {
        toast.warning("Preencha pelo menos um campo para atualizar.");
        setIsSubmitting(false);
        return;
      }

      await axios.patch(`${API_BASE_URL}/users/admins/profile/edit/${adminToEdit.id_admin}`, payload, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      await fetchAdmins();
      toast.success('Administrador atualizado com sucesso!');
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Erro ao atualizar administrador');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveNewAdmin = async () => {
    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!newAdmin.username?.trim() || !newAdmin.email?.trim() || !newAdmin.password?.trim()) {
        toast.error("Nome, email e senha são obrigatórios.");
        setIsSubmitting(false);
        return;
      }

      await axios.post(`${API_BASE_URL}/users/admins/create`, {
        full_name: newAdmin.username,
        email: newAdmin.email,
        password: newAdmin.password,
        contact: newAdmin.contact || ''
      }, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      await fetchAdmins();
      toast.success('Administrador criado com sucesso!');
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao criar administrador');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAdmins = admins.filter(admin =>
    submittedSearch === "" ||
    admin.full_name?.toLowerCase().includes(submittedSearch.toLowerCase()) ||
    admin.email?.toLowerCase().includes(submittedSearch.toLowerCase())
  );

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-start md:items-center mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Administradores</h1>
              </div>
              <p className="text-gray-600">Gerencie todos os administradores com acesso ao sistema</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowAddModal(true)}
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

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
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

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
            {/* Loading State */}
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
                <p className="mt-4 text-gray-600 font-medium">Carregando administradores...</p>
              </div>
            ) : currentAdmins.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {currentAdmins.map(admin => (
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
                        setAdminToView(admin); 
                        setShowViewModal(true); 
                      }} 
                      onEdit={() => { 
                        setAdminToEdit({ 
                          ...admin, 
                          username: admin.full_name, 
                          currentPassword: '', 
                          newPassword: '' 
                        }); 
                        setShowEditModal(true); 
                      }} 
                      onDelete={() => { 
                        setAdminToDelete(admin); 
                        setShowDeleteModal(true); 
                      }} 
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                    <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                      Mostrando <span className="font-medium">{indexOfFirstAdmin + 1}-{Math.min(indexOfLastAdmin, filteredAdmins.length)}</span> de <span className="font-medium">{filteredAdmins.length}</span> administradores
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg transition-colors ${currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Anterior</span>
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg transition-colors ${currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                      >
                        <span className="text-sm font-medium">Próxima</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {submittedSearch ? "Nenhum administrador encontrado" : "Nenhum administrador cadastrado"}
                </h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  {submittedSearch 
                    ? "Não encontramos resultados para sua pesquisa. Tente ajustar os termos ou criar um novo administrador."
                    : "Você ainda não possui administradores cadastrados. Comece adicionando o primeiro."}
                </p>
                <div className="mt-6">
                  <button
                    onClick={submittedSearch ? () => setSubmittedSearch("") : () => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto transition-colors shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">
                      {submittedSearch ? "Limpar pesquisa" : "Adicionar Administrador"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Modals */}
      {showViewModal && adminToView && (
        <AdminModalView admin={adminToView} onClose={closeModal} />
      )}
      
      {showEditModal && adminToEdit && (
        <AdminModalForm 
          mode="edit" 
          admin={adminToEdit} 
          onClose={closeModal} 
          onSubmit={saveEditedAdmin} 
          onChange={setAdminToEdit} 
          isSubmitting={isSubmitting} 
        />
      )}
      
      {showAddModal && (
        <AdminModalForm 
          mode="add" 
          admin={newAdmin} 
          onClose={closeModal} 
          onSubmit={saveNewAdmin} 
          onChange={setNewAdmin} 
          isSubmitting={isSubmitting} 
        />
      )}
      
      {showDeleteModal && adminToDelete && (
        <AdminDeleteModal 
          admin={adminToDelete} 
          onClose={closeModal} 
          onConfirm={confirmDelete} 
          isSubmitting={isSubmitting} 
        />
      )}
    </div>
  );
}