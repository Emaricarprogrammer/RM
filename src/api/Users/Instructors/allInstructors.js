import { api } from "@/api/api";

async function AllInstrutors()
{
    try
    {
        const result = await api.get("/users/instructors/all/where/")
        return result.data
    } catch (error)
    {
        console.log(error)
        throw new Error("Ouve um erro")
    }
}

export {AllInstrutors}