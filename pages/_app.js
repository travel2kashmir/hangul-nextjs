import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import "../components/css/animate.min.css" ;
import "../components/css/menu.css" ;
import "../components/css/style.css" ;
import "../components/css/responsive.css";
import "../components/css/fontello/css/icon_set_1.css";
import "../components/css/fontello/css/icon_set_2.css";
import "../components/css/fontello/css/fontello.css";
import "../components/css/bootstrap.min.css"
// <!-- SPECIFIC CSS -->
import "../components/css/DateTimePicker.css";
import "../components/css/owl.carousel.css";
import "../components/css/owl.theme.default.css";
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
