import { Head } from 'next/dist/pages/_document';
import { Html, Main, NextScript } from 'next/document';

export default function Document() {

  return (
      <Html lang="en">
        <Head />
        <body className="flex flex-col justify-center gap-2 m-2 scrollbar-hide">
          <Main />
          <NextScript />
        </body>
      </Html>
  )
}
