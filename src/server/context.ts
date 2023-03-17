import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getCsrfToken, getSession } from 'next-auth/react';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: CreateNextContextOptions) {
  const session = await getSession({ req: opts.req });
  const csrfToken = await getCsrfToken({ req: opts.req }); // this way isn't correct

  return {
    session,
    csrfToken
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

export interface ICSRFToken {
  csrfToken?: string
}


// todo: csrf token 
export const CSRFValidate = (csrfToken?: string, input?: string) => {
  //console.log(csrfToken,input);
  if (!csrfToken || !input || csrfToken !== input) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "CSRF token not valid"
    })
  }
}

