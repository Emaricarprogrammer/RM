"use client";

import { AlignJustify, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Loading } from "./Loading";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Verificação segura do token e normalização do userType
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  let userType = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userType = decodedToken.userClaims?.userType?.toLowerCase() || null;
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("access");
    }
  }

  const handleLogout = () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("access");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/");
    }
  };

  // Links públicos (apenas quando não logado)
  const publicLinks = [
    { path: "/", label: "Início" },
    { path: "/cursos", label: "Cursos" },
  ];

  // Links privados por tipo de usuário (com userType em minúsculo)
  const privateLinks = {
    admin: [
      { path: "/admin", label: "Dashboard" },
      {
        path: "/cursos",
        label: "Cursos",
        subRoutes: [
          { path: "/admin/adicionar-curso", label: "Adicionar curso" },
          { path: "/admin/categorias", label: "Categorias" },
        ],
      },
      { path: "/admin/formadores", label: "Formadores" },
      { path: "/admin/pagamentos", label: "Pagamentos" },
    ],
    student: [
      { path: "/home", label: "Perfil" },
      { path: "/cursos", label: "Cursos" },
    ],
    super_admin: [
      { path: "/", label: "Inicio" },
      { path: "/super-admin", label: "Dashboard" },
      { 
      path: "/super-admin/configuracoes-sistema", 
      label: "Configurações", 
      subLinks: [
        { path: "/super-admin/configuracoes-sistema", label: "Configurações do Sistema" },
      ]
    }
    ],
  };

  // Links de autenticação (quando não logado)
  const authLinks = [
    { path: "/login", label: "Entrar" },
    { path: "/criar-conta", label: "Criar Conta" },
  ];

  // Links de conta (quando logado)
  const accountLinks = [
    { 
      label: "Sair", 
      onClick: (e) => {
        e.preventDefault();
        handleLogout();
      } 
    }
  ];

  const toggleDropdown = (path) => {
    setOpenDropdown(openDropdown === path ? null : path);
  };

  // Classe CSS reutilizável para o efeito de hover
  const hoverGradientClass = "hover:text-blue-700 transition-colors duration-200";

  if (isLoggingOut) {
    return <Loading message="Volte sempre, 😉!..." />;
  }

  // Obter links do usuário atual de forma segura
  const currentUserLinks = userType ? privateLinks[userType] || [] : [];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-8">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent"
          >
            ACADEMIA EGAF
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {/* Links Públicos (apenas se não logado) */}
            {!userType && publicLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-black ${hoverGradientClass}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Links Privados (se logado) */}
            {currentUserLinks.map((link) => (
              <div
                key={link.path}
                className="relative group"
                onMouseEnter={() => setHoveredItem(link.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex items-center gap-1">
                  <Link
                    href={link.path}
                    className={`text-black ${hoverGradientClass}`}
                  >
                    {link.label}
                  </Link>
                  {link.subRoutes && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${hoverGradientClass} ${
                        hoveredItem === link.path ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {link.subRoutes && (
                  <div
                    className={`absolute left-0 bg-white shadow-lg rounded-md mt-2 min-w-[200px] transition-all duration-200 ${
                      hoveredItem === link.path
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1"
                    }`}
                  >
                    {link.subRoutes.map((subRoute) => (
                      <Link
                        key={subRoute.path}
                        href={subRoute.path}
                        className={`block px-4 py-2 text-sm ${hoverGradientClass}`}
                      >
                        {subRoute.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Links de Conta/Autenticação */}
            {(userType ? accountLinks : authLinks).map((link, index) => (
              link.onClick ? (
                <button
                  key={index}
                  onClick={link.onClick}
                  className={`text-black ${hoverGradientClass}`}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-black ${hoverGradientClass}`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <AlignJustify size={24} />}
          </button>
        </div>
      </header>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="md:hidden fixed z-50 top-20 right-0 h-[calc(100vh-5rem)] w-64 bg-white shadow-xl animate-slide-in overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Links Públicos */}
              {!userType && (
                <div className="space-y-4">
                  <h3 className="text-sm uppercase text-gray-500">Navegação</h3>
                  <ul className="space-y-3">
                    {publicLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          href={link.path}
                          className={`block py-3 text-lg text-black ${hoverGradientClass}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links Privados */}
              {userType && (
                <div className="space-y-4">
                  <h3 className="text-sm uppercase text-gray-500">
                    {userType === "admin" ? "Administração" : "Meu Espaço"}
                  </h3>
                  <ul className="space-y-3">
                    {currentUserLinks.map((link) => (
                      <li key={link.path}>
                        {link.subRoutes ? (
                          <>
                            <button
                              onClick={() => toggleDropdown(link.path)}
                              className={`flex justify-between items-center w-full py-2 ${hoverGradientClass}`}
                            >
                              <span className="text-lg">{link.label}</span>
                              {openDropdown === link.path ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>
                            {openDropdown === link.path && (
                              <ul className="ml-4 mt-2 space-y-2">
                                {link.subRoutes.map((subRoute) => (
                                  <li key={subRoute.path}>
                                    <Link
                                      href={subRoute.path}
                                      className={`block py-2 pl-2 ${hoverGradientClass}`}
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {subRoute.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link
                            href={link.path}
                            className={`block py-3 text-lg ${hoverGradientClass}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links de Conta */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase text-gray-500">Conta</h3>
                <ul className="space-y-3">
                  {(userType ? accountLinks : authLinks).map((link, index) => (
                    <li key={link.path || index}>
                      {link.onClick ? (
                        <button
                          onClick={link.onClick}
                          className={`block py-3 text-lg w-full text-left ${hoverGradientClass}`}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          href={link.path}
                          className={`block py-3 text-lg ${hoverGradientClass}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}