"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "@/app/(public)/criar-conta/schema";

export function useStudentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm({
    resolver: zodResolver(studentSchema),
  });

  return {
    isSubmitting,
    handleSubmit,
    register,
    errors,
    setError
  };
}