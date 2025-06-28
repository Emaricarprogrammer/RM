"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { instructorSchema } from "@/app/(private)/admin/adicionar-formador/schema";

export function useInstructorForm() {
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      full_name: "",
      email: "",
      contact: "",
      password: "",
      biography: "",
      image_instructor: null,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Atualiza o valor do campo para o array de arquivos
      setValue("image_instructor", e.target.files, { shouldValidate: true });
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue("image_instructor", null, { shouldValidate: true });
    const fileInput = document.getElementById("instructor-photo");
    if (fileInput) fileInput.value = "";
  };

  // Função para ser usada no onSubmit do formulário
  const onSubmitHandler = async (data, onSubmit) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    previewImage,
    handleImageChange,
    removeImage,
    isSubmitting,
    handleSubmit: (onSubmit) => handleSubmit((data) => onSubmitHandler(data, onSubmit)),
    register,
    errors,
    setValue,
    reset,
    watch,
  };
}