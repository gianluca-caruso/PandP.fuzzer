import GlobalProvider from '@/context/global';
import UserProvider from '@/context/user';
import { Provider } from 'react-redux';
import { store } from '@/reducer/store';
import type { AppProps } from 'next/app';
import { trpc } from '../utils/trpc';

import "../styles/globals.css";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {

  return (
    <Provider store={store}>
      <GlobalProvider {...{ session }}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </GlobalProvider>
    </Provider>

  );
};

export default trpc.withTRPC(MyApp);