"use client";

import { User, Edit, Trash2, Eye, Mail, Phone, Shield, Calendar, MoreVertical } from "lucide-react";
import { useState } from "react";

export const AdminCard = ({ admin, onView, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const accessLevelColors = {
    admin: "bg-purple-100 text-purple-800",
    standard: "bg-blue-100 text-blue-800",
    supervisor: "bg-emerald-100 text-emerald-800",
    restricted: "bg-amber-100 text-amber-800"
  };

  const levelColor = accessLevelColors[admin.accessLevel] || "bg-gray-100 text-gray-800";

  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg -translate-y-1' : 'shadow-sm'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating action button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-xs hover:bg-gray-50 transition-all"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
            <button 
              onClick={() => { onView(admin); setShowDropdown(false); }}
              className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700"
            >
              <Eye className="w-4 h-4 mr-3" />
              Ver detalhes
            </button>
            <button 
              onClick={() => { onEdit(admin); setShowDropdown(false); }}
              className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700"
            >
              <Edit className="w-4 h-4 mr-3" />
              Editar
            </button>
            <button 
              onClick={() => { onDelete(admin); setShowDropdown(false); }}
              className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-red-50 text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Remover
            </button>
          </div>
        )}
      </div>

      {/* Profile section */}
      <div className="p-6 pt-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-inner">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className={`absolute -bottom-2 -right-2 px-2 py-1 text-xs font-medium rounded-full ${levelColor} shadow-xs`}>
              {admin.accessLevel || 'standard'}
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-1">{admin.username}</h2>
          <div className="flex items-center text-gray-500 text-sm">
            <Mail className="w-4 h-4 mr-1.5" />
            <span className="truncate max-w-[180px]">{admin.email}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50/50 p-3 rounded-xl">
            <div className="text-xs text-gray-500 mb-1 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Cadastro
            </div>
            <div className="text-sm font-medium text-gray-800">
              {new Date(admin.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
          
          <div className="bg-gray-50/50 p-3 rounded-xl">
            <div className="text-xs text-gray-500 mb-1">Contato</div>
            <div className="text-sm font-medium text-gray-800 flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">{admin.contact || 'Não informado'}</span>
            </div>
          </div>
        </div>

        {/* Primary action button */}
        <button
          onClick={() => onView(admin)}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Ver perfil completo
        </button>
      </div>

      {/* Glow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 opacity-70"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}
    </div>
  );
};