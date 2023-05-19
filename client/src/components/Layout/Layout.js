import React from 'react'
import Header from './Header'
import Footer from './Footer'
import {Helmet,HelmetProvider} from "react-helmet-async";
import { Toaster } from 'react-hot-toast';
const Layout = (props) => {
    return (
        <>
           <HelmetProvider>
            <div className="">
                <Helmet>
                <meta charSet="utf-8" />
                <title>{props.title}</title>
                </Helmet>
                <Header />
                <main style={{minHeight:"80vh"}}>
                    <Toaster/>
                    {props.children}</main>
                <Footer />
            </div>
            </HelmetProvider>
        </>
    )
}

export default Layout