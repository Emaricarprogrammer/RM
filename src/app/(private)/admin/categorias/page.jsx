"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, Search, X } from "lucide-react";
import { Footer } from "@/app/_components/Footer";
import Link from "next/link";

export default function CategoriesAdminPage() {
  // Estados para os modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [modalType, setModalType] = useState(""); // 'edit' ou 'delete'
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState({ name: "" });

  // Mock de categorias
  const [categories, setCategories] = useState([
    { id: 1, name: "Programação", courseCount: 24 },
    { id: 2, name: "Design", courseCount: 18 },
    { id: 3, name: "Marketing Digital", courseCount: 15 },
    { id: 4, name: "Negócios", courseCount: 12 },
  ]);

  // Filtrar categorias
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal de edição
  const openEditModal = (category) => {
    setCurrentCategory(category);
    setModalType("edit");
    setIsModalOpen(true);
  };

  // Abrir modal de adição
  const openAddModal = () => {
    setNewCategory({ name: "" });
    setIsAddModalOpen(true);
  };

  // Abrir modal de exclusão
  const openDeleteModal = (category) => {
    setCurrentCategory(category);
    setModalType("delete");
    setIsModalOpen(true);
  };

  // Salvar edição
  const handleSave = (e) => {
    e.preventDefault();
    const updatedCategories = categories.map((cat) =>
      cat.id === currentCategory.id ? currentCategory : cat
    );
    setCategories(updatedCategories);
    setIsModalOpen(false);
  };

  // Adicionar nova categoria
  const handleAdd = (e) => {
    e.preventDefault();
    const newId = Math.max(...categories.map((c) => c.id)) + 1;
    setCategories([
      ...categories,
      { ...newCategory, id: newId, courseCount: 0 },
    ]);
    setIsAddModalOpen(false);
  };

  // Confirmar exclusão
  const handleDelete = () => {
    setCategories(categories.filter((cat) => cat.id !== currentCategory.id));
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Gestão de Categorias
            </h1>
            <p className="text-gray-600">
              Gerencie as categorias de cursos da plataforma
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
                placeholder="Pesquisar categorias"
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-800 focus:border-blue-800 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Botão Adicionar */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>

        {/* Tabela de Categorias */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-br from-blue-900 to-blue-700">
                <tr className="text-sm">
                  <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="py-3 text-left font-medium text-white uppercase tracking-wider">
                    Nº de Cursos
                  </th>
                  <th className="px-24 py-3 text-left font-medium text-white uppercase tracking-wider">
                    Acesso
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-white uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {category.courseCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/cursos?category=${category.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="inline-flex items-center text-blue-800 hover:text-blue-600 font-medium hover:underline"
                        >
                          Ver cursos dessa categoria
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-blue-800 hover:text-blue-600 mr-4"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-gray-500 bg-gray-50"
                    >
                      Nenhuma categoria encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edição/Exclusão */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              {modalType === "edit" ? (
                <>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    Editar Categoria
                  </h3>
                  <form onSubmit={handleSave}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Nome da Categoria
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-800 focus:border-blue-800 outline-none"
                        value={currentCategory?.name || ""}
                        onChange={(e) =>
                          setCurrentCategory({
                            ...currentCategory,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-md hover:opacity-90"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    Confirmar Exclusão
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Tem certeza que deseja excluir a categoria "
                    {currentCategory?.name}"? Esta ação não pode ser desfeita.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Confirmar Exclusão
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adição */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 relative">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Adicionar Nova Categoria
              </h3>
              <form onSubmit={handleAdd}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Nome da Categoria
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-800 focus:border-blue-800 outline-none"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-md hover:opacity-90"
                  >
                    Adicionar Categoria
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
