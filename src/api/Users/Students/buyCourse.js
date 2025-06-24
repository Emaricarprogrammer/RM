import { api } from "@/api/api";

export async function BuyCourse(id_student_fk, id_course_fk) {
    try {
        const response = await api.post("/courses/create/enrolls",{
            id_student_fk,
            id_course_fk,
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