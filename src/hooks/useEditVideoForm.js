// app/(private)/admin/editar-video/useEditVideoForm.js
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editVideoSchema } from "@/app/(private)/admin/editar-video/schema";
import { fetchVideoToEdit } from "@/app/(private)/admin/editar-video/api";

export function useEditVideoForm(courseId, videoId) {
  const [isLoading, setIsLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(editVideoSchema),
  });

  useEffect(() => {
    const loadVideoData = async () => {
      try {
        const data = await fetchVideoToEdit(courseId, videoId);
        setVideoData(data);
        reset({
          title: data.title,
          description: data.description,
          existing_video_url: data.video_url,
        });
      } catch (error) {
        console.error("Erro ao carregar vídeo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoData();
  }, [courseId, videoId, reset]);

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
  };
}
