import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must be at least 10 character long")
    .max(200, "Message can not be more then 200 character long"),
});
