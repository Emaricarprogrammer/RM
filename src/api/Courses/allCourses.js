import { api } from "../api.js"

async function GetAllCourses()
{
    try
    {
        const result = await api.get("/courses/all/where")
        return result.data
    } catch (error)
    {
        console.log(error)
        return null
    }
}


export {GetAllCourses}