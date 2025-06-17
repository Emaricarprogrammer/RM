import { api } from "@/api/api";

export async function MyInstructors(id_student, accessToken) {
  if (!id_student || !accessToken) {
    console.log("ID do estudante e token são obrigatórios");
  }

  try {
    const response = await api.get(`/users/students/myInstructors/${id_student}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response || !response.data) {
      console.error("Resposta inválida da API:", response);
      return [];
    }
    if (response.data.success > 200)
    {
        console.error("Erro na resposta da API:", response.data);
        return [];
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }

  } catch (error)
  {
    console.error("Erro ao buscar instrutores:", error);
    return []
  }
}
