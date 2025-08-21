import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  total: z.number().min(0),
  pages: z.number().min(0),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: PaginationSchema,
  });

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    timestamp: z.string(),
    path: z.string().optional(),
    method: z.string().optional(),
  }),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const ContactInfoSchema = z.object({
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  whatsapp: z.string().nullable(),
  website: z.string().url().nullable(),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;