import { api } from "@/api/api";

async function GetAllCategories() {
    try {
        const result = await api.get("/courses/all/categories");
        return result.data;
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || "Erro ao carregar categorias" 
        };
    }
}

async function CreateCategory(category_name, accessToken) {
    try {
        const result = await api.post(
            "/courses/category/create_category",
            { category_name },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return result.data;
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || "Erro ao criar categoria" 
        };
    }
}

async function UpdateCategory(id_category, name_category_courses, accessToken) {
    try {
        const result = await api.put(
            `/courses/category/edit/${id_category}`,
            { name_category_courses },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return result.data;
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || "Erro ao atualizar categoria" 
        };
    }
}

async function DeleteCategory(id_category, accessToken) {
    try {
        const result = await api.delete(
            `/courses/category/delete/${id_category}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return result.data;
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || "Erro ao excluir categoria" 
        };
    }
}

export { 
    GetAllCategories, 
    CreateCategory, 
    UpdateCategory, 
    DeleteCategory 
};