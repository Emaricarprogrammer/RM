import { CreateCourse } from "@/api/Courses/createCourse";
import { GetAllCategories } from "@/api/Courses/Categories/allCategories";
import { useRouter } from "next/navigation";
import { AllInstrutors } from "@/api/Users/Instructors/allInstructors";

export async function submitCourseData(data) {
  const formData = new FormData();
  
  // Adiciona todos os campos
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('duration', data.duration);
  formData.append('price', data.price);
  formData.append('total_lessons', data.total_lessons);
  formData.append('course_type', data.course_type?.toUpperCase() || '');
  formData.append('id_instructor_fk', data.id_instructor);
  formData.append('id_category_course_fk', data.id_category_course_fk);
  
  // Adiciona a imagem se existir
  if (data.image_url && data.image_url[0]) {
    formData.append('image_course', data.image_url[0]);
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  if (!token) {
    return { 
      success: false, 
      error: 'Não autenticado',
      redirect: '/admin'
    };
  }

  try {
    return await CreateCourse(formData, token);
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Erro ao enviar dados do curso'
    };
  }
}

// api.js
export async function fetchCategories() {
  try {
    const response = await GetAllCategories();
    // Verifica se a resposta tem a estrutura esperada
    return response.response?.map(category => ({
      id: category.id_category_course,
      name: category.name_category_courses
    })) || [];
  } catch (error) {
    return [];
  }
}

export async function fetchInstructors() {
  try {
    const response = await AllInstrutors();
    // Verifica se a resposta tem a estrutura esperada
    return response.response?.map(instructor => ({
      id: instructor.id_instructor,
      name: instructor.full_name
    })) || [];
  } catch (error) {
    return [];
  }
}