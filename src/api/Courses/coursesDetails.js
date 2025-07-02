// useCourse.js
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
        
        if (data.success && data.response) {
          const res = data.response;
          
      const groupVideosIntoModules = (videos) => {
        if (!videos || videos.length === 0) return [];
        
        // Tentar detectar módulos pelos títulos dos vídeos
        const modulePattern = /(Módulo \d+|Module \d+)/i;
        const hasModuleInTitles = videos.some(v => modulePattern.test(v.title));
        
        if (hasModuleInTitles) {
          // Se os vídeos já têm módulos nos títulos, agrupar por eles
          const modulesMap = videos.reduce((acc, video) => {
          const match = video.title.match(modulePattern);
          const moduleTitle = match ? match[0] : "Módulo 1";
      
          if (!acc[moduleTitle]) {
                acc[moduleTitle] = [];
              }
              acc[moduleTitle].push({
                ...video,
                cleanTitle: video.title.replace(modulePattern, '').trim()
              });
              return acc;
            }, {});
            return Object.entries(modulesMap).map(([title, lessons]) => ({
              title,
              lessons: lessons.map(lesson => ({
                title: lesson.cleanTitle || lesson.title,
                //duration: 10, // ou lesson.duration se disponível
                videoUrl: lesson.video_url,
                description: lesson.description,
                id: lesson.id_videos
              }))
         }));
          } else {
            // Se não, dividir em módulos de 5 vídeos cada
            const moduleCount = Math.ceil(videos.length / 5);
            const modules = [];
            
            for (let i = 0; i < moduleCount; i++) {
              const startIdx = i * 5;
              const endIdx = startIdx + 5;
              const moduleVideos = videos.slice(startIdx, endIdx);
              
              modules.push({
                title: `Módulo ${i + 1}`,
                lessons: moduleVideos.map(video => ({
                  title: video.title,
                  //duration: 10,
                  videoUrl: video.video_url,
                  description: video.description,
                  id: video.id_videos
                }))
              });
            }
            return modules;
          }
        }
          const transformedCourse = {
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
            category: res.category,
            id_category: res.id_category,
            
            // Módulos organizados
            modules: groupVideosIntoModules(res.course_videos),
            
            // Mantemos os vídeos originais também, se necessário
            course_videos: Array.isArray(res.course_videos) ? res.course_videos : [],

            instructors_datas: {
              id_instructor: res.instructors_datas?.id_instructor,
              full_name: res.instructors_datas?.user?.full_name ||
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