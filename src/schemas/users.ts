import { z } from "zod";

export const InsertUser = z.object({
  email: z.string().email(),
});

export const VerifyBankAcct = z.object({
  user_account_number: z.number().int(),
  user_account_name: z.string().min(1),
  user_bank_code: z.number().int(),
});
