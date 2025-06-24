"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { MyInstructors } from "@/api/Users/Students/myInstructors";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export function InstructorsCarousel() {
  // Constants
  const CARD_WIDTH_MOBILE = 220;
  const CARD_WIDTH_DESKTOP = 320;
  const DESKTOP_BREAKPOINT = 768;
  const SCROLL_BUTTON_OFFSET_MOBILE = 3;
  const SCROLL_BUTTON_OFFSET_DESKTOP = 6;
  const router = useRouter();

  const carouselRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
       const token = localStorage.getItem('access');
        
        if (!token) {
          router.push('/login');
          return;
        }

        // 2. Decodificar o token para obter o id_student
        const decodedToken = jwtDecode(token);
        const id_student = decodedToken.userClaims.id_student;

        if (!id_student) {
          router.push('/login');
          return;
        }

        setLoading(true);
        const data = await MyInstructors(id_student, token);
        
        // Verifica se a resposta é um array ou se está no formato { response: [] }
        const instructorsData = Array.isArray(data) ? data : (data || []);
        setInstructors(instructorsData);
      } catch (err) {
        console.error("Erro ao buscar instrutores:", err);
        setError("Não foi possível carregar os instrutores.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardWidth = isDesktop ? CARD_WIDTH_DESKTOP : CARD_WIDTH_MOBILE;

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  // Estados de carregamento, erro e vazio
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (instructors.length === 0)
  {
    return "";
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
      <h1 className="text-xl md:text-2xl text-center lg:text-left font-semibold text-gray-800 mb-4 md:mb-6">
        Formadores dos cursos que assiste
      </h1>

      <div className="relative">
        <ScrollButton 
          direction="left" 
          isDesktop={isDesktop} 
          onClick={scrollLeft} 
          offsetMobile={SCROLL_BUTTON_OFFSET_MOBILE} 
          offsetDesktop={SCROLL_BUTTON_OFFSET_DESKTOP} 
        />

        <div
          ref={carouselRef}
          className="flex space-x-8 overflow-x-auto scrollbar-hide px-2 md:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id_instructor} instructor={instructor} />
          ))}
        </div>

        <ScrollButton 
          direction="right" 
          isDesktop={isDesktop} 
          onClick={scrollRight} 
          offsetMobile={SCROLL_BUTTON_OFFSET_MOBILE} 
          offsetDesktop={SCROLL_BUTTON_OFFSET_DESKTOP} 
        />
      </div>
    </div>
  );
}

// Componentes auxiliares
function LoadingState() {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
      <h1 className="text-xl md:text-2xl text-center lg:text-left font-semibold text-gray-800 mb-4 md:mb-6">
        Formadores dos cursos que assiste
      </h1>
      <div className="flex justify-center items-center h-40">
        <p>Carregando instrutores...</p>
      </div>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
      <h1 className="text-xl md:text-2xl text-center lg:text-left font-semibold text-gray-800 mb-4 md:mb-6">
        Formadores dos cursos que assiste
      </h1>
      <div className="flex justify-center items-center h-40">
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
      <h1 className="text-xl md:text-2xl text-center lg:text-left font-semibold text-gray-800 mb-4 md:mb-6">
        Especialista em cursos que você assiste
      </h1>

      <div className="col-span-full text-center py-10 space-y-4">
        <p className="text-gray-500">
          Você ainda não aprendendo com nenhum dos nosso instrutores.
          </p>
        <div className="flex justify-center">
          <Link href={"/cursos"}>
            <button className="py-3 px-6 bg-gradient-to-br from-blue-900 to-blue-700 hover:opacity-90 transition-opacity text-white rounded shadow font-medium">
                Pesquisar por outros cursos
              </button>
            </Link>
            </div>
            </div>
    </div>
  );
}

function ScrollButton({ direction, isDesktop, onClick, offsetMobile, offsetDesktop }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const offsetClass = isDesktop 
    ? (direction === 'left' ? `-translate-x-${offsetDesktop}` : `translate-x-${offsetDesktop}`)
    : (direction === 'left' ? `-translate-x-${offsetMobile}` : `translate-x-${offsetMobile}`);

  return (
    <button
      onClick={onClick}
      className={`absolute ${direction}-0 top-1/2 transform -translate-y-1/2 ${offsetClass} z-10 bg-white rounded-full p-1 md:p-2 shadow-lg hover:bg-gray-50 transition-all`}
      aria-label={`Scroll ${direction}`}
    >
      <Icon className="text-gray-600 w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}

function InstructorCard({ instructor }) {
  return (
    <div className="mb-4 flex-shrink-0 w-64 md:w-80 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="p-4 flex flex-col">
        <div className="flex items-center mb-4">
          <img
            src={instructor.profile_image || "https://randomuser.me/api/portraits/men/32.jpg"}
            alt={instructor.full_name}
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="text-base font-semibold bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent">
              {instructor.full_name}
            </h3>
            <p className="text-xs text-gray-500">
              Especialista em cursos que você assiste
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {instructor.biography || "Biografia não disponível"}
        </p>

        <Link
          href={`/perfil-formador?id=${instructor.id_instructor}`}
          className="text-sm bg-gradient-to-br from-blue-900 to-blue-700 bg-clip-text text-transparent font-medium"
        >
          Ver perfil completo →
        </Link>
      </div>
    </div>
  );
}