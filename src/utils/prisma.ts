import { PrismaClient } from "@prisma/client";
import { Mutex } from "async-mutex";
import prisma from '../../lib/prismadb';

class Prisma {

    private static instance: Prisma;
    private prismaClient: PrismaClient;
    private mutex: Mutex;

    private constructor() {
        this.prismaClient = prisma as PrismaClient;
        this.mutex = new Mutex();

    }

    public static getInstance() {
        if (this.instance === null || !this.instance) {
            this.instance = new Prisma();
        }
        return this.instance;
    }

    public getPrismaClient() {
        return this.prismaClient;
    }

    public getMutex() {
        return this.mutex;
    }
}


export const prismaExec = async <T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T> => {

    const prisma = Prisma
        .getInstance()
        .getPrismaClient(); // get connection

    const mutex = new Mutex(); // get mutex for the operations

    const release = await mutex.acquire(); // get acquire
    try {
        const data = await callback(prisma); // execute callback and get result in data
        return data;
    } catch (error) {
        console.error(error);
        await prisma.$disconnect(); // in catch must have disconnected before to exit
        throw error as Error;
        //process.exit(1);
    } finally {
        await prisma.$disconnect();
        release(); //put relaese
    }
}