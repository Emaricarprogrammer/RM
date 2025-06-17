"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/app/(private)/admin/adicionar-curso/schema";
import {
  fetchCategories,
  fetchInstructors,
} from "@/app/(private)/admin/adicionar-curso/api";

export function useEditCourseForm(initialValues) {
  const [previewImage, setPreviewImage] = useState(
    initialValues?.image_url || null
  );
  const [categories] = useState(fetchCategories());
  const [instructors] = useState(fetchInstructors());
  const [isSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      duration: initialValues?.duration || "",
      price: initialValues?.price || "",
      total_lessons: initialValues?.total_lessons || "",
      id_instructor: initialValues?.id_instructor || "",
      id_category_course_fk: initialValues?.id_category_course_fk || "",
      course_type: initialValues?.course_type || "",
      image_url: initialValues?.image_url || null,
    },
  });

  useEffect(() => {
    if (initialValues?.image_url) {
      setPreviewImage(initialValues.image_url);
    }
  }, [initialValues?.image_url]);

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
