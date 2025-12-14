import { z } from "zod";

export const replyAdvertiseFormSchema = z.object({
  description: z.string(),
  companyId: z.coerce.number(),
  amount: z.coerce.number().min(1),
  unitPropertyId: z.coerce.number().min(1),
});

export const replyInquiryFormSchema = z
  .object({
    days: z.coerce.number().nullable(),
    companyId: z.coerce.number(),
    price: z.coerce.number().nullable(),
    isAgreemental: z.boolean(),
    unitPropertyId: z.coerce.number().nullable(),
  })
  .refine(
    (data) => {
      if (!data.isAgreemental) {
        return data.price !== null;
      }
      return true;
    },
    {
      path: ["price"],
    }
  )
  .refine(
    (data) => {
      if (!data.isAgreemental) {
        return data.unitPropertyId !== null;
      }
      return true;
    },
    {
      path: ["unitPropertyId"],
    }
  );

export type ReplyAdvertiseForm = z.infer<typeof replyAdvertiseFormSchema>;
export type ReplyInquiryForm = z.infer<typeof replyInquiryFormSchema>;
