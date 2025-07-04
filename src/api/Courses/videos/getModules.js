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

export {groupVideosIntoModules}