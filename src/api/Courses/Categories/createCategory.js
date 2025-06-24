import { api } from "@/api/api";

async function CreateCategory(category_name, accessToken) {
    try {
        const result = await api.post("/courses/category/create_category", 
            { category_name: category_name }, // Corpo da requisição
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return result.data;
    } catch (error) {
        console.log(error);
        return { 
            success: false, 
            message: error.response?.data?.message || "Erro desconhecido ao criar categoria." 
        };
    }
}

export { CreateCategory };