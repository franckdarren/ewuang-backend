import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(2, "Le nom est trop court"),
    email: z.string().email("Email invalide")
});
