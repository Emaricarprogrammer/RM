import { api } from "../api.js";
export async function ForgotPassword(email) {
  try {
    const response = await api.post("/users/auth/forgot_password", { email });
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar solicitação de redefinição de senha:", error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Erro inesperado. Tente novamente." };
  }
}
export async function ResetPassword({ newPassword, auth }) {
  try {
    const response = await api.post("/users/auth/reset_password", 
      { newPassword }, // Corpo da requisição
      { params: { auth } } // Query params
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Erro inesperado. Tente novamente." };
  }
}