"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { editInstructorSchema } from "@/app/(private)/admin/editar-formador/schema";

export function useEditInstructorForm(initialValues = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    reset,
    watch,
    control,
  } = useForm({
    resolver: zodResolver(editInstructorSchema),
    defaultValues: {
      full_name: "",
      email: "",
      contact: "",
      biography: "",
      profile_image: "",
      ...initialValues
    },
    mode: "onChange"
  });

  // Reset form when initialValues change
  useEffect(() => {
    reset({
      full_name: initialValues.full_name || "",
      email: initialValues.email || "",
      contact: initialValues.contact || "",
      biography: initialValues.biography || "",
      profile_image: initialValues.profile_image || ""
    });
  }, [initialValues, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("profile_image", reader.result, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setValue("profile_image", "", { shouldDirty: true });
    const fileInput = document.getElementById("instructor-photo");
    if (fileInput) fileInput.value = "";
  };

  const hasChanges = () => {
    const currentValues = watch();
    return (
      Object.keys(dirtyFields).length > 0 ||
      (currentValues.profile_image !== (initialValues?.profile_image || "") &&
      currentValues.profile_image !== "")
    );
  };

  return {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    setValue,
    watch,
    control,
    handleImageChange,
    removeImage,
    hasChanges,
  };
}