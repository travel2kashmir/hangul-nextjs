import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import '../pages/themes/classictheme.css'
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
import Layout from '../components/Layout'
import Router from "next/router";
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  if (Component.getLayout){
    return Component.getLayout(<Component{...pageProps} />)
  }
  
  return(
    
    <Layout>
       <Component {...pageProps} />
    </Layout>
   
  )
}

export default MyApp
