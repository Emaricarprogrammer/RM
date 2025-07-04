"use client";

import {
  Banknote,
  Mail,
  MessageCircle,
  User,
  Save,
  X,
  ShieldAlert,
  CheckCircle,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/app/_components/Footer";
import { Navbar } from "@/app/_components/Navbar";

export default function SystemSettingsPage() {
  // Estado das configurações
  const [settings, setSettings] = useState({
    bankName: "BFA - Banco de Fomento Angola",
    accountHolder: "Egaf Oil & Gás, Lda",
    iban: "0006 0000 1248 5137 3016 0",
    paymentEmail: "geral@academiaegaf.com",
    superAdminUsername: "super-admin",
    superAdminPassword: "",
    address:
      "Rua Av. 21 de Janeiro, Edifício Sky Bar, Bairro Morro Bento (Luanda)",
    phoneNumber: "945 489 267",
    facebookLink: "",
    instagramLink: "",
    linkedinLink: "",
  });

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowOtpModal(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setOtpError("");

    // Simular verificação do OTP (na prática, você validaria com o backend)
    if (otp === "123456") {
      // Código fixo para demonstração
      setIsSubmitting(true);

      setTimeout(() => {
        console.log("Configurações salvas:", settings);
        setIsSubmitting(false);
        setIsSaved(true);
        setShowOtpModal(false);
        setTimeout(() => setIsSaved(false), 3000);
      }, 1000);
    } else {
      setOtpError("Código OTP inválido. Tente novamente.");
    }
  };

  const sendOtp = () => {
    // Simular envio de OTP para o email
    console.log(`OTP enviado para: ${settings.paymentEmail}`);
    alert(`Código OTP enviado para ${settings.paymentEmail}\n\nUse: 123456`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col">
      <Navbar />

      {/* Modal de Confirmação OTP */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-700" />
                Verificação de Segurança
              </h3>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Enviamos um código de 6 dígitos para{" "}
              <strong>{settings.paymentEmail}</strong>. Insira o código abaixo
              para confirmar as alterações.
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
                />
                {otpError && (
                  <p className="text-red-500 text-sm mt-1">{otpError}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={sendOtp}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Reenviar código
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  Verificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 py-8">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-8 py-6 text-white">
              <h1 className="mt-3 text-2xl font-bold uppercase">
                Configurações do Sistema
              </h1>
              <p className="text-blue-100 mt-4 text-lg">
                Gerencie as configurações bancárias, de email, contato e redes
                sociais
              </p>
            </div>

            {/* Corpo do formulário */}
            <div className="p-6 sm:p-8 xl:px-16 2xl:px-32 lg:pt-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Seção de Dados Bancários */}
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
                        value={settings.bankName}
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
                        value={settings.accountHolder}
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
                        value={settings.iban}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seção de Email */}
                <div className="space-y-6 border-b border-gray-200 pb-8">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-800">
                    <Mail className="w-5 h-5 text-blue-700" />
                    Configurações de Email
                  </h2>

                  <div className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      Email para Comprovativos
                    </label>
                    <input
                      type="email"
                      name="paymentEmail"
                      value={settings.paymentEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Seção de Contato */}
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
                        value={settings.address}
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
                        value={settings.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seção Redes Sociais */}
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
                        value={settings.facebookLink}
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
                        value={settings.instagramLink}
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
                        value={settings.linkedinLink}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-800 transition-all outline-none"
                        placeholder="https://linkedin.com/empresa"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção Super Admin */}
                <div className="space-y-6">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-800">
                    <User className="w-5 h-5 text-blue-700" />
                    Conta Super Admin
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-medium text-gray-700">
                        Nome de Usuário
                      </label>
                      <input
                        type="text"
                        name="superAdminUsername"
                        value={settings.superAdminUsername}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-100 text-black text-opacity-55 cursor-not-allowed"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        O nome de usuário do super admin não pode ser alterado
                      </p>
                    </div>

                    
                  </div>
                </div>

                {/* Botões de ação */}
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
                    className="px-6 py-3 bg-gradient-to-br from-blue-900 to-blue-700 text-white font-medium rounded-md shadow-md hover:opacity-90 transition-opacity flex items-center justify-center min-w-32"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Alterações
                  </button>
                </div>

                {isSaved && (
                  <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md text-sm flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Configurações salvas com sucesso!
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
