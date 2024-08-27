import '../styles/global.css';    //this is the only file that is able to import global css

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}