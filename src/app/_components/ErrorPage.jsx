"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function ErrorPage({ message = "Desculpe, estamos com problemas tente mais tarde!" }) {
  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">500</h1>
        <p className="text-lg text-gray-600 mb-6">{message}</p>
      </div>
    </div>
  );
}

export { ErrorPage };