import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import Router from "next/router";
import React from 'react';


export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);

    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  
  return (
    <SessionProvider session={session}>
      <>
          {loading ? (
            <div style={{width:"100vw", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center"}}>
              
              <p>Loading...</p>
            </div>
            
          ) : (
            <Component {...pageProps} />
          )}
        </>
    </SessionProvider>
  )
  
  
}
