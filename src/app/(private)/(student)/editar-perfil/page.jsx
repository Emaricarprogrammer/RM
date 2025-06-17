"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/api/api"; // Adicione esta importação
import { EditMyProfile } from "@/api/Users/Students/editProfile";
import { jwtDecode } from "jwt-decode";

export default function EditProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Estado para carregamento inicial
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado inicial com os dados do usuário
  const [formData, setFormData] = useState({
    full_name: "",
    contact: "",
    email: "",
    password: "",
    newPassword: ""
  });
        const token = localStorage.getItem('access');
        
        if (!token) {
          throw new Error("Token não encontrado");
        }

        // 2. Decodificar o token para obter o id_student
        const decodedToken = jwtDecode(token);
        const id_student = decodedToken.userClaims.id_student;

        if (!id_student) {
          throw new Error("ID do estudante não encontrado no token");
        }
        
        if (!decodedToken || !id_student) {
          throw new Error("Usuário não autenticado");
        }
  // Carrega os dados do usuário ao montar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const response = await api.get(`/users/students/profile/${id_student}`, {
          headers: {
            Authorization: `Bearer ${decodedToken}`
          }
        });
        
        if (response.data.success) {
          setFormData(prev => ({
            ...prev,
            full_name: response.data.data.full_name || "",
            contact: response.data.data.contact || "",
            email: response.data.data.email || ""
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
        setError("Falha ao carregar dados do perfil");
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Remove campos vazios (exceto password que pode ser necessário para validação)
      const dataToSend = {
        ...(formData.full_name && { full_name: formData.full_name }),
        ...(formData.contact && { contact: formData.contact }),
        ...(formData.email && { email: formData.email }),
        ...(formData.newPassword && { newPassword: formData.newPassword }),
        password: formData.password // Sempre envia a senha atual para validação
      };
      
      const result = await EditMyProfile(id_student, decodedToken, dataToSend);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          // Limpa apenas o campo de senha após o sucesso
          setFormData(prev => ({ ...prev, password: "", newPassword: "" }));
        }, 2000);
      } else {
        setError(result.message || "Erro ao atualizar perfil");
      }
    } catch (err) {
      setError(err.message || "Falha ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50 to-slate-200 pt-8 md:pt-32 pb-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Card container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white">
            <h1 className="text-2xl font-bold uppercase">Academia Egaf</h1>
            <h2 className="mt-6 text-xl font-medium">Edite seus dados</h2>
            <p className="text-blue-100 mt-3">
              Mantenha suas informações atualizadas para melhor controle
            </p>
          </div>

          {/* Form section */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Número de telefone
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    pattern="[0-9]{9}"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Senha atual (obrigatória para confirmar alterações)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nova Senha (opcional)
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-800 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium rounded-md shadow-md transition-colors hover:from-blue-800 hover:to-blue-600"
                  disabled={!formData.password} // Desabilita se a senha atual não foi informada
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            {success ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Sucesso!</h3>
                <p className="mt-2 text-sm text-gray-500">Seu perfil foi atualizado com sucesso.</p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setSuccess(false);
                    }}
                    className="px-4 py-2 rounded-md bg-blue-800 text-white hover:bg-blue-900 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Confirmação de alteração
                  </h1>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <p className="text-gray-600 mb-6">
                  Tem certeza que deseja prosseguir com essas alterações?
                </p>

                <form onSubmit={handleSubmit} className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setError(null);
                    }}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-800 text-white hover:bg-blue-900 transition-colors flex items-center justify-center min-w-[100px]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Confirmar"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}