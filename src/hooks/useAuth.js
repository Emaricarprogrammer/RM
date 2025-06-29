import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserType } from "@/api/Authorization/getUserType";

function useUserAuth(allowedUsers = []) {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    isAuthorized: false,
    userType: null,
  });
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const user = await getUserType();
        
        if (!isMounted) return;
        
        // Verifica se o usuário está autenticado
        const usersAuth = ["ADMIN", "SUPER_ADMIN", "student"];
        if (!usersAuth.includes(user)) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          router.push("/"); // Melhor redirecionar para login
          return;
        }

        // Verifica se o usuário tem permissão para esta página
        if (allowedUsers.length > 0 && !allowedUsers.includes(user)) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          router.push("/"); // Página de não autorizado
          return;
        }

        // Se passou nas verificações
        if (isMounted) {
          setAuthStatus({
            loading: false,
            isAuthorized: true,
            userType: user,
          });
        }
      } catch (error) {
        console.error("Auth error:", error);
        if (isMounted) {
          router.push("/");
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [allowedUsers, router]);

  return authStatus; // Agora retorna o objeto completo
}

export { useUserAuth };