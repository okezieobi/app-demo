import { z } from "zod";

export const IsEmail = z.object({
  email: z.string().email(),
});
