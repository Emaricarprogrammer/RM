import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserType} from "@/api/Authorization/getUserType";

function useUserAuth(allowedUsers = []) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userType, setUserType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const user = await getUserType();

        if (!isMounted) return;

        const usersAuth = ["ADMIN", "SUPER_ADMIN", "student"];
        if (!usersAuth.includes(user)) {
          router.push("/");
          return;
        }

        if (allowedUsers.length > 0 && !allowedUsers.includes(user)) {
          router.push("/");
          return;
        }

        if (isMounted) {
          setUserType(user);
          setIsAuthorized(true);
          setLoading(false);
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

  return { loading, isAuthorized, userType };
}

export { useUserAuth };
