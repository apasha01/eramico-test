import { z } from "zod";

export const publicInformationFormSchema = z.object({
  Title: z.string().min(1),
  Code: z.string().min(1),
  RegistrationCode: z.string(),
  NationalCode: z.string(),
  EconomyCode: z.string(),
  Email: z.string(),
  Address: z.string(),
  Telephone: z.string(),
  Fax: z.string(),
  Webpage: z.string(),
  CEOName: z.string(),
  CEOPhone: z.string(),
  CEOEmail: z.string(),
  ShortIntroduction: z.string(),
});

export type PublicInformationForm = z.infer<typeof publicInformationFormSchema>;
