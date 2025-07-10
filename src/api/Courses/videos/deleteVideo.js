import { videoAPI } from "@/api/api";

async function DeleteVideo(id_video, token) {
    try {
        const response = await videoAPI.delete(`/courses/video/delete/${id_video}`,{
            headers: {
                'Authorization': `Bearer ${token}`,
                // Não definir Content-Type - deixar o browser definir automaticamente
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Erro detalhado:', error);
        // Retorna um objeto de erro consistente ou lança o erro novamente
        return {
            message: error.response?.data?.message || "Falha ao obter detalhes do vídeo",
        };
    }
}

export { DeleteVideo };