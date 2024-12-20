// pages/_app.js
import '../styles/globals.css';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '../i18n'; 


function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
