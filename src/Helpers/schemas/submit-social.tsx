import { z } from "zod";

export const submitPostSchema = z.object({
  context: z.string().min(1),
  companyId: z
    .union([z.string(), z.number()])
    .transform((val) => (val ? Number(val) : 0)), // اگر خالی بود 0
  productIds: z.array(z.number()),
});

export const submitVoteSchema = z.object({
  title: z.string().min(1),
companyId: z.coerce.number().default(0),
  categoryIds: z.array(z.number()),
  // options: z.array(z.object({ title: z.string() })),
});

export type SubmitPost = z.infer<typeof submitPostSchema>;
export type SubmitVote = z.infer<typeof submitVoteSchema>;
