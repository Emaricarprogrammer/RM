import { api } from "@/api/api";

async function BasicsManagements(access_token, id_admin) {
    console.log(access_token)
    try {
        const response = await api.get(`/users/admins/basics-managements/${id_admin}`, {
        headers: {  
            Authorization: `Bearer ${access_token}`,
        },
        });
        return response.data
    } catch (error) {
        console.error("Erro ao obter dados de gerenciamento básico:", error);
        if (error.response && error.response.data) {
        return error.response.data;
        }
        return { success: false, message: "Erro inesperado. Tente novamente." };
    }
    }
export { BasicsManagements };