// hooks/useCourseAccess.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VerifyUserAccess } from '@/api/Courses/videos/verifyAccess';
import { jwtDecode } from 'jwt-decode';

export function useCourseAccess(id_course) {
  const [accessState, setAccessState] = useState({
    loading: true,
    hasAccess: false,
    error: null
  });
  
  const router = useRouter();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          router.replace("/");
          return;
        }
        
        const decodedToken = jwtDecode(token);
        const id_student = decodedToken.userClaims.id_student;
        
        if (!id_student || !id_course) {
          setAccessState({
            loading: false,
            hasAccess: false,
            error: !id_student ? 'Estudante não encontrado' : 'Curso não fornecido'
          });
          return;
        }

        const response = await VerifyUserAccess(id_student, id_course);
        
        if (!response.isVerified) {
          router.replace(`/checkout?id=${id_course}`);
          return;
        }

        setAccessState({
          loading: false,
          hasAccess: response.isVerified || false,
          error: null
        });

      } catch (error) {
        setAccessState({
          loading: false,
          hasAccess: false,
          error: error.message
        });
        router.replace("/");
      }
    };

    verifyAccess();
  }, [id_course, router]);

  return accessState;
}