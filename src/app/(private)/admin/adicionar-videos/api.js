export async function fetchCourseDetails(courseId) {
  // Simulação de busca de dados do curso
  return {
    id: courseId,
    title: "Introdução ao React Avançado",
    description: "Aprenda os conceitos avançados de React e hooks",
    duration: 20,
    instructor: "João Silva",
  };
}

export async function submitVideos(data) {
  try {
    console.log("Enviando vídeos:", data);

    // Criar FormData para enviar os arquivos
    const formData = new FormData();
    formData.append("courseId", data.courseId);

    // Adicionar cada vídeo ao FormData
    data.videos.forEach((video, index) => {
      formData.append(`videos[${index}][title]`, video.title);
      formData.append(`videos[${index}][description]`, video.description);
      formData.append(`videos[${index}][video_file]`, video.video_file);
    });

    // Simulando upload (substituir por chamada real)
    const response = await fetch("/api/videos/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erro no upload");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar vídeos:", error);
    throw error;
  }
}
