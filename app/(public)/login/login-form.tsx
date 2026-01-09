"use client"

import { useActionState } from "react";

import { login, State } from "./actions";

export default function LoginForm(){
    const initialState: State = {
        message: "",
        errors: {},
    };

    const [ state, dispatch ] = useActionState(login, initialState);

    return (
        <div className="flex flex-col gap-2 w-full">
            <h1 className="bg-yellow-300 p-2 font-bold text-center text-black">Log In</h1>
            <form action={dispatch} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label>Username</label>
                    <input 
                        id="username"
                        name="username"    
                        type="text"
                        className="bg-blue-700 p-2 text-white block w-full"
                    />
                </div>
                {state?.errors?.username?.map((error: string, index: number) => 
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

                <button type="submit" className="bg-green-600 p-2 font-bold text-white">Submit</button>
                {state?.message && <p className="text-red-600">{state?.message}</p>}

            </form>
        </div>
    );
}