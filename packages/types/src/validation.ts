import { z } from 'zod';

export enum ValidationType {
  PHONE_WORKS = 'PHONE_WORKS',
  PHONE_INCORRECT = 'PHONE_INCORRECT',
  EMAIL_WORKS = 'EMAIL_WORKS',
  EMAIL_INCORRECT = 'EMAIL_INCORRECT',
  WHATSAPP_WORKS = 'WHATSAPP_WORKS',
  WHATSAPP_INCORRECT = 'WHATSAPP_INCORRECT',
  GENERAL_CORRECT = 'GENERAL_CORRECT',
  GENERAL_INCORRECT = 'GENERAL_INCORRECT',
}

export const ValidationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ValidationType),
  isCorrect: z.boolean(),
  comment: z.string().nullable(),
  businessId: z.string(),
  userId: z.string().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.date(),
});

export type Validation = z.infer<typeof ValidationSchema>;

export const CreateValidationSchema = z.object({
  type: z.nativeEnum(ValidationType),
  isCorrect: z.boolean(),
  comment: z.string().max(500).optional(),
  businessId: z.string(),
});

export type CreateValidation = z.infer<typeof CreateValidationSchema>;