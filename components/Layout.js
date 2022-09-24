import { Component } from 'react'
import Footer from './Footer'

const Layout=({children}) =>{
    if(Component.getLayout){
        return Component.getLayout(
            <Component {...pageProps}/>
        )
    }
return(
    <>
    {children}
    
    <Footer/>
    </>
)

}
export default Layout