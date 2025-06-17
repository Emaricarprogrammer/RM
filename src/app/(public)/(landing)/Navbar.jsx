"use client";

import { AlignJustify, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/_components/Loading";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const accessToken = localStorage.getItem('access');
        if (!accessToken) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }

        const decodedToken = jwtDecode(accessToken);
        
        if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
          setIsLoggedIn(false);
          localStorage.removeItem('access');
          setIsLoading(false);
          return;
        }

        setIsLoggedIn(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsLoggedIn(false);
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
    try {
      localStorage.removeItem("access");
      setIsLoggedIn(false);
        router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/");
    }
  };

  const links = [{ path: "/cursos", label: "Cursos" }];

  const authLinks = !isLoggedIn ? [
    { path: "/login", label: "Entrar" },
    { path: "/criar-conta", label: "Criar Conta" },
  ] : [];

  const userLinks = isLoggedIn ? [
    { path: "/home", label: "Perfil" },
    { path: "/", label: "Sair" },
  ] : [];

  return (
    <>      
      <header
        className={`fixed w-full top-0 z-40 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        {/* Restante do código permanece igual */}
        <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-8">
          <Link
            href="/"
            className={`text-2xl font-bold ${
              isScrolled
                ? "bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent"
                : "text-white"
            }`}
          >
            ACADEMIA EGAF
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${
                  isScrolled ? "text-black" : "text-white"
                } hover:text-blue-500 transition-colors`}
              >
                {link.label}
              </Link>
            ))}

            {userLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${
                  isScrolled ? "text-black" : "text-white"
                } hover:text-blue-500 transition-colors`}
                onClick={link.label === "Sair" ? handleLogout : undefined}
              >
                {link.label}
              </Link>
            ))}

            {authLinks.length > 0 && (
              <div className="flex gap-2 ml-2">
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-4 py-2 rounded-md ${
                      link.label === "Entrar"
                        ? `${
                            isScrolled
                              ? "text-blue-700 hover:bg-blue-50"
                              : "text-white hover:text-blue-300"
                          }`
                        : "bg-blue-700 text-white hover:bg-blue-600"
                    } transition-colors`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Botão Mobile */}
          <button
            className="md:hidden text-2xl z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <AlignJustify
              size={24}
              className={isScrolled ? "text-black" : "text-white"}
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

            <div className="p-6 pt-20 space-y-8 h-full overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-sm uppercase text-gray-500">Navegação</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link
                        href={link.path}
                        className="block py-3 text-lg text-gray-800 hover:text-blue-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm uppercase text-gray-500">
                  {isLoggedIn ? "Minha Conta" : "Autenticação"}
                </h3>
                <ul className="space-y-2">
                  {(isLoggedIn ? userLinks : authLinks).map((link) => (
                    <li key={link.path}>
                      <Link
                        href={link.path}
                        className="block py-3 text-lg text-gray-800 hover:text-blue-600 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (link.label === "Sair") {
                            handleLogout();
                          }
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}