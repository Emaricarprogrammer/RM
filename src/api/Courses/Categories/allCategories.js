import { api } from "@/api/api.js"
async function GetAllCategories()
{
    try
    {
        const result = await api.get("/courses/all/categories")
        return result.data
    } catch (error)
    {
        console.log(error)
    return { success: false, message: error.response?.data?.message || "Erro desconhecido ao deletar curso." };
    }
}


export {GetAllCategories}