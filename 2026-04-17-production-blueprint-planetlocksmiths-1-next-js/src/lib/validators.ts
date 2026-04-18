import { z } from "zod";

export const contactRequestSchema = z.object({
  name: z.string().trim().max(120).optional(),
  phone: z.string().trim().min(7).max(40),
  service: z.string().trim().min(2).max(120),
  vehicle: z.string().trim().max(160).optional(),
  location: z.string().trim().max(180).optional(),
  message: z.string().trim().max(1200).optional(),
  website: z.string().trim().max(0).optional()
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
