import { useEffect, useState } from "react";
import { api } from "../api";

const getCourse = (id) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`courses/${id}`);

        if (data.success && data.response) {
          const res = data.response;

          const transformedCourse = {
            // Dados básicos do curso
            id_course: res.id_course,
            title: res.title,
            description: res.description,
            image_url: res.image_url,
            price: res.price,
            total_lessons: res.total_lessons,
            duration: res.duration,
            createdAt: res.createdAt,
            updatedAt: res.updatedAt,
            course_type: res.course_type,
            total_watching: res.total_watching || 0,

            // Categoria (mantida como string para compatibilidade)
            category: res.category,
            id_category: res.id_category,

            // Vídeos (convertendo para array se for número)
            course_videos:
              typeof res.course_videos === "number"
                ? []
                : res.course_videos || [],

            // Dados do instrutor (unificando os campos)
            instructors_datas: {
              id_instructor: res.instructors_datas.id_instructor,
              full_name:
                res.instructors_datas.user?.full_name ||
                res.instructors_datas.full_name ||
                "Instrutor não disponível",
              biography: res.instructors_datas.biography,
              profile_image: res.instructors_datas.profile_image,
              user: res.instructors_datas.user,
            },
          };

          setCourse(transformedCourse);
        }
        return []
      } catch (error) {
        console.error("Erro ao buscar curso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return { course, loading };
};

export {getCourse}