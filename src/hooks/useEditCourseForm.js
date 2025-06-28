"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/app/(private)/admin/adicionar-curso/schema";
import { useEffect } from "react";

export function useEditCourseForm(initialValues) {
  const formMethods = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 0,
      price: 0,
      total_lessons: 0,
      id_instructor: "",
      id_category_course_fk: "",
      course_type: "",
      image_url: "",
      ...initialValues,
      id_instructor: initialValues?.id_instructor_fk || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialValues) {
      formMethods.reset({
        ...initialValues,
        id_instructor: initialValues.id_instructor_fk,
        course_type: initialValues.course_type || "",
      });
    }
  }, [initialValues, formMethods]);

  return formMethods;
}