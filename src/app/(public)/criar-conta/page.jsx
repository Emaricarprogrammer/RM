import { StudentForm } from "./form";

export default function RegisterStudentPage() {
  return (
    <div className="flex h-screen w-full bg-white">
      {/* Área do formulário */}
      <div className="flex flex-col h-full w-full lg:w-[60%] px-8 sm:px-10 justify-center items-center">
        <div className="flex flex-col items-center gap-5 w-full max-w-2xl">
          {/* Títulos */}
          <div className="flex flex-col text-center gap-1 w-full">
            <h1 className="font-medium text-2xl text-blue-900 uppercase">
              Academia Egaf
            </h1>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-blue-900">
              Criar nova conta
            </h2>
            <p className="text-gray-700 text-sm sm:text-base">
              Junte-se à nossa comunidade de aprendizado
            </p>
          </div>

          <StudentForm />
        </div>
      </div>

      {/* Área da imagem */}
      <div className="hidden relative lg:flex lg:items-center lg:justify-center h-full w-[40%] bg-gradient-to-br from-blue-900 to-blue-700 bg-no-repeat bg-cover bg-center bg-blend-overlay">
        <div className="text-white absolute top-24 px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Comece sua jornada conosco
          </h3>
          <p className="text-blue-100 text-lg">
            Acesse cursos exclusivos e dê o próximo passo na sua carreira
          </p>
        </div>

        <img
          src="/images/register.svg"
          alt="Tela de login de um telefone"
          className="size-[600px] mt-14"
        />
      </div>
    </div>
  );
}
