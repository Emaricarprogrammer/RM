import { api } from "../api.js";

async function Signin(email, password) {
  try {
    const result = await api.post("/users/auth/login", {
      email: email,
      password: password
    });

    if (!result.data?.accessToken) {
      throw new Error("Token de acesso ausente");
    }

    localStorage.setItem("access", result.data.accessToken);
    return { 
      success: true,
      ...result.data
    };

  } catch (error) {
    console.error("Login error:", error);
    
    // Retorna a mensagem de erro da API se existir
    if (error.response?.data?.message) {
      return { 
        success: false, 
        message: error.response.data.message,
        status: error.response.status
      };
    }
    
    return { 
      success: false, 
      message: error.message || "Falha no login",
      status: error.response?.status
    };
  }
}

export { Signin };