import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Имя пользователя обязательно'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export const promotionSchema = z.object({
  name: z
    .string()
    .min(1, 'Название акции обязательно')
    .max(255, 'Название акции не должно превышать 255 символов'),
  startDate: z
    .string()
    .min(1, 'Дата начала обязательна')
    .refine((date) => !isNaN(Date.parse(date)), 'Неверный формат даты'),
  endDate: z
    .string()
    .min(1, 'Дата окончания обязательна')
    .refine((date) => !isNaN(Date.parse(date)), 'Неверный формат даты'),
  isActive: z.boolean().optional().default(true),
  parentId: z.string().uuid().optional().or(z.literal('none')),
  rules: z.string().optional(),
  couponsPlaceholder: z.string().optional(),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: 'Дата окончания должна быть позже даты начала',
  path: ['endDate'],
});

export const fileUploadSchema = z.object({
  caption: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type PromotionFormData = z.infer<typeof promotionSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;