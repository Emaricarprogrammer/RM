import { api } from "@/api/api";

async function BasicsManagements(access_token, id_admin) {
    try {
        const response = await api.get(`/users/admins/basics-managements/${id_admin}`, {
        headers: {  
            Authorization: `Bearer ${access_token}`,
        },
        });
        return response.data
    } catch (error) {
        if (error.response && error.response.data) {
        return error.response.data;
        }
        return { success: false, message: "Erro inesperado. Tente novamente." };
    }
    }

async function Enrrols(access_token)
{
    try {
    const response = await api.get(`/courses/all/enrolls`, {
    headers: {  
        Authorization: `Bearer ${access_token}`,
    },
    });
    return response.data
} catch (error) {
    if (error.response && error.response.data) {
    return error.response.data;
    }
    return { success: false, message: "Erro inesperado. Tente novamente." };
    }
}

async function setEnrollStatus(id_enroll, email, status, access_token) {
    try {
        const response = await api.put(`/courses/enrolls/confirmation/${id_enroll}`, 
            { status: status, email: email},  // Corrigido: data estava dentro de um objeto data desnecessário
            {  
                headers: { Authorization: `Bearer ${access_token}` }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        return { success: false, message: error.message || "Erro inesperado. Tente novamente." };
    }
}
export { BasicsManagements, Enrrols, setEnrollStatus};