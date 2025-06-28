import { z } from "zod";

export const editInstructorSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  contact: z.string()
    .min(9, "Contacto deve ter pelo menos 9 dígitos")
    .regex(/^[0-9]+$/, "Contacto deve conter apenas números"),
  biography: z.string()
    .min(30, "Biografia deve ter pelo menos 30 caracteres")
    .max(500, "Biografia não pode exceder 500 caracteres"),
  profile_image: z.any()
    .optional()
    .refine(
      (file) => !file || (typeof file === 'string') || file.size <= 5_000_000, 
      "Tamanho máximo do arquivo é 5MB"
    )
    .refine(
      (file) => !file || (typeof file === 'string') || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Apenas formatos .jpg, .jpeg ou .png são suportados"
    )
});