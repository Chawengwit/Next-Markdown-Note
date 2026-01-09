"use client"

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { signup, State } from "./action";

export default function SignupForm(){
    const initialState: State = {
        message: "",
        errors: {},
    };

    const [state, dispatch] = useActionState(signup, initialState);

    useEffect(() => {
        if (state.success) {
            window.location.href = "/dashboard";
        }
    }, [state.success]);

    return (
        <div className="flex flex-col gap-2 w-full">
            <h1 className="p-2 font-bold text-center text-yellow-300">Sign Up</h1>
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
                <div>
                    <label>Password</label>
                    <input 
                        id="password"
                        name="password"
                        type="text" 
                        className="bg-blue-700 p-2 text-white block w-full"
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="text" 
                        className="bg-blue-700 p-2 text-white block w-full" 
                    />
                </div>
                <button type="submit" className="bg-green-600 p-2 font-bold text-white">Submit</button>  
            </form>
        </div>
    );
}