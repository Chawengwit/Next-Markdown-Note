"user service";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { errors, SignJWT } from "jose";
import { cookies } from "next/headers";

import { sql } from "@/app/lip/server/db";
import config from "@/app/lip/server/config";

const SignupSchema = z.object({
    email: z.string().min(1, "email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
});

export type State = {
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message?: string | null;
    success?: boolean;
}

export async function signup(prevState: State, formData: FormData) {
    try {
        const emailValue = formData.get("email")?.toString() ?? "";
        const passwordValue = formData.get("password")?.toString() ?? "";
        const confirmPasswordValue = formData.get("confirmPassword")?.toString() ?? "";

        const validateFields = SignupSchema.safeParse({
            email: emailValue,
            password: passwordValue,
            confirmPassword: confirmPasswordValue,
        });
        
        if(!validateFields.success){
            return {
                errors: validateFields.error.flatten().fieldErrors,
                message: "Missing fields. Failed to sign up.",
            }
        }

        if(passwordValue !== confirmPasswordValue){
            return {
                errors: {
                    confirmPassword: ["Passwords do not match."],
                },
                message: "Passwords do not match. Failed to sign up.",
            }
        }

        const exitingUserRes = await sql(
            "SELECT * FROM users WHERE email = $1",
            [emailValue]
        );

        if(exitingUserRes.rowCount != null && exitingUserRes.rowCount > 0){
            return {
                message: "Email is already registered.",
                errors: {
                    email: ["Email is already registered."],
                },
            }
        }

        const hashedPassword = await bcrypt.hash(passwordValue, config.SALT_ROUNDS);

        const newUserRes = await sql(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
            [emailValue, hashedPassword]
        );

        if(newUserRes.rowCount === 1){
            const token = await new SignJWT({})
                .setProtectedHeader({
                    alg: "HS256",
                    typ: "JWT",
                })
                .setSubject(String(newUserRes.rows[0].id))
                .setIssuedAt()
                .setExpirationTime("2w")
                .sign(new TextEncoder().encode(config.JWT_SECRET));

            (await cookies()).set("jwt-token", token, {
                sameSite: "strict",
                httpOnly: true,
                secure: true,
            });

            return {
                message: "Sign up successful.",
                success: true,
            }
        }

        return {
            message: "Failed to sign up. Please try again.",
            errors: {
                default: ["Failed to sign up. Please try again."],
            },
        }

    } catch (error) {
        console.error("Signup error:", error);
        return {
            message: "An unexpected error occurred. Please try again later.",
        }
    }

}