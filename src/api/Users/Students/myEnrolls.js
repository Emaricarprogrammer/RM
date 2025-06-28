import { api } from "@/api/api";

export async function MyEnrolls(id_student, accessToken) {

  try {
    const response = await api.get(`/users/students/my_enrolls/${id_student}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data
  } catch (error)
  {
    console.error("Erro ao buscar instrutores:", error);
    return []
  }
}
