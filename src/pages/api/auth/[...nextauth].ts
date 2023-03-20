// next-auth
import NextAuth from "next-auth";
import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// few provider for next-auth
import CredentialsProvider from 'next-auth/providers/credentials';
import GooogleProvider from "next-auth/providers/google";
import AppleProvider from 'next-auth/providers/apple';
import FacebookProvider from 'next-auth/providers/facebook';
import GithubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';

//prisma
import prisma from "@/../lib/prismadb";

// utils
import { /* acccountUser, sessionUser, */ signIn } from "@/utils/auth/credentials";
import { CredentialsValidator } from "@/model/user";
import { prismaExec } from "@/utils/prisma";
import { Account, Session } from "@prisma/client";


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma), // Configure adapter
    /* secret: "buhrr2nhWS5t/JUL8pXDZRyBvevGDj0ImGAbo1tnL5I=", */ //for production , "openssl rand -base64 32"
    providers: [ // Configure one or more authentication providers
        GooogleProvider({
            name: "Google",
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),/*
        FacebookProvider({
            name: "Facebook",
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
        }),
        AppleProvider({
            name: "Apple",
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET,
        }),
        GithubProvider({
            name: "Github",
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        EmailProvider({ //email provider
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM
        }), */
        CredentialsProvider({
            name: "Credentials", // The name to display on the sign in form (e.g. "Sign in with...")
            type: "credentials",
            credentials: { // custom
                email: { label: "email", type: "email", placeholder: "jsmith@email.com" },
                password: { label: "Password", type: "password", placeholder: "******" },
            },
            async authorize(credentials, req) {

                //validate in safe parse
                const validate = CredentialsValidator.safeParse({ email: credentials?.email, password: credentials?.password });
                if (validate.success) {
                    const resp = await signIn(validate.data);
                    return resp; // user or null
                }
                return null; // with null will displayed an error on credentials

            }
        })
        // ...add more providers here
    ],
    session: {
        strategy: process.env.STRATEGY
    },
    jwt: {
        secret: process.env.SECRET
    },
    //useSecureCookies: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
    pages: {
        //signIn: '/auth/signin',  // Displays signin buttons
        // signOut: '/auth/signout', // Displays form with sign out button
        //error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // Used for check email page
        // newUser: null // If set, new users will be directed here on first sign in
    },
    callbacks: {
        /*  async signIn({ user, account, profile, email, credentials }) {
 
             if (user.email) {
                 const resp = await acccountUser(user.email, account as Account);
                 return resp ? true : false;
             }
             return false;
         },
         async jwt({ token, user, account, profile, isNewUser }) { 
             return token; 
         },
         async session({ session, token, user }) {
 
             console.log(session.expires, token.token);
             if (token.email) {
                 const ses = await sessionUser(token.email, session.expires, token.token);
                 console.log(ses);
             }
             return session;
         }, */
        //async redirect({ url, baseUrl }) { return baseUrl },
    },
    events: {
    }, // Events are useful for logging (https://next-auth.js.org/configuration/events)
    theme: {
        colorScheme: "auto"
    },
    debug: true, // Enable debug messages in the console if you are having problems
    logger: {
        error(code, metadata) {
            console.log(code, metadata)
        },
        warn(code) {
            console.log(code)
        },
        debug(code, metadata) {
            console.log(code, metadata)
        }
    }
}

export default NextAuth(authOptions);