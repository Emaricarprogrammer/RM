import { api } from "@/api/api";

async function Sigup(full_name, email, contact, password) {
  try {
    const result = await api.post("/users/students/signup", {
      full_name: full_name,
      email: email,
      contact: String(contact), // Converte para string se a API espera assim
      password: password
    });

    return {
      success: result.data.success,
      message: result.data.message,
      data: result.data.data // inclui quaisquer dados adicionais
    };
    
  } catch (error) {
    console.error("Register error:", error);
    
    // Tratamento mais robusto de erros
    if (error.response) {
      // Erros de validação (status 422) ou outros erros da API
      return { 
        success: false, 
        message: error.response.data.message || "Erro ao processar cadastro",
        errors: error.response.data.errors // para erros de validação detalhados
      };
    }
    
    return { 
      success: false, 
      message: error.message || "Falha na comunicação com o servidor"
    };
  }    
}

export { Sigup };