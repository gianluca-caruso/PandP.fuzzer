import { Credentials, UserValidator } from '@/model/user';
import { Account, Session, User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { prismaExec } from '../prisma';


//bcrypt
export const hashPassword = async (password: string): Promise<string> => {

    /* console.log(process.env.SALT_ROUNDS); */
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
}

export const checkPassword = async (password: string, hash: string): Promise<boolean> => {

    try {
        const res = await bcrypt.compare(password, hash);
        return res;
    } catch (error) {
        throw new Error("the password isn't correct");
    }
}

// signIn after validation
export const signIn = async (credentials: Credentials): Promise<User | null> => {

    const { email, password } = credentials;

    const usr = await prismaExec(async (prisma) => {
        return await prisma
            .user
            .findFirst({
                where: {
                    email
                }
            });
    });

    if (usr && usr.password && await checkPassword(password, usr.password)) {
        return usr
    }
    return null;
}

// register after validation
export const register = async (user: UserValidator): Promise<User | null> => {

    const { email, name } = user;

    const password = await hashPassword(user.password); // put hash password in db

    return await prismaExec(async (prisma) => {
        return await prisma
            .user
            .create({
                data: {
                    email,
                    name,
                    password,
                    settings:{
                        create:{
                            theme:"system" //init
                        }
                    }
                }
            });
    });
}


/* export const acccountUser = async (email: string, account: Account) => {

    return await prismaExec(async (prisma) => {
        return await prisma.user.update({
            where: {
                email
            },
            data: {
                accounts: {
                    connectOrCreate: {
                        create: account,
                        where: {
                            provider_providerAccountId: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId
                            }
                        }
                    }
                }
            }
        })
    });
}

export const sessionUser = async (email: string, expires: Date, sessionToken: string) => {

    return await prismaExec(async (prisma) => {
        return await prisma.user.update({
            where: { email },
            data: {
                sessions: {
                    connectOrCreate: {
                        create: { expires, sessionToken },
                        where: { sessionToken }
                    }
                }
            }
        })
    });
} */