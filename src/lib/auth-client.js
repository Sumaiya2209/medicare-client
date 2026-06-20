import { createAuthClient } from "better-auth/react"

const client = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
})

export const authClient = client
export const { signIn, signUp, signOut, useSession } = client

