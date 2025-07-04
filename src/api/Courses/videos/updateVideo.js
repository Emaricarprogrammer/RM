// api/Courses/videos/updateVideo.js
import { videoAPI } from "@/api/api";

export async function updateVideoData(id_video, formData) {
    console.log(formData)
    try {
        const response = await videoAPI.patch(`/courses/video/${id_video}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return {
            success: true,
            message: response.data.message || "Vídeo atualizado com sucesso",
            data: response.data
        };
    } catch (error) {
        console.error("Video update error:", error);
        
        if (error.response) {
            return { 
                success: false, 
                message: error.response.data.message || "Erro ao atualizar vídeo",
                errors: error.response.data.errors,
                statusCode: error.response.status
            };
        }
        return { 
            success: false, 
            message: error.message || "Falha na comunicação com o servidor",
            statusCode: 500
        };   
    }
}