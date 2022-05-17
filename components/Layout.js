import { Component } from 'react'
import Header from './Header'
import SideBar from './Sidebar'
import Footer from './Footer'

const Layout=({children}) =>{
    if(Component.getLayout){
        return Component.getLayout(
            <Component {...pageProps}/>
        )
    }
return(

    <>
    <Header/>
    <SideBar/>
    {children}
    <Footer/>
    </>
)

}
export default Layout