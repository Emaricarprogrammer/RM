export async function submitInstructorData(data) {
  try {
    console.log("Enviando dados do formador:", data);
    // Simulando uma chamada API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar dados do formador:", error);
    throw error;
  }
}
