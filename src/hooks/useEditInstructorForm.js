// app/(private)/admin/editar-formador/hooks/useEditInstructorForm.js
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editInstructorSchema } from "@/app/(private)/admin/editar-formador/schema";

export function useEditInstructorForm() {
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(editInstructorSchema),
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
    const fileInput = document.getElementById("instructor-photo");
    if (fileInput) fileInput.value = "";
  };

  return {
    previewImage,
    setPreviewImage,
    handleImageChange,
    removeImage,
    isSubmitting,
    setIsSubmitting,
    handleSubmit,
    register,
    errors,
    setValue,
  };
}
