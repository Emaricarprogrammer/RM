// app/(private)/admin/editar-video/schema.js
import { z } from "zod";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

export const editVideoSchema = z.object({
  title: z
    .string()
    .min(5, { message: "O título deve ter pelo menos 5 caracteres" })
    .trim(),
  description: z
    .string()
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" })
    .trim(),
  video_file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Tamanho máximo de 500MB"
    )
    .refine(
      (file) => !file || ACCEPTED_VIDEO_TYPES.includes(file.type),
      "Formatos aceitos: .mp4, .webm, .ogg, .mov"
    ),
  existing_video_url: z.string().optional(),
});
