import { api } from "@/api/api";

async function MyProfile(id_student, accessToken)
{
    try
    {
        const result = await api.get(`/users/students/profile/${id_student}`,
            {
                headers:{
                    Authorization: `Berear ${accessToken}`
                }
            }
        )
    return {
      success: result.data.success,
      message: result.data.message,
      data: result.data.response // inclui quaisquer dados adicionais
    };

    } catch (error)
    {
        console.error("profile error:", error);
    
    // Tratamento mais robusto de erros
    if (error.response) {
      // Erros de validação (status 422) ou outros erros da API
      return { 
        success: false, 
        message: error.response.data.message || "Erro ao processar os seus dados",
        errors: error.response.data.errors // para erros de validação detalhados
      };
    }
    
    return { 
      success: false, 
      message: error.message || "Falha na comunicação com o servidor"
    };  
    }
}

export {MyProfile}