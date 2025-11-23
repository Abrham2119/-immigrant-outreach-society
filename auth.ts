import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Define valid roles - UPDATED with Personnel Admin
const validRoles = ["PCO", "Wellness", "IOCR", "Settlement", "Psychosocial", "Youth", "SALP", "GBV", "Training", "Policy", "receptionist", "Admin", "Personnel Admin"];

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

    console.log("API Response:", res.data);

    if (res.data && res.data.success) {
      const userData = res.data.user;
      const tokens = res.data;

      // Validate role - update to match API response
      const validRoles = ["PCO", "Wellness", "IOCR", "Settlement", "Psychosocial", "Youth", "SALP", "GBV", "Training", "Policy", "Receptionist", "Admin", "Personnel Admin"];
      const userRole = userData.role || "";
      
      if (!validRoles.includes(userRole)) {
        console.error("Invalid role:", userRole);
        throw new Error("Invalid user role");
      }

      // Return user object - THIS MUST BE RETURNED
      return {
        id: userData._id || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        role: userRole,
        accessToken: tokens.accessToken || "",
        refreshToken: tokens.refreshToken || "",
      };
    } else {
      // Handle case where success is false
      throw new Error(res.data?.message || "Login failed");
    }
  } catch (error: any) {
    console.error("Login error details:", error.response?.data || error.message);
    
    // Provide more specific error messages
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        "Login failed. Please try again.";
    
    throw new Error(errorMessage);
  }
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