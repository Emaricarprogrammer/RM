"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const AdminDeleteModal = ({ 
  admin, 
  onClose, 
  onSuccess = () => {} // Callback para ações após sucesso
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!admin) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      // 1. Verificar token
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      // 2. Fazer a requisição
      const response = await fetch(
        `https://academia-egaf-api.onrender.com/academia.egaf.ao/users/admins/delete/${admin.id_admin}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // 3. Verificar resposta
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao excluir administrador");
      }

      // 4. Sucesso
      toast.success("Administrador excluído com sucesso!", {
        description: "O administrador foi removido do sistema.",
        duration: 3000,
        position: "top-center"
      });

      onSuccess(); // Executa callback de sucesso
      onClose(); // Fecha o modal

    } catch (err) {
      console.error("Erro na exclusão:", err);
      setError(err.message);
      toast.error("Falha na exclusão", {
        description: err.message,
        duration: 5000
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const adminName = admin.full_name || admin.name || admin.username || "Administrador";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Confirmar Exclusão
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isDeleting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Tem certeza que deseja remover o administrador{" "}
          <span className="font-semibold text-red-600">{adminName}</span>? Esta ação não
          pode ser desfeita.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center justify-center">
                <svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Excluindo...
              </span>
            ) : "Confirmar Exclusão"}
          </button>
        </div>
      </div>
    </div>
  );
};