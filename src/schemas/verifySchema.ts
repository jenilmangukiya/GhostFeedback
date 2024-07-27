import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().length(6, "Code must be the size of 6 character long"),
});
