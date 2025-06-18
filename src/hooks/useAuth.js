import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserType } from "@/api/Authorization/getUserType";

function useUserAuth(allowedUsers = []) {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    isAuthorized: false,
  });
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const user = await getUserType();
        const usersAuth = ["ADMIN", "SUPER_ADMIN", "student"];

        if (!isMounted) return;

        // Verificação imediata para redirecionamento
        if (!usersAuth.includes(user)) {
          if (window.history.length > 2) {
                 await new Promise(resolve => setTimeout(resolve, 10000));
            router.back();
          } else {
            router.push("/");
          }
          return;
        }

        if (!allowedUsers.includes(user)) {
          router.push("/");
          return;
        }

        // Apenas para usuários autorizados, adiciona um pequeno delay
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        if (isMounted) {
          setAuthStatus({
            loading: false,
            isAuthorized: true,
          });
        }
      } catch (error) {
        console.error("Auth error:", error);
        if (isMounted) {
          router.push("/error");
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [allowedUsers, router]);

  return authStatus.loading;
}

export { useUserAuth };