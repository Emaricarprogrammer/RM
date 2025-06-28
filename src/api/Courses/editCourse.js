import { api } from "../api";


async function EditCourse(id_course, formData, token) {
  try {
    const response = await api.patch(`/courses/edit/${id_course}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, error: response.data.message || "Erro ao editar curso" };
    }
  } catch (error) {
    console.error("Erro ao editar curso:", error);
    return { success: false, error: error.message || "Erro desconhecido ao editar curso" };
  }
}

export {EditCourse}