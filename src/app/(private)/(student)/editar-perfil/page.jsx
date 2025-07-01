"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { EditMyProfile } from "@/api/Users/Students/editProfile";
import { MyProfile } from "@/api/Users/Students/profile";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useUserAuth } from "@/hooks/useAuth";
import { Loading } from "@/app/_components/Loading";

export default function EditProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const {loading: isAuthLoading} = useUserAuth(["student"])
  const [formData, setFormData] = useState({
    full_name: "",
    contact: "",
    email: "",
    password: "", // Senha atual (obrigatória apenas se houver alterações)
    newPassword: "" // Nova senha (obrigatória se senha atual for informada)
  });

  // Carrega os dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthLoading){
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          toast.error("Ocorreu um erro");
          return;
        }

        const decodedToken = jwtDecode(token);
        const id_student = decodedToken.userClaims.id_student;

        if (!id_student) {
          toast.error("Ocorreu um erro");
          return;
        }

        const response = await MyProfile(id_student, token);
        
        if (response.success) {
          const userData = {
            full_name: response.data.full_name || "",
            contact: response.data.contact || "",
            email: response.data.email || "",
            password: "",
            newPassword: ""
          };
          setInitialData(userData);
          setFormData(userData);
        } else {
          toast.error(response.message || "Erro ao carregar perfil");
        }
      } catch (err) {
        toast.error("Falha ao carregar dados");
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchUserData();
  }}, [isAuthLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validação do formulário
  const validateForm = () => {
    // Verifica se pelo menos um campo foi alterado
    if (!hasChanges()) {
      toast.error("Nenhuma alteração foi feita");
      return false;
    }

    // Se informou senha atual, nova senha é obrigatória
    if (formData.password && !formData.newPassword) {
      toast.error("Ao informar a senha atual, você deve fornecer uma nova senha");
      return false;
    }

    // Se informou nova senha, senha atual é obrigatória
    if (formData.newPassword && !formData.password) {
      toast.error("Para alterar a senha, informe sua senha atual");
      return false;
    }

    return true;
  };

  // Verifica se há alterações nos campos de perfil ou senha
  const hasChanges = () => {
    if (!initialData) return false;
    
    return (
      formData.full_name !== initialData.full_name ||
      formData.contact !== initialData.contact ||
      formData.email !== initialData.email ||
      formData.password !== "" ||
      formData.newPassword !== ""
    );
  };

  // Verifica se o formulário está em estado válido para habilitar o botão
  const isFormValid = () => {
    if (!hasChanges()) return false;
    
    // Se informou uma senha (atual ou nova), ambas devem estar preenchidas
    if ((formData.password || formData.newPassword) && 
        !(formData.password && formData.newPassword)) {
      return false;
    }
    
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        toast.error("Token não encontrado");
        return;
      }
      
      const decodedToken = jwtDecode(token);
      const id_student = decodedToken.userClaims.id_student;

      // Prepara os dados no formato exato que o back-end espera
      const requestData = {
        full_name: formData.full_name !== initialData.full_name ? formData.full_name : undefined,
        email: formData.email !== initialData.email ? formData.email : undefined,
        contact: formData.contact !== initialData.contact ? formData.contact : undefined,
        password: formData.password || undefined, // Envia apenas se houver senha atual
        newPassword: formData.newPassword || undefined // Envia apenas se houver nova senha
      };

      const result = await EditMyProfile(id_student, token, requestData);
      
      if (result.success) {
        setSuccess(true);
        setInitialData({
          ...initialData,
          full_name: formData.full_name,
          contact: formData.contact,
          email: formData.email
        });
        
        toast.success("Perfil atualizado com sucesso!");
        
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          // Limpa apenas os campos de senha
          setFormData(prev => ({ 
            ...prev, 
            password: "", 
            newPassword: "" 
          }));
        }, 2000);
      } else {
        toast.error(result.message || "Erro ao atualizar");
      }
    } catch (err) {
      toast.error(err.message || "Falha na atualização");
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthLoading)
  {
    return <Loading message="Academia Egaf..."/>
  }

  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50 to-slate-200 pt-8 md:pt-32 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white">
              <h1 className="text-2xl font-bold uppercase">Academia Egaf</h1>
              <h2 className="mt-6 text-xl font-medium">Editar Perfil</h2>
              <p className="text-blue-100 mt-3">Atualize suas informações</p>
            </div>

            <div className="p-6 sm:p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      pattern="[0-9]{9,11}"
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 outline-none"
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
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Senha Atual
                      <span className="text-xs text-gray-500 ml-1">(obrigatória se quiser alterar a senha)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nova Senha
                      <span className="text-xs text-gray-500 ml-1">(obrigatória se informar senha atual)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasChanges()) {
                        toast.error("Nenhuma alteração foi feita");
                        return;
                      }
                      setIsOpen(true);
                    }}
                    className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium rounded-md shadow-md transition-colors ${
                      !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-800 hover:to-blue-600'
                    }`}
                    disabled={!isFormValid()}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      "Salvar Alterações"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal de confirmação */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
              {success ? (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">Sucesso!</h3>
                  <p className="mt-2 text-sm text-gray-500">Perfil atualizado.</p>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-md bg-blue-800 text-white hover:bg-blue-900"
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
                      Confirmar Alterações
                    </h1>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Tem certeza que deseja atualizar seu perfil?
                  </p>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-4 py-2 rounded-md bg-blue-800 text-white hover:bg-blue-900 flex items-center justify-center min-w-[100px]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Confirmar"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </>
  );
}