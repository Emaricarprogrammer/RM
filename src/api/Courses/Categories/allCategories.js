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
        throw new Error("Ocorreu um erro")
    }
}


export {GetAllCategories}