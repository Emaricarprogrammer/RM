// app/(private)/admin/editar-video/api.js

// Simulação - substituir por chamadas reais
export async function fetchVideoToEdit(courseId, videoId) {
  return {
    id: videoId,
    title: "Introdução ao React Hooks",
    description: "Aprenda os conceitos básicos de React Hooks",
    video_url: "/videos/intro-hooks.mp4",
    course: {
      id: courseId,
      title: "Curso de React Avançado",
      description: "Aprenda React do básico ao avançado",
    },
  };
}

export async function updateVideoData(videoId, formData) {
  console.log("Atualizando vídeo:", videoId, formData);

  // Simulando delay de rede
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Vídeo atualizado com sucesso!",
  };
}
