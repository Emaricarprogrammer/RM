import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full h-[95vh] min-h-[740px] flex justify-center items-center bg-zinc-500 bg-hero bg-cover bg-no-repeat bg-center bg-blend-multiply">
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center justify-center gap-8 text-center pt-28">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight">
            Transforme seu futuro com a{" "}
            <span className="text-blue-300">Academia EGAF</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
            Cursos online e presenciais que combinam com seu estilo de vida.
            Aprenda no seu ritmo, com especialistas e uma comunidade que apoia
            seu crescimento.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link
            href="/criar-conta"
            className="px-8 py-4 bg-blue-700 hover:bg-blue-800 rounded-lg shadow-lg text-white font-medium text-lg flex items-center justify-center gap-2 transition-all"
          >
            Comece Agora <ArrowRight size={20} />
          </Link>

          <Link
            href="/cursos"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg shadow-lg text-white font-medium text-lg border border-white/30 transition-all"
          >
            Explorar Cursos
          </Link>
        </div>
      </div>

      {/* <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-14 rounded-3xl border-4 border-white/80 flex justify-center p-1">
          <div className="w-2 h-2 rounded-full bg-white/80 mt-1 animate-scroll"></div>
        </div>
      </div> */}
    </section>
  );
}
