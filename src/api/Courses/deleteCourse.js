import { api } from "../api";

async function deleteCourse(id_course, token) {
  try {
    const response = await api.delete(`courses/${id_course}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data
  } catch (error) {
    console.error("Erro ao deletar curso:", error);
    return { success: false, message: error.response?.data?.message || "Erro desconhecido ao deletar curso." };
  }
}

export { deleteCourse };