export async function submitCourseData(data) {
  try {
    console.log("Enviando dados do curso:", data);
    // Simulando uma chamada API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar dados do curso:", error);
    throw error;
  }
}

// Funções auxiliares permanecem as mesmas
export function fetchCategories() {
  return [
    { id: "1", name: "Programação" },
    { id: "2", name: "Design" },
    { id: "3", name: "Marketing Digital" },
    { id: "4", name: "Negócios" },
  ];
}

export function fetchInstructors() {
  return [
    { id: "1", name: "João Silva" },
    { id: "2", name: "Maria Santos" },
    { id: "3", name: "Carlos Oliveira" },
  ];
}
