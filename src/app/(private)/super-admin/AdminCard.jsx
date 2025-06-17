"use client";

import { Users, Edit, Trash2, Eye } from "lucide-react";

export const AdminCard = ({ admin, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 relative">
      <div className="p-6">
        {/* Botões de ação */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => onView(admin)}
            className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(admin)}
            className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(admin)}
            className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
            title="Apagar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {admin.username}
              </h2>
              <p className="text-gray-600">{admin.email}</p>
            </div>
          </div>

          <button
            onClick={() => onView(admin)}
            className="w-full block text-center bg-gradient-to-br from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-md transition-all"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};
