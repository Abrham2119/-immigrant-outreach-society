import { SocialAuthProvider } from "@/domain/entities/auth-provider.type";

export const SOCIAL_AUTH_PROVIDERS: SocialAuthProvider[] = [
    {
        id: "google",
        name: "Google",
        logo: "/assets/logos/google-logo.svg",
        className: "border-[#B4B4B4] border bg-white shadow-md",
    },
    {
        id: "apple",
        name: "Apple",
        logo: "/assets/logos/apple-logo.svg",
        className: "bg-black",
    },
];