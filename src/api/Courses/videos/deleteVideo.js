import { videoAPI } from "@/api/api";

async function DeleteVideo(id_video) {
    console.log(id_video)
    try {
        const response = await videoAPI.delete(`/courses/video/${id_video}`);
        
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