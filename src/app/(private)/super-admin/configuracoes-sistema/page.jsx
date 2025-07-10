"use client";
import {
  Banknote,
  Mail,
  MessageCircle,
  Save,
  X,
  ShieldAlert,
  CheckCircle,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { Navbar } from "@/app/_components/Navbar";
import { GetCredentials } from "@/api/Users/Admins/SuperAdmin/getCredentials";
import { GetOTP, EditCredentials } from "@/api/Users/Admins/SuperAdmin/editCredentials";
import toast, { Toaster } from "react-hot-toast";
import { Loading } from "@/app/_components/Loading";
import { useUserAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SystemSettingsPage() {
  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({
    bankName: "",
    accountHolder: "",
    iban: "",
    private_email: "",
    newPrivate_email: "",
    address: "",
    phoneNumber: "",
    facebookLink: "",
    instagramLink: "",
    linkedinLink: ""
  });
  const [credentialsId, setCredentialsId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const router = useRouter();
  const { loading: isAuthLoading } = useUserAuth(["SUPER_ADMIN"]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await GetCredentials();
        
        if (response.success && response.Private_credentials) {
          const data = response.Private_credentials;
          setCredentialsId(data.id_private_credentials);
          
          const mappedData = {
            bankName: data.bank_name || "",
            accountHolder: data.account_holder_name || "",
            iban: data.iban || "",
            private_email: data.private_email || "",
            newPrivate_email: data.private_email || "",
            address: data.private_adresss || "",
            phoneNumber: data.private_phone ? String(data.private_phone) : "",
            facebookLink: data.facebook_url || "",
            instagramLink: data.instagram_url || "",
            linkedinLink: data.linkedin_url || ""
          };
          
          setInitialData(mappedData);
          setFormData(mappedData);
        } else {
          setError(response.message || "Falha ao carregar configurações");
        }
      } catch (err) {
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadInitialData();
    }
  }, [token]);

  useEffect(() => {
    if (initialData) {
      const changesExist = Object.keys(formData).some(
        key => formData[key] !== initialData[key]
      );
      setHasChanges(changesExist);
    }
  }, [formData, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getChangedFields = () => {
    if (!initialData) return {};
    
    const changes = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== initialData[key]) {
        changes[key] = formData[key];
      }
    });
    
    return changes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    const changes = getChangedFields();
    
    if (Object.keys(changes).length === 0) {
      setFormError("Nenhuma alteração foi realizada");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const otpResponse = await GetOTP(formData.private_email);
      
      if (otpResponse.success) {
        setOtpMessage(otpResponse.message || "Código OTP enviado para seu e-mail");
        setShowOtpModal(true);
        toast.success('Código OTP enviado para seu e-mail!', {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        setFormError(otpResponse.message || "Falha ao solicitar OTP");
        toast.error(otpResponse.message || "Falha ao solicitar OTP", {
          duration: 3000,
          position: 'top-center',
        });
      }
    } catch (err) {
      setFormError(err.message || "Erro ao solicitar OTP");
      toast.error(err.message || "Erro ao solicitar OTP", {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

const handleOtpSubmit = async (e) => {
  e.preventDefault();
  setOtpError("");
  
  if (!otp || otp.length !== 6) {
    setOtpError("O código OTP deve ter 6 dígitos");
    return;
  }

  setIsSubmitting(true);
  
  try {
    const changes = getChangedFields();
    
    // Criar payload apenas com os campos alterados
    const payload = {
      id_private_credentials: credentialsId,
      otp_code: Number(otp)
    };

    // Adicionar apenas os campos que foram alterados
    if (changes.bankName !== undefined) payload.bank_name = changes.bankName;
    if (changes.accountHolder !== undefined) payload.account_holder_name = changes.accountHolder;
    if (changes.iban !== undefined) payload.iban = changes.iban;
    if (changes.newPrivate_email !== undefined) payload.newPrivate_email = changes.newPrivate_email;
    if (changes.address !== undefined) payload.private_adresss = changes.address;
    if (changes.phoneNumber !== undefined) payload.private_phone = Number(changes.phoneNumber);
    if (changes.facebookLink !== undefined) payload.facebook_url = changes.facebookLink;
    if (changes.instagramLink !== undefined) payload.instagram_url = changes.instagramLink;
    if (changes.linkedinLink !== undefined) payload.linkedin_url = changes.linkedinLink;

    const response = await EditCredentials(credentialsId, payload, token);
    
    if (response.success) {
      setInitialData(prev => ({ ...prev, ...changes }));
      setSubmitSuccess(true);
      setShowOtpModal(false);
      setOtp("");
      
      toast.success('Configurações atualizadas com sucesso!', {
        duration: 3000,
        position: 'top-center',
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setOtpError(response.message || "Falha ao atualizar configurações");
      toast.error(response.message || "Falha ao atualizar configurações", {
        duration: 3000,
        position: 'top-center',
      });
    }
  } catch (err) {
    setOtpError(err.message || "Erro ao atualizar configurações");
    toast.error(err.message || "Erro ao atualizar configurações", {
      duration: 3000,
      position: 'top-center',
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const resendOtp = async () => {
    setOtpError("");
    setIsResendingOtp(true);
    
    try {
      const response = await GetOTP(formData.private_email);
      
      if (response.success) {
        setOtpMessage(response.message || "Novo código OTP enviado");
        toast.success(response.message || 'Novo código OTP enviado para seu e-mail!', {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        setOtpError(response.message || "Falha ao reenviar OTP");
        toast.error(response.message || "Falha ao reenviar OTP", {
          duration: 3000,
          position: 'top-center',
        });
      }
    } catch (err) {
      setOtpError(err.message || "Erro ao reenviar OTP");
      toast.error(err.message || "Erro ao reenviar OTP", {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setIsResendingOtp(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return <Loading message="Carregando..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="text-red-500 mb-4">
              <ShieldAlert className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tentar novamente
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col">
      <Toaster />
      <Navbar />

      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-700" />
                Verificação de Segurança
              </h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                }}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              {otpMessage || `Enviamos um código de 6 dígitos para ${formData.private_email}. Insira o código abaixo para confirmar as alterações.`}
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456"
                  maxLength={6}
                  required
                  disabled={isSubmitting}
                />
                {otpError && (
                  <p className="text-red-500 text-sm mt-1">{otpError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
                  disabled={isResendingOtp}
                >
                  {isResendingOtp ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : 'Reenviar código'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verificando..." : "Verificar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 py-8">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-6 text-white">
              <h1 className="mt-3 text-2xl font-bold uppercase">
                Configurações do Sistema
              </h1>
              <p className="text-blue-100 mt-4 text-lg">
                Gerencie as configurações bancárias, de email, contato e redes sociais
              </p>
            </div>

            <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
              {formError && (
                <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-md text-sm flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  {formError}
                </div>
              )}

              {submitSuccess && (
                <div className="mb-6 p-3 bg-green-100 text-green-800 rounded-md text-sm flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Configurações atualizadas com sucesso!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6 border-b border-gray-200 pb-8">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-800">
                    <Banknote className="w-5 h-5 text-blue-700" />
                    Dados Bancários
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium text-gray-700">
                        Nome do Banco
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-medium text-gray-700">
                        Titular da Conta
                      </label>
                      <input
                        type="text"
                        name="accountHolder"
                        value={formData.accountHolder}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block font-medium text-gray-700">
                        IBAN
                      </label>
                      <input
                        type="text"
                        name="iban"
                        value={formData.iban}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-b border-gray-200 pb-8">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-800">
                    <Mail className="w-5 h-5 text-blue-700" />
                    Configurações de Email
                  </h2>
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      Email Atual (para verificação)
                    </label>
                    <input
                      type="email"
                      name="private_email"
                      value={formData.private_email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      Novo Email
                    </label>
                    <input
                      type="email"
                      name="newPrivate_email"
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                      
                    />
                  </div>
                </div>

                <div className="space-y-6 border-b border-gray-200 pb-8">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-800">
                    <MapPin className="w-5 h-5 text-blue-700" />
                    Informações de Contato
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium text-gray-700">
                        Endereço
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-medium text-gray-700">
                        Número de Telefone
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        maxLength={9}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-b border-gray-200 pb-8">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-800">
                    <MessageCircle />
                    Redes Sociais
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="font-medium text-gray-700 flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook
                      </label>
                      <input
                        type="url"
                        name="facebookLink"
                        value={formData.facebookLink}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                        placeholder="https://facebook.com/pagina"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium text-gray-700 flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-blue-600" />
                        Instagram
                      </label>
                      <input
                        type="url"
                        name="instagramLink"
                        value={formData.instagramLink}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                        placeholder="https://instagram.com/conta"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium text-gray-700 flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        name="linkedinLink"
                        value={formData.linkedinLink}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                        placeholder="https://linkedin.com/empresa"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <Link
                    href="/super-admin"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className={`px-6 py-3 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium rounded-md shadow-md transition-opacity flex items-center justify-center min-w-32 ${
                      !hasChanges || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                    }`}
                    disabled={!hasChanges || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}