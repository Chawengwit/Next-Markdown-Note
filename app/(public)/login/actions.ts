"use server"

import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

import { sql } from "@/app/lip/server/db";
import config from "@/app/lip/server/config";

const LoginFormSchema = z.object({
    email: z.string().min(1, "email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type State = {
    errors?: {
        email?: string[];
        password?: string[];
    };
    message?: string | null;
    success?: boolean;
}

export async function login(prevState: State, formData: FormData) {
    try {
        const emailValue = formData.get("email")?.toString() ?? "";
        const passwordValue = formData.get("password")?.toString() ?? "";

        const validateFields = LoginFormSchema.safeParse({
            email: emailValue,
            password: passwordValue,
        });

        if(!validateFields.success){
            return {
                errors: validateFields.error.flatten().fieldErrors,
                message: "Missing fields. Failed to login.",
            }
        }

        const userRes = await sql(
            "SELECT * FROM users WHERE email = $1",
            [emailValue]
        );

        if(userRes.rowCount === 0){
            return {
                message: "User not found.",
                errors: {
                    email: ["User not found."],
                },
            }
        }

        const user = userRes.rows[0];
        const isMatch = await bcrypt.compare(passwordValue, user.password_hash)

        if(isMatch){
            const token = await new SignJWT({})
                .setProtectedHeader({
                    alg: "HS256",
                    typ: "JWT",
                })
                .setSubject(String(user.id))
                .setIssuedAt()
                .setExpirationTime("2w")
                .sign(new TextEncoder().encode(config.JWT_SECRET));

            (await cookies()).set("jwt-token", token, {
                sameSite: "strict",
                httpOnly: true,
                secure: true,
            });

            return {
                success: true,
                message: "Login successful",
            };
        }

        return {
            message: "Invalid credentials. Failed to login.",
            errors: {
                password: ["Invalid password."],
            },
        }
    } catch (error) {
        console.error("Login error:", error);
        return {
            message: "An unexpected error occurred. Please try again.",
        };
    }
}