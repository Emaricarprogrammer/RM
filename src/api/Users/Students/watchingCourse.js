import { api } from "@/api/api";

export async function WatchingCourse(id_student,id_course, accessToken) {

  try {
        const response = await api.post("/users/students/watching_course", 
            { id_student: id_student, id_course: id_course},  
            {  
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );
    return response.data
  } catch (error)
  {
    return []
  }
}
