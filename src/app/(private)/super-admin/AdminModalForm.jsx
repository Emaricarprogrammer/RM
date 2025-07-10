"use client";

import { X, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const AdminModalForm = ({
  mode = "edit",
  admin = { 
    username: '', 
    email: '', 
    currentPassword: '', 
    newPassword: '', 
    contact: '' 
  },
  onClose,
  onSubmit,
  onChange,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const initialAdminData = useRef(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize initial data only once when modal opens
  useEffect(() => {
    if (mode === 'edit' && !initialAdminData.current) {
      initialAdminData.current = {
        username: admin.username,
        email: admin.email,
        contact: admin.contact || ''
      };
    }
  }, [mode, admin]);

  // Check for changes in form fields
  useEffect(() => {
    if (mode === 'add') {
      // For add mode, enable button when required fields are filled
      const requiredFieldsFilled = 
        admin.username.trim() && 
        admin.email.trim() && 
        (admin.password ? admin.password.trim() : false);
      setHasChanges(requiredFieldsFilled);
    } else if (initialAdminData.current) {
      // For edit mode, check if any field has changed
      const fieldsChanged = 
        admin.username.trim() !== initialAdminData.current.username.trim() ||
        admin.email.trim() !== initialAdminData.current.email.trim() ||
        (admin.contact || '').trim() !== (initialAdminData.current.contact || '').trim() ||
        admin.currentPassword.trim() ||
        admin.newPassword.trim();
      
      setHasChanges(fieldsChanged);
    }
  }, [admin, mode]);

const handleSubmit = async () => {
  setError('');
  
  // Validação básica de email
  if (admin.email && !/^\S+@\S+\.\S+$/.test(admin.email)) {
    setError('Email inválido');
    return;
  }

  // Validação de alteração de senha
  if (mode === 'edit' && admin.newPassword && !admin.currentPassword) {
    setError('Para alterar a senha, forneça a senha atual');
    return;
  }

  setIsLoading(true);

try {
    const changedFields = {};
    console.log(changedFields)

    // Verifica cada campo modificado
    if (admin.username.trim() !== initialAdminData.current.username.trim()) {
      changedFields.full_name = admin.username.trim();
    }
    
    if (admin.email.trim() !== initialAdminData.current.email.trim()) {
      changedFields.email = admin.email.trim();
    }
    
    if ((admin.contact || '').trim() !== (initialAdminData.current.contact || '').trim()) {
      changedFields.contact = admin.contact?.trim() || '';
    }

    // Campos de senha
    if (admin.newPassword.trim()) {
      changedFields.current_password = admin.currentPassword.trim();
      changedFields.new_password = admin.newPassword.trim();
    }

    if (Object.keys(changedFields).length === 0) {
      setError('Nenhuma alteração detectada');
      return;
    }

    await onSubmit(changedFields); // Envia apenas os campos alterados
  } catch (err) {
    setError(err.message || 'Erro ao salvar as alterações');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {mode === "add" ? "Adicionar Administrador" : "Editar Administrador"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome Completo</label>
            <input
              type="text"
              value={admin.username}
              onChange={(e) => onChange({ ...admin, username: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nome completo do administrador"
              required={mode === 'add'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={admin.email}
              onChange={(e) => onChange({ ...admin, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="email@exemplo.com"
              required={mode === 'add'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contato</label>
            <input
              type="tel"
              maxLength={9}
              value={admin.contact || ''}
              onChange={(e) => onChange({ ...admin, contact: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="9xx-xxx-xxx"
            />
          </div>

          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium mb-1">Senha Atual</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={admin.currentPassword}
                  onChange={(e) => onChange({ ...admin, currentPassword: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md pr-10"
                  placeholder="Somente se desejar alterar a senha"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              {mode === "add" ? "Senha" : "Nova Senha"}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={mode === 'add' ? admin.password : admin.newPassword}
                onChange={(e) => onChange({ 
                  ...admin, 
                  [mode === 'add' ? 'password' : 'newPassword']: e.target.value 
                })}
                className="w-full p-2 border border-gray-300 rounded-md pr-10"
                placeholder={mode === "edit" ? "Somente se desejar alterar" : ""}
                required={mode === 'add'}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !hasChanges}
            className={`px-4 py-2 rounded-md ${
              isLoading || !hasChanges
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              mode === "add" ? "Adicionar" : "Salvar Alterações"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};