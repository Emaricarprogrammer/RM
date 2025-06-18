import {api} from "../api.js";
import { jwtDecode } from "jwt-decode";

async function getUserType()
{
    try
    {
        const token = localStorage.getItem("access");
        if (!token)
        {
            return null
        }
        const decodedToken = jwtDecode(token);
        const userType = decodedToken.userClaims.userType;
        return userType;
    }
    catch(error){
        console.error("Erro ao obter o tipo de usuário:", error);
        if (error.response && error.response.data) {
            return error.response.data;
        }
        return { success: false, message: "Erro inesperado. Tente novamente." };
    }
}
export { getUserType };