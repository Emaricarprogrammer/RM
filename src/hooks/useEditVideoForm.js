// app/(private)/admin/editar-video/useEditVideoForm.js
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editVideoSchema } from "@/app/(private)/admin/editar-video/schema";
import { VideoDetails } from "@/api/Courses/videos/getVideo";

export function useEditVideoForm(videoId) {
  const [isLoading, setIsLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseError, setCourseError] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(editVideoSchema),
  });

  // Verifica se houve alterações nos campos
const hasChanges = () => {
  if (!initialValues) return false;
  
  const currentValues = getValues();
  return (
    currentValues.title !== initialValues.title ||
    currentValues.description !== initialValues.description ||
    currentValues.video_file !== undefined
  );
};

  // Função para atualizar o arquivo de vídeo
  const updateVideoFile = (file) => {
    setValue("video_file", file, { shouldDirty: true });
  };

  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setIsLoading(true);
        const response = await VideoDetails(videoId);
        
        if (!response.success) {
          setCourseError("Vídeo não encontrado");
          return;
        }

        setVideoData(response.response);
        const initialData = {
          title: response.response.title,
          description: response.response.description,
          existing_video_url: response.response.video_url,
          id_course_fk: response.response.id_course_fk,
        };
        setInitialValues(initialData);
        reset(initialData);
      } catch (error) {
        console.error("Erro ao carregar vídeo:", error);
        setCourseError(error.message || "Erro ao carregar vídeo");
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      loadVideoData();
    }
  }, [videoId, reset]);

  return {
    isLoading,
    isSubmitting,
    videoData,
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    setIsSubmitting,
    courseError,
    hasChanges,
    getValues,
    updateVideoFile, // Exporta a função para atualizar o arquivo
  };
}