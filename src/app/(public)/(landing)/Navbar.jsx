"use client";

import { AlignJustify, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/_components/Loading";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        const decodedToken = jwtDecode(accessToken);
        setUserType(decodedToken.userClaims?.userType?.toLowerCase());
        setIsLoading(false);
        
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        localStorage.removeItem('access');
        setIsLoading(false);
      }
    };

    checkAuth();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Links para Admin
  const adminLinks = [
    { path: "/admin", label: "Dashboard" },
    { 
      path: "/cursos", 
      label: "Cursos", 
      subLinks: [
        { path: "/admin/categorias", label: "Gerenciar categorias" },
        { path: "/admin/adicionar-curso", label: "Adicionar Curso" }
      ]
    },
    { 
      path: "#", 
      label: "Formadores", 
      subLinks: [
        { path: "/admin/formadores", label: "Lista de Formadores" },
        { path: "/admin/adicionar-formador", label: "Adicionar Formador" }
      ]
    },
    { path: "/admin/pagamentos", label: "Pagamentos" },
  ];

  // Links para SUPER_ADMIN
  const superAdminLinks = [
    { path: "/super-admin", label: "Dashboard" },
    { 
      path: "#", 
      label: "Configurações", 
      subLinks: [
        { path: "/super-admin/configuracoes-sistema", label: "Configurações do Sistema" },
      ]
    },
  ];

  // Links para Estudante
  const studentLinks = [
    { path: "/home", label: "Perfil" },
    { path: "/cursos", label: "Cursos" },
  ];

  // Links comuns (quando não logado)
  const publicLinks = [
    { path: "/", label: "Início" },
    { path: "/cursos", label: "Cursos" },
  ];

  // Links de autenticação
  const authLinks = !userType ? [
    { path: "/login", label: "Entrar" },
    { path: "/criar-conta", label: "Criar Conta", isButton: true },
  ] : [
    { label: "Sair", onClick: handleLogout, isButton: true }
  ];

  if (isLoading) {
    return <Loading message="Seja bem-vindo a Academia Egaf..."/>;
  }

  if (isLoggingOut) {
    return <Loading message="Agradecemos a sua visita 😉, volte sempre..." />;
  }

  // Define os links principais baseados no tipo de usuário
  const mainLinks = userType === 'super_admin' 
    ? superAdminLinks 
    : userType === 'admin' 
      ? adminLinks 
      : userType === 'student' 
        ? studentLinks 
        : publicLinks;

  return (
    <>      
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
      >
        <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-8">
          <Link
            href={userType 
              ? userType === 'super_admin' ? "/super-admin" 
                : userType === 'admin' ? "/admin" 
                : "/home" 
              : "/"}
            className={`text-2xl font-bold ${
              isScrolled
                ? "bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent"
                : "text-white"
            }`}
          >
            ACADEMIA EGAF
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {/* Links Principais */}
            {mainLinks.map((link) => (
              <div key={link.path} className="relative group">
                <div className="flex items-center gap-1">
                  <Link
                    href={link.path}
                    className={`${
                      isScrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-300"
                    } transition-colors`}
                  >
                    {link.label}
                  </Link>
                  {link.subLinks && (
                    <ChevronDown 
                      size={16} 
                      className={`${
                        isScrolled ? "text-gray-500" : "text-white"
                      } group-hover:rotate-180 transition-transform`} 
                    />
                  )}
                </div>

                {link.subLinks && (
                  <div className={`absolute left-0 top-full mt-1 rounded-md min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                    isScrolled ? "bg-white shadow-lg border" : "bg-gray-800/95 backdrop-blur-sm"
                  }`}
                  >
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={subLink.path}
                        href={subLink.path}
                        className={`block px-4 py-2 text-sm ${
                          isScrolled 
                            ? "text-gray-700 hover:bg-gray-50" 
                            : "text-white hover:bg-gray-700/50"
                        }`}
                      >
                        {subLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Links de Autenticação */}
            <div className="flex gap-2 ml-4">
              {authLinks.map((link, index) => (
                link.isButton ? (
                  <button
                    key={index}
                    onClick={link.onClick}
                    className={`px-4 py-2 rounded-md ${
                      isScrolled
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-600 text-white hover:bg-gray-100"
                    } transition-colors`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-4 py-2 rounded-md ${
                      isScrolled
                        ? "text-gray-700 hover:text-blue-600"
                        : "text-white hover:text-blue-300"
                    } transition-colors`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Botão Mobile */}
          <button
            className="md:hidden text-2xl z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <AlignJustify
              size={24}
              className={isScrolled ? "text-gray-700" : "text-white"}
            />
          </button>
        </div>
      </header>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-xl animate-slide-in">
            <button
              className="absolute top-6 right-6 z-50 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={24} className="text-gray-800" />
            </button>

            <div className="p-6 pt-20 space-y-6 h-full overflow-y-auto">
              {/* Links Principais */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase text-gray-500">
                  {userType === 'super_admin' ? 'Super Administração' : 
                   userType === 'admin' ? 'Administração' : 
                   userType === 'student' ? 'Meu Espaço' : 'Navegação'}
                </h3>
                <ul className="space-y-2">
                  {mainLinks.map((link) => (
                    <li key={link.path}>
                      {link.subLinks ? (
                        <div className="space-y-2">
                          <div className="font-medium text-gray-800 py-2 border-b">
                            {link.label}
                          </div>
                          <ul className="ml-4 space-y-2">
                            {link.subLinks.map((subLink) => (
                              <li key={subLink.path}>
                                <Link
                                  href={subLink.path}
                                  className="block py-2 text-gray-600 hover:text-blue-600 pl-2"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {subLink.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <Link
                          href={link.path}
                          className="block py-2 text-gray-800 hover:text-blue-600 border-b"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Links de Autenticação */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase text-gray-500">Conta</h3>
                <div className="space-y-2">
                  {authLinks.map((link, index) => (
                    link.isButton ? (
                      <button
                        key={index}
                        onClick={() => {
                          link.onClick?.();
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        key={link.path}
                        href={link.path}
                        className="block py-2 text-gray-800 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}