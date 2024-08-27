import '../styles/global.css';    //this is the only file that is able to import global css
import '../styles/tailwind/output.css';


export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}