import 'bootstrap/dist/css/bootstrap.css'
import Head from 'next/head';
import '../styles/Err404.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/Extra/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
