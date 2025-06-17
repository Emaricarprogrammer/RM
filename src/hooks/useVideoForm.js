"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { videosSchema } from "@/app/(private)/admin/adicionar-videos/schema";
import { fetchCourseDetails } from "@/app/(private)/admin/adicionar-videos/api";

export function useVideoForm(courseId) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [videoCount, setVideoCount] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(videosSchema),
    defaultValues: {
      courseId,
      videos: Array(1).fill({
        title: "",
        description: "",
        video_file: null,
      }),
    },
  });

  const loadCourseDetails = async () => {
    const details = await fetchCourseDetails(courseId);
    setCourseDetails(details);
    setValue("courseTitle", details.title);
    return details;
  };

  const addVideoField = () => {
    if (videoCount < 10) {
      setVideoCount((prev) => prev + 1);
      setValue("videos", [
        ...watch("videos"),
        { title: "", description: "", video_file: null },
      ]);
    }
  };

  const removeVideoField = (index) => {
    if (videoCount > 1) {
      setVideoCount((prev) => prev - 1);
      const currentVideos = [...watch("videos")];
      currentVideos.splice(index, 1);
      setValue("videos", currentVideos);
    }
  };

  const clearVideoFile = (index) => {
    setValue(`videos.${index}.video_file`, null);
  };

  useEffect(() => {
    loadCourseDetails();
  }, []);

  return {
    isSubmitting,
    courseDetails,
    videoCount,
    register,
    handleSubmit,
    control,
    errors,
    addVideoField,
    removeVideoField,
    clearVideoFile,
    loadCourseDetails,
    watch,
    setValue,
  };
}
