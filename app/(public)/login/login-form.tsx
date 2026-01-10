"use client"

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { login, State } from "./actions";

export default function LoginForm(){
    const initialState: State = {
        message: "",
        errors: {},
    };

    const [ state, dispatch ] = useActionState(login, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push("/dashboard");
        }
    }, [state?.success, router]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <h1 className="p-2 font-bold text-center text-yellow-300">Log In</h1>
            <form action={dispatch} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label>Email</label>
                    <input 
                        id="email"
                        name="email"    
                        type="text"
                        className="bg-blue-700 p-2 text-white block w-full"
                    />
                </div>
                {state?.errors?.email?.map((error: string, index: number) => 
                    <p key={index} className="text-red-500">{error}</p>
                )}

                <div>
                    <label>Password</label>
                    <input 
                        id="password"
                        name="password"
                        type="password"
                        className="bg-blue-700 p-2 text-white block w-full" />
                </div>
                {state?.errors?.password?.map((error: string, index: number) => 
                    <p key={index} className="text-red-500">{error}</p>
                )}

                <div className="flex gap-2 w-full justify-center">
                    <a type="button" href="/" className="bg-red-600 p-2 font-bold text-white">Back</a>
                    <button type="submit" className="bg-green-600 p-2 font-bold text-white">Submit</button>
                </div>
                {state?.message && <p className="text-red-600">{state?.message}</p>}

            </form>
        </div>
    );
}