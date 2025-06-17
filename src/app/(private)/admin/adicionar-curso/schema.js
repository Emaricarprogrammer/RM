import { z } from "zod";

export const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "O título deve ter pelo menos 5 caracteres" }),
  description: z
    .string()
    .trim()
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  duration: z
    .number({ message: "A duração é obrigatória" })
    .int({ message: "A duração deve ser um número inteiro" })
    .positive({ message: "A duração deve ser um número positivo" })
    .min(1, { message: "A duração deve ser pelo menos 1 hora" }),
  price: z
    .number({ message: "O preço é obrigatório" })
    .int({ message: "O preço deve ser um número inteiro" })
    .positive({ message: "O preço deve ser um número positivo" }),
  total_lessons: z
    .number({ message: "O total de aulas é obrigatório" })
    .int({ message: "O total de aulas deve ser um número inteiro" })
    .positive({ message: "O total de aulas deve ser um número positivo" })
    .min(1, { message: "Deve haver pelo menos 1 aula" }),
  id_instructor: z
    .string({ message: "Selecione um instrutor" })
    .trim()
    .min(1, { message: "Selecione um instrutor" }),
  id_category_course_fk: z
    .string({ message: "Selecione uma categoria" })
    .trim()
    .min(1, { message: "Selecione uma categoria" }),
  course_type: z.enum(["online", "presential"], {
    message: "Selecione o tipo de curso",
  }),
  image_url: z.any(),
});
