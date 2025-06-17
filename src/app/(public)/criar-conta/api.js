export async function submitStudentData(data) {
  try {
    console.log("Enviando dados do aluno:", data);
    // Simulando uma chamada API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar dados do aluno:", error);
    throw error;
  }
}
