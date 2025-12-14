import { z } from "zod";

export const changePasswordFormSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
  confirmNewPassword: z.string().min(1),
});

export type ChangePasswordForm = z.infer<typeof changePasswordFormSchema>;
