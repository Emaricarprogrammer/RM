import { z } from "zod";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const videoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  description: z
    .string()
    .trim()
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  video_file: z
    .any()
    .refine((file) => file?.size > 0, "O arquivo de vídeo é obrigatório")
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Tamanho máximo de 500MB")
    .refine(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file?.type),
      "Formatos aceitos: .mp4, .webm, .ogg, .mov"
    ),
});

export const videosSchema = z.object({
  courseId: z.string().min(1, { message: "ID do curso é obrigatório" }),
  courseTitle: z.string().min(1, { message: "Título do curso é obrigatório" }),
  videos: z
    .array(videoSchema)
    .min(1, { message: "Adicione pelo menos um vídeo" })
    .max(10, { message: "Máximo de 10 vídeos por vez" }),
});
