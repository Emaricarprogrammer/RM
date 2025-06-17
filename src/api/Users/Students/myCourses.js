import { api } from "@/api/api";

async function MyCourses(id_student, accessToken) {
  try {
    // Verificação dos parâmetros
    if (!id_student || !accessToken) {
      throw new Error("ID do estudante ou token de acesso não fornecido");
    }

    const result = await api.get(`/users/students/myCourses/${id_student}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!result || !result.data) {
      console.error("Resposta inválida da API:", result);
      return [];
    }
    if (result.data.success > 200) {
      console.error("Erro na resposta da API:", result.data);
      return [];
    }
    if (Array.isArray(result.data.response)) {
      return result.data.response;
    }
    console.error("Formato de resposta inesperado:", result.data);

  } catch (error) {
    console.error("Erro ao buscar cursos do estudante:", error);
    return [];
}
}
export { MyCourses };