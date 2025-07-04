import { api } from "@/api/api";

export async function GetOTP(email)
{
    try
    {
        const response = await api.post("/users/auth/getOTP", {email: email})
        return response.data
    } catch (error)
    {
    console.error('Erro detalhado:', error);
    return {
            message: error.response?.data?.message || "Falha ao obter detalhes do vídeo",
        };
    }
}


export async function EditCredentials(id_credentials, datas)
{
    try
    {
        const response = await api.patch(`/private/credentials/edit/${id_credentials}`, datas)
        return response.data
    } catch (error)
    {
    console.error('Erro detalhado:', error);
    return {
            message: error.response?.data?.message || "Falha ao obter detalhes do vídeo",
        };
    }
}