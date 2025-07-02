import { z } from "zod";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const videoSchema = z.object({
  title: z.string()
    .trim()
    .min(5, "Título deve ter pelo menos 5 caracteres")
    .max(100, "Título muito longo (máx. 100 caracteres)"),
  
  description: z.string()
    .trim()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(500, "Descrição muito longa (máx. 500 caracteres)"),
  
  video_file: z.instanceof(File, { message: "Selecione um arquivo de vídeo" })
    .refine(file => file.size > 0, "Arquivo não pode estar vazio")
    .refine(file => file.size <= MAX_FILE_SIZE, `Tamanho máximo: ${MAX_FILE_SIZE/1024/1024}MB`)
    .refine(file => ACCEPTED_VIDEO_TYPES.includes(file.type), 
      "Formatos aceitos: MP4, WEBM, OGG, MOV")
});

export const videosSchema = z.object({
  id_course_fk: z.string().min(1, "ID do curso é obrigatório"),
  videos: z.array(videoSchema)
    .min(1, "Adicione pelo menos 1 vídeo")
    .max(10, "Máximo de 10 vídeos por envio")
});