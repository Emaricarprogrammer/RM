import { api } from "@/api/api";
async function deleteInstructor(id_instructor, token) {
  try {
    const response = await api.delete(`/users/instructors/delete/account/${id_instructor}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Erro desconhecido ao deletar instructor." };
  }
}

export { deleteInstructor };