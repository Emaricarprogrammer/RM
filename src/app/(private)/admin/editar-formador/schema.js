// app/(private)/admin/editar-formador/schema.js
import { z } from "zod";

export const editInstructorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "O nome deve ter pelo menos 5 caracteres" }),
  bio: z
    .string()
    .trim()
    .min(20, { message: "A biografia deve ter pelo menos 20 caracteres" }),
  image_url: z.any(),
});
