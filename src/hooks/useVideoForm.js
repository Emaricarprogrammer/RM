"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { videosSchema } from "@/app/(private)/admin/adicionar-videos/schema";
import { useCourse } from "@/api/Courses/coursesDetails";

export function useVideoForm(courseId) {
  const [videoCount, setVideoCount] = useState(1);
  const { course: courseDetails, loading: loadingCourse, error: courseError } = useCourse(courseId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(videosSchema),
    defaultValues: {
      id_course_fk: courseId || "",
      videos: Array(1).fill().map(() => ({
        title: "",
        description: "",
        video_file: null
      })),
    },
  });

  useEffect(() => {
    if (courseId) {
      setValue("id_course_fk", courseId);
    }
  }, [courseId, setValue]);

  const addVideoField = () => {
    if (videoCount < 10) {
      setVideoCount(prev => prev + 1);
      setValue("videos", [
        ...watch("videos"),
        { title: "", description: "", video_file: null },
      ]);
    }
  };

  const removeVideoField = (index) => {
    if (videoCount > 1) {
      setVideoCount(prev => prev - 1);
      const currentVideos = [...watch("videos")];
      currentVideos.splice(index, 1);
      setValue("videos", currentVideos);
      trigger();
    }
  };

  return {
    isSubmitting,
    courseDetails,
    videoCount,
    loadingCourse,
    courseError,
    register,
    handleSubmit, // Retorna diretamente do useForm
    errors,
    addVideoField,
    removeVideoField,
    watch,
    setValue,
  };
}