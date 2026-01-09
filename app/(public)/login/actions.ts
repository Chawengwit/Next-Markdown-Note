"use server"

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { errors, SignJWT } from "jose";
import { cookies } from "next/headers";

import { sql } from "@/app/lip/server/db";
import config from "@/app/lip/server/config";
import { get } from "http";
import { error } from "console";

const LoginFormSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password is required"),
});

type State = {
    errors?: {
        username?: string[];
        password?: string[];
    };
    message?: string | null;
}

export async function login(prevState: State, formData: FormData) {
    const validateFields = LoginFormSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if(!validateFields.success){
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to login.",
        }
    }

    const username = formData.get("username");
    const password = formData.get("password");

    const userRes = await sql(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );

    if(userRes.rowCount === 0){
        return {
            message: "User not found.",
            errors: {
                username: ["User not found."],
            },
        }
    }

    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password?.toString()!, user.password)

    if(isMatch){
        const token = await new SignJWT({})
            .setProtectedHeader({
                alg: "HS256",
                typ: "JWT",
            })
            .setSubject(user.id)
            .setIssuedAt()
            .setExpirationTime("2w")
            .sign(new TextEncoder().encode(config.JWT_SECRET));

        (await cookies()).set("jwt-token", token, {
            sameSite: "strict",
            httpOnly: true,
            secure: true,
        });

        redirect("/dashboard");
    }

    return {
        message: "Invalid credentials. Failed to login.",
        errors: {
            password: ["Invalid password."],
        },
    }

}