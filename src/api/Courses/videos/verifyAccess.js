import { videoAPI } from "@/api/api";

export async function VerifyUserAccess(id_student, id_course) {
    try {
        const response = await videoAPI.post("/courses/videos/verifyAccess", {
            id_student, 
            id_course
        });

        return response.data
    } catch (error) {
        console.log(error)
    }
}