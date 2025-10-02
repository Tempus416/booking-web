import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!, // v4 style
      authorization: {
        params: {
          // Requests your API scope so the access token is issued for your API
          scope: `openid profile email api://${process.env.AZURE_AD_API_CLIENT_ID}/booking.readwrite`,
        },
      },
    }),
  ],
  session: { strategy: "jwt" },

  // Localhost-friendly cookie (non-secure). Remove/adjust for production.
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: false },
    },
  },

  debug: true,

  callbacks: {
    async jwt({ token, account }) {
      // Persist access token from Azure AD on sign-in
      if (account?.access_token) token.accessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      // Expose access token to the client for FE→API calls during dev
      // @ts-ignore
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
