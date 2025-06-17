export async function getInstructorData(id) {
  try {
    console.log(`Buscando dados do formador com ID (mocados): ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simula delay de rede

    // Dados mocados - substituir por chamada real ao backend
    if (id === "1") {
      return {
        id: "1",
        name: "Maria Souza",
        bio: "Engenheira de software com 8 anos de experiência em desenvolvimento front-end. Especialista em React e arquitetura de aplicações escaláveis. Já trabalhou em empresas como Netflix e Uber. Atualmente dedica-se ao ensino online, compartilhando conhecimento com milhares de alunos em toda a lusofonia. Participou de conferências internacionais como ReactConf e JSWorld.",
        image_url: "https://randomuser.me/api/portraits/women/44.jpg",
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Erro ao buscar dados do formador com ID ${id}:`, error);
    throw error;
  }
}

export async function updateInstructorData(id, data) {
  try {
    console.log(`Atualizando formador ID ${id} com dados:`, data);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay de rede

    // Simulação de sucesso - substituir por chamada real ao backend
    return {
      success: true,
      message: "Formador atualizado com sucesso",
      data: {
        id,
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error(`Erro ao atualizar formador com ID ${id}:`, error);
    throw error;
  }
}
