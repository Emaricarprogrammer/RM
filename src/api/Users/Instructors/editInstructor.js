import { api } from "@/api/api";

async function EditInstructor(id_instructor, formData, token) {
  try {
    const response = await api.patch(`/users/instructors/profile/edit/${id_instructor}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data
  } catch (error) {
    console.error("Erro ao editar curso:", error);
    return { success: false, error: error.message || "Erro desconhecido ao editar curso" };
  }
}

export {EditInstructor}