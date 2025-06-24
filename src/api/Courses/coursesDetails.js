"use client";
import { useEffect, useState } from "react";
import { api } from "../api";

const useCourse = (id) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`courses/${id}`);
        console.log("Dados do curso:", data);
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

            // Categoria
            category: res.category,
            id_category: res.id_category,

            // Vídeos
            course_videos: Array.isArray(res.course_videos) 
              ? res.course_videos 
              : [],

            // Dados do instrutor
            instructors_datas: {
              id_instructor: res.instructors_datas?.id_instructor,
              full_name:
                res.instructors_datas?.user?.full_name ||
                res.instructors_datas?.full_name ||
                "Instrutor não disponível",
              biography: res.instructors_datas?.biography,
              profile_image: res.instructors_datas?.profile_image,
              user: res.instructors_datas?.user,
            },
          };

          setCourse(transformedCourse);
        } else {
          setError("Curso não encontrado");
        }
      } catch (err) {
        console.error("Erro ao buscar curso:", err);
        setError(err.message || "Erro ao carregar o curso");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return { course, loading, error };
};

export { useCourse };
