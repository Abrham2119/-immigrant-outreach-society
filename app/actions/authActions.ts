"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";


export async function handleCredentialsSignin({ verifyToken, password }: {
    verifyToken: string
    password: string
}) {    
    try {
        await signIn("credentials", {
                password,
                token: verifyToken,
                redirect: false,
        });
        
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: 'Invalid credentials',
                    }
                default:
                    return {
                        message: 'Something went wrong.',
                    }
            }
        }
        throw error;
    }
}


export async function handleSignOut() {  
   await signOut();

}