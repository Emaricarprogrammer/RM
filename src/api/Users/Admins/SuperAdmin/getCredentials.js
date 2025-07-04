import { api } from "@/api/api";

export async function GetCredentials()
{
    try
    {
        const response = await api.get("/private/credential")
        return response.data    
    } catch (error)
    {
        console.error('Erro detalhado:', error);
        // Retorna um objeto de erro consistente ou lança o erro novamente
    return {
            message: error.response?.data?.message || "Falha ao obter detalhes do vídeo",
        };
    }
}