import { Mail, Phone, Map } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex flex-col w-full bg-gradient-to-br from-blue-900 to-blue-800 px-8 md:px-28 pt-16 pb-6 gap-8">
      {/* Conteúdo principal em grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Bloco 1 - Academia Egaf */}
        <div className="flex flex-col gap-4 order-1">
          <h1 className="text-white text-4xl font-medium uppercase">
            Academia Egaf
          </h1>
          <p className="text-neutral-300 text-sm md:text-base font-medium">
            Capacitação que impulsiona sua jornada para o sucesso.
          </p>
        </div>

        {/* Bloco 2 - Links */}
        <div className="flex flex-col gap-4 order-3 md:order-2">
          <h1 className="text-2xl font-medium text-white">Links</h1>
          <div className="flex gap-5 items-center">
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-10 p-1 bg-white rounded-full text-blue-900"
              >
                <path
                  fill="currentColor"
                  d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"
                />
              </svg>
            </a>
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-10 p-1 bg-white rounded-full text-blue-900"
              >
                <path
                  fill="currentColor"
                  d="M20.947 8.305a6.53 6.53 0 0 0-.419-2.216 4.61 4.61 0 0 0-2.633-2.633 6.606 6.606 0 0 0-2.186-.42c-.962-.043-1.267-.055-3.709-.055s-2.755 0-3.71.055a6.606 6.606 0 0 0-2.185.42 4.607 4.607 0 0 0-2.633 2.633 6.554 6.554 0 0 0-.419 2.185c-.043.963-.056 1.268-.056 3.71s0 2.754.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.043 1.268.056 3.71.056s2.755 0 3.71-.056a6.59 6.59 0 0 0 2.186-.419 4.615 4.615 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.187.043-.962.056-1.267.056-3.71-.002-2.442-.002-2.752-.058-3.709zm-8.953 8.297c-2.554 0-4.623-2.069-4.623-4.623s2.069-4.623 4.623-4.623a4.623 4.623 0 0 1 0 9.246zm4.807-8.339a1.077 1.077 0 0 1-1.078-1.078 1.077 1.077 0 1 1 2.155 0c0 .596-.482 1.078-1.077 1.078z"
                />
                <circle fill="currentColor" cx="11.994" cy="11.979" r="3.003" />
              </svg>
            </a>
            <a href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-10 p-1 bg-white rounded-full text-blue-900"
              >
                <circle fill="currentColor" cx="4.983" cy="5.009" r="2.188" />
                <path
                  fill="currentColor"
                  d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118 1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Bloco 3 - Contactos */}
        <div className="flex flex-col gap-5 text-white order-2 md:order-3">
          <h1 className="text-2xl font-medium">Contactos</h1>
          <div className="flex flex-col gap-5 text-sm md:text-base">
            <p className="flex gap-3 items-center">
              <Map className="size-6" />
              <span>
                Rua Av. 21 de Janeiro, Edifício Sky Bar, Bairro Morro Bento
                (Luanda)
              </span>
            </p>
            <p className="flex gap-3 items-center">
              <Mail className="size-6" />
              <span>geral@academiaegaf.com</span>
            </p>
            <p className="flex gap-3 items-center">
              <Phone className="size-6" />
              <span>(+244) 945 489 267</span>
            </p>
          </div>
        </div>
      </div>

      {/* Rodapé sempre embaixo */}
      <div className="flex flex-col gap-6 w-full">
        <div className="border-t border-gray-400 w-full"></div>
        <div className="text-center text-zinc-300 text-lg">
          Academia Egaf - 2025 © Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
