"use client";

import { BookOpen } from "lucide-react"; // Ou importe seu próprio logo

export const Loading = ({ message = "Carregando..." }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
      <div className="flex items-center gap-4">
        {/* Logo - Substitua pelo seu componente de logo */}
        <div className="animate-pulse">
          <BookOpen className="w-10 h-10 text-blue-600" />
          {/* Ou use: <img src="/seu-logo.png" alt="Logo" className="w-10 h-10" /> */}
        </div>
        
        {/* Container da mensagem e spinner */}
        <div className="flex items-center gap-3">
          {/* Spinner minimalista */}
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          
          {/* Mensagem */}
          <span className="text-gray-700 font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};