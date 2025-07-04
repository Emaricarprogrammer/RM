import { videoAPI } from "@/api/api";

async function VideoDetails(id_video) {
    try {
        const response = await videoAPI.get(`/courses/video/${id_video}`);
        
        return response.data;
    } catch (error) {
        console.error('Erro detalhado:', error);
        // Retorna um objeto de erro consistente ou lança o erro novamente
        return {
            message: error.response?.data?.message || "Falha ao obter detalhes do vídeo",
        };
    }
}

export { VideoDetails };