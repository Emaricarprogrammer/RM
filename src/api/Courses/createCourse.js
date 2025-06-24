import { api } from "../api";

async function CreateCourse(courseData, accessToken) {
  try {
    const result = await api.post(
      "/courses/create_course",
      courseData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return result.data;
  } catch (error) {
    console.error("Error creating course:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Erro desconhecido ao criar curso." 
    };
  }
}

export { CreateCourse };