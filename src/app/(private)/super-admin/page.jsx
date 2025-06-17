"use client";

import { Search, Plus, UserCog } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { Navbar } from "@/app/_components/Navbar";
import { AdminCard } from "./AdminCard";
import { AdminModalView } from "./AdminModalView";
import { AdminModalForm } from "./AdminModalForm";
import { AdminDeleteModal } from "./AdminDeleteModal";

export default function AdminsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [adminToView, setAdminToView] = useState(null);
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const adminsPerPage = 6;

  // Gerador de admins de exemplo
  const generateMockAdmins = () => {
    const mockAdmins = [];

    for (let i = 1; i <= 12; i++) {
      mockAdmins.push({
        id: i,
        username: `admin${i}`,
        email: `admin${i}@escola.com`,
        password: `SenhaSegura${i}${i}${i}`,
      });
    }
    return mockAdmins;
  };

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

  // Funções de CRUD
  const confirmDelete = () => {
    console.log("Admin deletado:", adminToDelete);
    closeModal();
  };

  const saveEditedAdmin = () => {
    console.log("Admin editado:", adminToEdit);
    closeModal();
  };

  const saveNewAdmin = () => {
    console.log("Novo admin adicionado:", newAdmin);
    closeModal();
  };

  // Filtra os admins
  const filteredAdmins = generateMockAdmins().filter(
    (admin) =>
      submittedSearch === "" ||
      admin.username.toLowerCase().includes(submittedSearch.toLowerCase()) ||
      admin.email.toLowerCase().includes(submittedSearch.toLowerCase())
  );

  // Paginação
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col">
          {/* Cabeçalho com título, busca e botão de adicionar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
                Administradores do Sistema
              </h1>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Adicionar
              </button>
            </div>

            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <div className="flex gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Pesquise por administradores"
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-700 focus:border-blue-700 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium py-3 px-4 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  <Search className="w-5 h-5" />
                  Pesquisar
                </button>
              </div>
            </form>
          </div>

          {/* Botão de configurações do sistema */}
          <div className="mb-8">
            <Link
              href="/super-admin/configuracoes-sistema"
              className="flex items-center gap-2 bg-gradient-to-br from-purple-900 to-purple-700 text-white font-medium py-3 px-6 rounded-md hover:opacity-90 transition-opacity w-fit"
            >
              <UserCog className="w-5 h-5" />
              Configurações do Sistema
            </Link>
          </div>

          {/* Lista de Administradores */}
          {currentAdmins.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentAdmins.map((admin) => (
                  <AdminCard
                    key={admin.id}
                    admin={admin}
                    onView={(admin) => {
                      setAdminToView(admin);
                      setShowViewModal(true);
                    }}
                    onEdit={(admin) => {
                      setAdminToEdit(admin);
                      setShowEditModal(true);
                    }}
                    onDelete={(admin) => {
                      setAdminToDelete(admin);
                      setShowDeleteModal(true);
                    }}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>

                  <div className="flex items-center gap-2">
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
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center ${
                            currentPage === pageNum
                              ? "bg-gradient-to-br from-blue-900 to-blue-700 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="mx-1">...</span>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-gray-700 hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhum administrador encontrado com esse termo de busca.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Modais */}
      {showViewModal && (
        <AdminModalView admin={adminToView} onClose={closeModal} />
      )}

      {showEditModal && (
        <AdminModalForm
          mode="edit"
          admin={adminToEdit}
          onClose={closeModal}
          onSubmit={saveEditedAdmin}
          onChange={setAdminToEdit}
        />
      )}

      {showAddModal && (
        <AdminModalForm
          mode="add"
          admin={newAdmin}
          onClose={closeModal}
          onSubmit={saveNewAdmin}
          onChange={setNewAdmin}
        />
      )}

      {showDeleteModal && (
        <AdminDeleteModal
          admin={adminToDelete}
          onClose={closeModal}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
