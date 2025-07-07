import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts: Bebas Neue example */}
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
        {/* Add other font links here as needed */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
