import { api } from "@/api/api";

export async function CreateInstructor(data, token) {
    const formData = new FormData();
    
    // Adiciona todos os campos
    formData.append('full_name', data.full_name);
    formData.append('email', data.email);
    formData.append('contact', data.contact);
    formData.append('password', data.password)
    formData.append('biography', data.biography);
    formData.append('profile_image', data.image_instructor[0]);
    
    try {
        const response = await api.post('/users/instructors/signup', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data
    } catch (error) {
        // Ajuste para pegar a mensagem correta da resposta de erro
        const errorMessage = error.response?.data?.message || 'Erro ao criar instrutor';
        return {
            success: false,
            message: errorMessage,
        };
    }
}