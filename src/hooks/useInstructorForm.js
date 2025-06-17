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
  } = useForm({
    resolver: zodResolver(instructorSchema),
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
    document.getElementById("instructor-photo").value = "";
  };

  return {
    previewImage,
    handleImageChange,
    removeImage,
    isSubmitting,
    handleSubmit,
    register,
    errors,
  };
}
