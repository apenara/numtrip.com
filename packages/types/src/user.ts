import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  verified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  password: z.string().min(8),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;