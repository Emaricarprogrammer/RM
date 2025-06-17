import Image from "next/image";
import {
  CheckCircle,
  Award,
  Briefcase,
  Users,
  Clock,
  BarChart2,
  Zap,
  Star,
} from "lucide-react";

export function BenefitsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Conteúdo de Texto */}
          <div>
            <span className="inline-flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
              <Award size={18} />
              Diferenciais EGAF
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Transforme sua carreira com a{" "}
              <span className="text-blue-600">metodologia EGAF</span>
            </h2>

            <p className="text-xl text-gray-600 mb-8">
              Nossa abordagem única combina teoria e prática para te preparar
              para os desafios reais do mercado.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Aprendizado Direcionado
                  </h3>
                  <p className="text-gray-600">
                    Cursos desenvolvidos com as habilidades mais demandadas pelo
                    mercado atual.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Briefcase className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Conexão com o Mercado
                  </h3>
                  <p className="text-gray-600">
                    Parcerias com empresas para oportunidades reais de emprego e
                    networking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Users className="text-indigo-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Comunidade Ativa
                  </h3>
                  <p className="text-gray-600">
                    Interação com colegas e mentores para acelerar seu
                    desenvolvimento.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Imagem Ilustrativa */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-8 border-white transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="aspect-[4/5] w-full relative">
              <Image
                src="/images/professional.jpg"
                alt="Profissional sorrindo no ambiente de trabalho"
                fill
                className="object-cover"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-gray-900/20"></div>

              {/* Overlay com estatística */}
              {/* <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BarChart2 className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nossos alunos têm</p>
                    <p className="text-2xl font-bold text-gray-900">
                      87% de empregabilidade
                    </p>
                    <p className="text-xs text-gray-500">
                      no primeiro ano após conclusão
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl text-center">
            <Clock className="mx-auto text-blue-600 mb-3" size={32} />
            <p className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              Flexível
            </p>
            <p className="text-gray-600 text-sm">Aprenda no seu ritmo</p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl text-center">
            <Zap className="mx-auto text-indigo-600 mb-3" size={32} />
            <p className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              Metodologia
            </p>
            <p className="text-gray-600 text-sm">Comprovada e eficaz</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl text-center">
            <Briefcase className="mx-auto text-purple-600 mb-3" size={32} />
            <p className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              Prático
            </p>
            <p className="text-gray-600 text-sm">Foco no mercado real</p>
          </div>

          <div className="bg-emerald-50 p-6 rounded-xl text-center">
            <Star className="mx-auto text-emerald-600 mb-3" size={32} />
            <p className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              Destaque-se
            </p>
            <p className="text-gray-600 text-sm">Com habilidades relevantes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
