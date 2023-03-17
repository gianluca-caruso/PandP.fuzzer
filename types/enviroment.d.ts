namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
        //strategy
        STRATEGY:"jwt" | "database"
        //auth provider
        GOOGLE_ID: string
        GOOGLE_SECRET: string
        APPLE_ID: string
        APPLE_SECRET: string
        GITHUB_ID: string
        GITHUB_SECRET: string
        FACEBOOK_ID: string
        FACEBOOK_SECRET: string
        //bcrypt
        SALT_ROUNDS: number
        DIR_SCRIPT_ZEST: string
        DIR_HAR: string
        DIR_PLAN: string
    }
}