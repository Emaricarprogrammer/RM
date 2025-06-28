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
    return response.data.response

  } catch (error)
  {
    console.error("Erro ao buscar instrutores:", error);
    return []
  }
}
