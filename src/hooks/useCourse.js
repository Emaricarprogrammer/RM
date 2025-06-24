// src/hooks/useCourse.js
'use client'; // Essencial para Next.js 13+

import { useState, useEffect } from 'react';

export const useCourse = (id) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${id}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch');
        
        setCourse({
          id_course: data.id_course,
          title: data.title,
          description: data.description,
          image_url: data.image_url,
          price: data.price,
          total_lessons: data.total_lessons,
          duration: data.duration,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          course_type: data.course_type,
          total_watching: data.total_watching || 0,
          category: data.category,
          id_category: data.id_category,
          course_videos: Array.isArray(data.course_videos) ? data.course_videos : [],
          instructors_datas: {
            id_instructor: data.instructors_datas?.id_instructor,
            full_name: data.instructors_datas?.user?.full_name ||
                     data.instructors_datas?.full_name ||
                     "Instrutor não disponível",
            biography: data.instructors_datas?.biography,
            profile_image: data.instructors_datas?.profile_image,
            user: data.instructors_datas?.user
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  return { course, loading, error };
};