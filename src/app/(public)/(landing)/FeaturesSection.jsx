import { BookOpen, MonitorPlay, Users, MapPin } from "lucide-react";
import React from "react";

export function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen />,
      title: "Cursos Especializados",
      description:
        "Conteúdos cuidadosamente selecionados para seu crescimento profissional.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: <MonitorPlay />,
      title: "Aulas Online",
      description: "Videoaulas disponíveis quando e onde você precisar.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: <Users />,
      title: "Aprendizado Contínuo",
      description:
        "Atualizações constantes com as melhores práticas do mercado.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: <MapPin />,
      title: "Aulas Presenciais",
      description:
        "Experiências práticas em ambientes dedicados ao aprendizado.",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <section id="recursos" className="py-24 bg-white">
      <div className="mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-8xl">
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            Por que escolher a EGAF?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Educação que <span className="text-blue-600">transforma</span>
          </h2>
          <p className="text-xl text-gray-600">
            Uma abordagem moderna para desenvolver suas habilidades
            profissionais.
          </p>
        </div>

        {/* Grid de Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
            >
              {/* Faixa colorida no topo */}
              <div
                className={`${feature.color.replace("text", "bg")} h-2 w-full`}
              ></div>

              <div className="p-8 flex-1 flex flex-col">
                {/* Container do ícone simplificado */}
                <div className={`mb-6 p-3 ${feature.bgColor} rounded-lg w-fit`}>
                  {React.cloneElement(feature.icon, {
                    className: `${feature.color} w-8 h-8`,
                  })}
                </div>

                {/* Conteúdo do card */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
