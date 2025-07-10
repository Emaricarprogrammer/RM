import { videoAPI } from "@/api/api";

export async function updateVideoData(id_video, formData, token) {
    try {
        const response = await videoAPI.patch(`/courses/videoDatas/${id_video}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                // Não definir Content-Type - deixar o browser definir automaticamente
            }
        });

        return {
            success: true,
            message: response.data.message || "Vídeo atualizado com sucesso",
            data: response.data
        };
    } catch (error) {
        console.error("Erro completo:", error);
        console.error("Resposta do erro:", error.response?.data);
        
        const errorMessage = error.response?.data?.message 
            || error.message 
            || "Falha na comunicação com o servidor";
        
        return { 
            success: false, 
            message: errorMessage,
            statusCode: error.response?.status || 500
        };   
    }
}

export async function updateVideoFile(id_video, videoFile, token) {
  const formData = new FormData();
  formData.append('video_courses', videoFile);
  formData.append('id_course_fk', id_video)

  try {
    const response = await videoAPI.patch(`/courses/video/${id_video}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: true,
      message: response.data.message || "Vídeo atualizado com sucesso",
      data: response.data
    };
  } catch (error) {
    console.error("Erro no upload do vídeo:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Falha ao enviar o vídeo",
      statusCode: error.response?.status || 500
    };
  }
}