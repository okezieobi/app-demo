import { z } from "zod";
import js_levenshtein from "js-levenshtein";

export const InsertUserSchema = z.object({
  account_name: z.string().transform((arg) => arg.toLowerCase()),
});
export type InsertUser = z.infer<typeof InsertUserSchema>;

export const ValidateAcctSchema = z.object({
  account_number: z.number().int().min(10),
  bank_code: z.number().int().min(1),
});
export type ValidateAcct = z.infer<typeof ValidateAcctSchema>;

export const ValidateUserSchema = ValidateAcctSchema.merge(InsertUserSchema);
export type ValidateUser = z.infer<typeof ValidateUserSchema>;

export const ValidateAcctNameSchema = z
  .object({
    validated: z.string(),
    input: z.string(),
  })
  .refine((obj) => js_levenshtein(obj.input, obj.input) > 2, {
    message: "User account name supplied does not match validated results",
  });
