import { router } from '../trpc';
import { fuzzerRouter } from './fuzzer';
import { harRouter } from './har';
import { settingsRouter } from './settings';
import { userRouter } from './user';

export const appRouter = router({
  setting: settingsRouter,
  user: userRouter,
  fuzzer: fuzzerRouter,
  har: harRouter,
  /* plan: planRouter */
});

// export type definition of API
export type AppRouter = typeof appRouter;