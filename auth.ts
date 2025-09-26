import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getErrorMessage } from "./lib/utils/getErrorMessage";
import { AxiosErrorResponse } from "./lib/utils/AxiosErrorResponse";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Define valid roles
const validRoles = ["PCO", "Wellness", "IOCR", "Settlement", "Psychosocial", "Youth", "SALP", "GBV", "Training", "Policy", "receptionist", "Admin"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
      },

      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${BASE_URL}/auth/login`,
            {
              password: credentials?.password,
              email: credentials?.email,
            },
          );

          if (res.data && res.data.success) {
            const userData = res.data.user;
            const tokens = res.data;

            console.log("this is the response data ", res.data);

            // Validate role
            const userRole = userData.role || "";
            if (!validRoles.includes(userRole)) {
              throw new Error("Invalid user role");
            }

            // Return user object with proper typing
            return {
              id: userData._id || "",
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || "",
              role: userRole,
              accessToken: tokens.accessToken || "",
              refreshToken: tokens.refreshToken || "",
            };
          }
        } catch (error: any) {
          const errorMessage =
            getErrorMessage({ message: error as AxiosErrorResponse }) ??
            "Login failed. Please try again.";
          
          // Remove toast.error as it cannot be used on server side
          console.error(`Login Error: ${errorMessage}`);
          
          throw new Error(
            error?.response?.data?.message ?? "Incorrect email or password"
          );
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/auth/signin") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return !!auth;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        // Type assertion to ensure proper typing
        const typedUser = user as any;
        token.id = typedUser.id;
        token.firstName = typedUser.firstName;
        token.lastName = typedUser.lastName;
        token.email = typedUser.email;
        token.role = typedUser.role;
        token.accessToken = typedUser.accessToken;
        token.refreshToken = typedUser.refreshToken;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        id: token.id as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        email: token.email as string,
        role: token.role as string,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        emailVerified: token.emailVerified && typeof token.emailVerified === "string"
          ? new Date(token.emailVerified)
          : null,
      };
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
});