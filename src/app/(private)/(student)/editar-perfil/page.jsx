"use client";

import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { EditMyProfile } from "@/api/Users/Students/editProfile";
import { MyProfile } from "@/api/Users/Students/profile";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useUserAuth } from "@/hooks/useAuth";
import { Loading } from "@/app/_components/Loading";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const { loading: isAuthLoading } = useUserAuth(["student"]);
  const [formData, setFormData] = useState({
    full_name: "",
    contact: "",
    email: "",
    password: "",
    newPassword: ""
  });

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsFetching(true);
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          toast.error("Sessão expirada. Faça login novamente.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const id_student = decodedToken.userClaims?.id_student;

        if (!id_student) {
          toast.error("ID do estudante não encontrado");
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
        console.error("Erro ao carregar dados:", err);
        toast.error("Falha ao carregar dados do perfil");
      } finally {
        setIsFetching(false);
      }
    };

    if (!isAuthLoading) {
      fetchUserData();
    }
  }, [isAuthLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!hasChanges()) {
      toast.error("Nenhuma alteração foi feita");
      return false;
    }

    if (formData.password && !formData.newPassword) {
      toast.error("Ao informar a senha atual, você deve fornecer uma nova senha");
      return false;
    }

    if (formData.newPassword && !formData.password) {
      toast.error("Para alterar a senha, informe sua senha atual");
      return false;
    }

    return true;
  };

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

  const isFormValid = () => {
    if (!hasChanges()) return false;
    
    if ((formData.password || formData.newPassword) && 
        !(formData.password && formData.newPassword)) {
      return false;
    }
    
    return true;
  };

async function handleSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsLoading(true);
  
  try {
    const token = localStorage.getItem('access');
    if (!token) {
      toast.error("Token não encontrado");
      return;
    }
    
    const decodedToken = jwtDecode(token);
    const id_student = decodedToken.userClaims.id_student;

    // Prepara os dados apenas com as alterações
    const requestData = {};
    
    // Verifica cada campo por alterações
    if (formData.full_name !== initialData.full_name) {
      requestData.full_name = formData.full_name;
    }
    
    if (formData.contact !== initialData.contact) {
      requestData.contact = formData.contact;
    }
    
    if (formData.email !== initialData.email) {
      requestData.email = formData.email;
    }
    
    // Ajuste para os nomes de campos que o backend espera
    if (formData.password) {
      requestData.password = formData.password; // Alterado de current_password para password
    }
    
    if (formData.newPassword) {
      requestData.newPassword = formData.newPassword; // Mantém newPassword
    }

    // Verifica se há realmente algo para atualizar
    if (Object.keys(requestData).length === 0) {
      toast.error("Nenhuma alteração foi feita");
      return;
    }

    const result = await EditMyProfile(id_student, token, requestData);
    
    if (result.success) {
      toast.success(result.message || "Perfil atualizado com sucesso!");
      setTimeout(() => router.push("/home"), 1500);
    } else {
      if (result.errors) {
        Object.values(result.errors).forEach(errorMessages => {
          errorMessages.forEach(message => toast.error(message));
        });
      } else {
        toast.error(result.message || "Erro ao atualizar perfil");
      }
    }
  } catch (err) {
    toast.error("Erro inesperado ao atualizar perfil");
    console.error("Erro no handleSubmit:", err);
  } finally {
    setIsLoading(false);
  }
}

  if (isAuthLoading || isFetching) {
    return <Loading message="Carregando seus dados..." />;
  }

  if (!initialData) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Não foi possível carregar seus dados</p>
        </div>
      </div>
    );
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      required
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
                      required
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
                      required
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
                    type="submit"
                    className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium rounded-md shadow-md transition-colors ${
                      !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-800 hover:to-blue-600'
                    }`}
                    disabled={!isFormValid() || isLoading}
                  >
                    {isLoading ? (
                      "Salvando..."
                    ) : (
                      "Salvar Alterações"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}