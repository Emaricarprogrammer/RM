"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/app/(private)/admin/adicionar-curso/schema";
import {
  fetchCategories,
  fetchInstructors,
  submitCourseData
} from "@/app/(private)/admin/adicionar-curso/api";
import { useRouter } from "next/navigation";

export function useCourseForm() {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ 
    success: null, 
    message: '',
    shouldRedirect: false
  });

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitSuccessful },
  setValue,
  reset,
  trigger
} = useForm({
  resolver: zodResolver(courseSchema),
  defaultValues: {
    course_type: "",
    image_url: null,
    id_instructor: "", // Adicione isso para garantir o valor inicial
    id_category_course_fk: "" // Adicione isso para garantir o valor inicial
  },
});

  // Carrega categorias e instrutores
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsData, instsData] = await Promise.all([
          fetchCategories(),
          fetchInstructors()
        ]);
        
        setCategories(catsData || []);
        setInstructors(instsData || []);
      } catch (error) {
        console.error("Error loading form data:", error);
        setSubmitStatus({ 
          success: false, 
          message: 'Erro ao carregar dados iniciais',
          shouldRedirect: false
        });
      }
    };

    loadData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação do tamanho do arquivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setSubmitStatus({
        success: false,
        message: 'A imagem deve ter no máximo 5MB',
        shouldRedirect: false
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    setValue("image_url", [file], { shouldValidate: true });
    trigger("image_url");
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue("image_url", null, { shouldValidate: true });
    const fileInput = document.getElementById("dropzone-file");
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus({ 
      success: null, 
      message: '',
      shouldRedirect: false
    });
    
    try {
      const response = await submitCourseData(data);
      
      if (response?.redirect) {
        router.push(response.redirect);
        return;
      }

      if (response?.success) {
        setSubmitStatus({ 
          success: true, 
          message: 'Curso criado com sucesso! Redirecionando...',
          shouldRedirect: true
        });
      } else {
        setSubmitStatus({ 
          success: false, 
          message: response?.error || 'Erro ao criar curso, tente novamente!',
          shouldRedirect: false
        });
      }
      
      return response;
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setSubmitStatus({ 
        success: false, 
        message: error.message || 'Erro ao processar a requisição',
        shouldRedirect: false
      });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    removeImage();
    setSubmitStatus({ 
      success: null, 
      message: '',
      shouldRedirect: false
    });
  };

  return {
    previewImage,
    categories,
    instructors,
    handleImageChange,
    removeImage,
    isSubmitting,
    submitStatus,
    handleSubmit: handleSubmit(onSubmit),
    register,
    errors,
    reset: resetForm,
    trigger
  };
}