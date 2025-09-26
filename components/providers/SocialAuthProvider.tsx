"use client";
import { SOCIAL_AUTH_PROVIDERS } from "@/constants/social-auth-providers";
import type { SocialAuthProvider } from "@/domain/entities/auth-provider.type";
import Image from "next/image";
import { Button } from "../ui/Button/Button";


export function SocialAuthProvider() {

    const handleProviderSignup = (providerId: string) => {
        console.log(`Signing up with provider: ${providerId}`);
        // This function handles authentication with different providers
    };

    return (
        <div className="flex items-center gap-4">
            {SOCIAL_AUTH_PROVIDERS.map((provider: SocialAuthProvider) => (
                <Button
                    key={provider.id}
                    onClick={() => handleProviderSignup(provider.id)}
                    className={`w-[70px]  ${provider.className}`}
                >
                    <Image
                        width={24}
                        height={24}
                        src={provider.logo}
                        alt={`${provider.name} Logo`}
                        className="w-6 h-6"
                    />
                </Button>
            ))}
        </div>
    );
}