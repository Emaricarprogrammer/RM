"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/app/(private)/admin/adicionar-curso/schema";
import {
  fetchCategories,
  fetchInstructors,
} from "@/app/(private)/admin/adicionar-curso/api";

export function useCourseForm() {
  const [previewImage, setPreviewImage] = useState(null);
  const [categories] = useState(fetchCategories());
  const [instructors] = useState(fetchInstructors());
  const [isSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      course_type: "", // Valor inicial para o tipo de curso
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setValue("image_url", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue("image_url", null);
    document.getElementById("dropzone-file").value = "";
  };

  return {
    previewImage,
    categories,
    instructors,
    handleImageChange,
    removeImage,
    isSubmitting,
    handleSubmit,
    register,
    errors,
  };
}
