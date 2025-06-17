"use client";

import { Users, X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const AdminModalView = ({ admin, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!admin) return null;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Detalhes do Administrador
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <h4 className="text-lg font-semibold">{admin.username}</h4>
              <p className="text-gray-600">{admin.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome de Usuário
            </label>
            <div className="bg-gray-100 p-2 rounded-md">
              <p className="text-gray-800">{admin.username}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="bg-gray-100 p-2 rounded-md">
              <p className="text-gray-800">{admin.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="bg-gray-100 p-2 rounded-md">
                <code className="text-gray-800">
                  {showPassword ? admin.password : "••••••••"}
                </code>
              </div>
              <button
                type="button"
                className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
