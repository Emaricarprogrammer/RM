import { z } from "zod";

export const instructorSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  contact: z.number().min(9, "Contacto deve ter pelo menos 9 dígitos"),
  password: z.string().min(8, "Password deve ter pelo menos 8 caracteres"),
  biography: z.string().min(30, "Biografia deve ter pelo menos 30 caracteres"),
  image_instructor: z
    .any()
    .refine((files) => files?.length > 0, "Foto do formador é obrigatória")
    .refine(
      (files) => files?.[0]?.size <= 5_000_000,
      "Tamanho máximo do arquivo é 5MB"
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(files?.[0]?.type),
      "Apenas formatos .jpg, .jpeg ou .png são suportados"
    ),
    
});