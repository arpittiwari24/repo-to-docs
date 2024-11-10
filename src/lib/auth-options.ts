import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions, User } from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    id?: string;
  }
  interface Session {
    user: User;
  }
}

const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID ?? "",
          clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
          accessTokenUrl: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=jaimatadi&redirect_uri=http://localhost:9999/api/auth/callback/github`,
          authorization : {
            params : {
                scope : 'repo user'
            }
          },
          async profile(profile, tokens) {
            return {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              image: profile.avatar_url,
              accessToken: tokens.access_token
            }
          },
        })
      ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    },
    callbacks: {
        jwt({ token, user }) {
          if (user) { // User is available during sign-in
            token.id = user.id
            token.accessToken = user.accessToken
          }
          return token
        },
        session({ session, token }) {
          if (session.user) {
            session.user.accessToken = token.accessToken as string
          }
          return session
        },
      },
    };

export default authOptions;