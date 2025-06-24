import { api } from "@/api/api";

async function InstrutorProfile(id_instructor)
{
    try
    {
        const result = await api.get(`/users/instructors/profile/${id_instructor}`)
        return result.data
    } catch (error)
    {
        console.log(error)
        throw new Error("Ouve um erro")
    }
}

export {InstrutorProfile}