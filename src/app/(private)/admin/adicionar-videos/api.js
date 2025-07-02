import { videoAPI } from "@/api/api";

export async function submitVideos(data) {
  try {
    const formData = new FormData();
    formData.append('id_course_fk', data.id_course_fk);
    console.log(data)

    // Estrutura compatível com o backend
    data.videos.forEach((video) => {
      formData.append('video_courses', video.video_file); // Campo único para todos os vídeos
      formData.append('title', video.title);             // Mesmo nome para todos os títulos
      formData.append('description', video.description); // Mesmo nome para todas descrições
    });

    const response = await videoAPI.post('/courses/videos/new_video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;

  } catch (error) {
    console.error('Erro detalhado:', error)
  }
}