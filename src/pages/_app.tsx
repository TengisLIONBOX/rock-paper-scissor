import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Хайч чулуу даавуу</title>
        <meta name="description" content="Хайч чулуу даавуу тоглоцгоё" />
        <meta name="author" content="Тэмүүлэн" />
        <meta name="og:type" content="card" />
        <meta name="og:title" content="Хайч чулуу даавуу" />
        <meta name="og:description" content="Хайч чулуу даавуу тоглоцгоё" />
        <meta name="og:image" content="/poster.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/fav/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/fav/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/fav/favicon-16x16.png"
        />
        <link rel="manifest" href="/fav/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
