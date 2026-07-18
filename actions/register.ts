"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/zod";
import { boolean } from "zod";

export async function registerAction(data: any) {
    const validatedFields = RegisterSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Validation failed" };
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "Користувач вже існує" };

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                siteId: "PACKLAB",
                discount: 0,
                emailVerified: null,
                image: ""
            },
        });
        return { success: true };
    } catch (error) {
        return { error: "Користувач вже існує" };
    }
}