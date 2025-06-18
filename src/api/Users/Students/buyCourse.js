import { api } from "@/api/api";

export async function BuyCourse(id_student, id_course) {
    try {
        const response = await api.post("/courses/enrolls/create/",{
            id_student,
            id_course,
        },
        {
            headers:
            {
                Authorization: `Bearer ${localStorage.getItem("access")}`
            } 
    });
        return response.data;
    } catch (error) {
        console.error("Erro ao comprar curso:", error);
        if (error.response && error.response.data) {
        return error.response.data;
        }
        return { success: false, message: "Erro inesperado. Tente novamente." };
    }
    }