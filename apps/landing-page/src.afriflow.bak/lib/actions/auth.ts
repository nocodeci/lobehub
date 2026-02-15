"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export async function registerUser(formData: z.infer<typeof registerSchema>) {
    try {
        const validatedFields = registerSchema.safeParse(formData);

        if (!validatedFields.success) {
            return { error: "Données invalides" };
        }

        const { name, email, password } = validatedFields.data;

        // Check if user already exists
        const existingUser = await (prisma as any).user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Cet email est déjà utilisé" };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await (prisma as any).user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Une erreur est survenue lors de l'inscription" };
    }
}
