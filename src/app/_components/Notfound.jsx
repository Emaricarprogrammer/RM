"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function NotFoundPage({ message = "Página não encontrada" }) {
  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <p className="text-lg text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

export { NotFoundPage };