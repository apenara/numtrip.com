import { z } from 'zod';

export enum BusinessCategory {
  HOTEL = 'HOTEL',
  TOUR = 'TOUR',
  TRANSPORT = 'TRANSPORT',
  RESTAURANT = 'RESTAURANT',
  ATTRACTION = 'ATTRACTION',
  OTHER = 'OTHER',
}

export const BusinessSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.nativeEnum(BusinessCategory),
  verified: z.boolean(),
  active: z.boolean(),
  city: z.string(),
  address: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  whatsapp: z.string().nullable(),
  website: z.string().url().nullable(),
  googlePlaceId: z.string().nullable(),
  ownerId: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  claimedAt: z.union([z.string(), z.date()]).nullable(),
  promoCodes: z.array(z.object({
    id: z.string(),
    code: z.string(),
    description: z.string(),
    discount: z.string(),
    validUntil: z.union([z.string(), z.date()]).nullable(),
  })).optional(),
});

export type Business = z.infer<typeof BusinessSchema>;

export const CreateBusinessSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  category: z.nativeEnum(BusinessCategory),
  city: z.string().min(2).max(50),
  address: z.string().max(200).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  whatsapp: z.string().max(20).optional(),
  website: z.string().url().optional(),
  googlePlaceId: z.string().optional(),
  verified: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type CreateBusiness = z.infer<typeof CreateBusinessSchema>;

export const UpdateBusinessSchema = CreateBusinessSchema.partial();
export type UpdateBusiness = z.infer<typeof UpdateBusinessSchema>;

export const BusinessSearchSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  category: z.nativeEnum(BusinessCategory).optional(),
  verified: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type BusinessSearch = z.infer<typeof BusinessSearchSchema>;

export type BusinessSearchParams = BusinessSearch;

export const BusinessSearchResponseSchema = z.object({
  items: z.array(BusinessSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type BusinessSearchResponse = z.infer<typeof BusinessSearchResponseSchema>;