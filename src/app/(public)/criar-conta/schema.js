import { z } from "zod";

export const studentSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
  email: z
    .string()
    .trim()
    .email({ message: "E-mail inválido" })
    .min(5, { message: "O e-mail deve ter pelo menos 5 caracteres" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 8 caracteres" })
    .max(50, { message: "A senha deve ter no máximo 50 caracteres" }),
  contact: z
    .number({ message: "O contato é obrigatório" })
    .int({ message: "O contato deve ser um número inteiro" })
    .positive({ message: "O contato deve ser um número positivo" })
    .min(900000000, { message: "Número de telefone inválido" })
    .max(999999999, { message: "Número de telefone inválido" }),
});
