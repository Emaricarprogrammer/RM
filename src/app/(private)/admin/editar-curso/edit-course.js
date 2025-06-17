export async function updateCourseData(data) {
  try {
    console.log("Enviando dados do curso para atualização:", data);
    // Simula uma chamada API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao atualizar dados do curso:", error);
    throw error;
  }
}
