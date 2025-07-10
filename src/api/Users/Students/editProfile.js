import { api } from "@/api/api";

async function EditMyProfile(id_student, accessToken, data) {
    try {
        const result = await api.patch(`/users/students/profile/edit/${id_student}`,
            data,
            {
                headers:
                {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return {
            success: result.data.success,
            message: result.data.message,
            data: result.data.response
        };
    } catch (error) {
        console.error("Profile update error:", error);
        
        if (error.response) {
            return { 
                success: false, 
                message: error.response.data.message || "Erro ao atualizar perfil",
                errors: error.response.data.errors
            };
        }
        return { 
            success: false, 
            message: error.message || "Falha na comunicação com o servidor"
        };  
    }
}

export { EditMyProfile };