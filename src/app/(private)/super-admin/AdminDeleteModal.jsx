"use client";
import { deleteAdmin } from "@/api/Users/Admins/adminOperation";
import { X } from "lucide-react";
import { useState } from "react";
import { toast, Toaster} from "react-hot-toast";

export const AdminDeleteModal = ({ 
  admin, 
  onClose, 
  onSuccess = () => {} // Callback para ações após sucesso
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!admin) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // 1. Verificar token
      const token = localStorage.getItem("access");
      if (!token) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        window.location.href = "/login";
        return;
      }

      // 2. Fazer a requisição
      const response = await deleteAdmin(token, admin.id_admin);
      // 3. Sucesso
      toast.success(response.message || "Administrador excluído com sucesso!", {
        duration: 3000,
        position: "top-center"
      });

      onSuccess(); // Executa callback de sucesso
      onClose(); // Fecha o modal

    } catch (err) {
      console.error("Erro na exclusão:", err);
      toast.error(err.message || "Falha na exclusão", {
        duration: 5000
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const adminName = admin.full_name || admin.username || "Administrador";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Toaster 
                position="top-center" 
                reverseOrder={false}
              />
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
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full"></span>
                Excluindo...
              </span>
            ) : "Confirmar Exclusão"}
          </button>
        </div>
      </div>
    </div>
  );
};