"use client";

import { X } from "lucide-react";

export function DeleteCourseModal({ isOpen, onClose, onConfirm, courseTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirmar exclusão
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Tem certeza que deseja excluir o curso{" "}
              <span className="font-semibold">{courseTitle}</span>? Esta ação
              não pode ser desfeita.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
            >
              Excluir Curso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
