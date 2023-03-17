import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create();
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
      email: ctx.session.user.email //short way
    }
  });
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

export const privateProcedure = t.procedure.use(isAuthed);