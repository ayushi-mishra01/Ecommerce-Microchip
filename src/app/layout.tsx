// 'use client'
// import React from 'react'
// import { Metadata } from 'next'

// import { AdminBar } from './_components/AdminBar'
// import { Footer } from './_components/Footer'
// import { Header } from './_components/Header'
// import { Providers } from './_providers'
// import { InitTheme } from './_providers/Theme/InitTheme'
// import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

// import './_css/app.scss'
// import useWeglotScript from './useWeglotScript'
// export default async function RootLayout({ children }: { children: React.ReactNode }) {

//   useWeglotScript(); 
//   // useEffect(() => {
//   //   const script = document.createElement('script');
//   //   script.src = 'https://cdn.weglot.com/weglot.min.js';
//   //   script.async = true;
//   //   script.onload = () => {
//   //     if (typeof window !== 'undefined' && window.Weglot) {
//   //       window.Weglot.initialize({
//   //         api_key: 'wg_be7ebbaadfb1440097a7c172e9d482821',
//   //       });
//   //     }
//   //   };
//   //   document.head.appendChild(script);
    
//   //   return () => {
//   //     document.head.removeChild(script);
//   //   };
//   // }, []); 

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         <InitTheme />
//         <link rel="icon" href="/favicon-logo2.png" sizes="32x32" />
//         {/* <link rel="icon" href="/favicon.svg" type="image/svg+xml" /> */}
//         <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
//         {/* <script
//           type="text/javascript"
//           src="https://cdn.weglot.com/weglot.min.js"
//           async
//         ></script>
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               Weglot.initialize({
//                 api_key: 'wg_be7ebbaadfb1440097a7c172e9d482821'
//               });
//             `,
//           }}
//         ></script> */}
//       </head>
//       <body >
//         <Providers>
//           <AdminBar />
//           {/* <div className="scaled-container"> */}
//           <div className = "content-container" >
//           {/* @ts-expect-error */}
//           <Header />
//           {children}
//           </div>
//           {/* @ts-expect-error */}
//           <Footer />
//           {/* </div> */}
//         </Providers>
//       </body>
//     </html>
//   )
// }

// // export const metadata: Metadata = {
// //   metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
// //   twitter: {
// //     card: 'summary_large_image',
// //     creator: '@payloadcms',
// //   },
// //   openGraph: mergeOpenGraph(),
// // }
// RootLayout.js
import React from 'react'
import { Metadata } from 'next'

import { AdminBar } from './_components/AdminBar'
import { Footer } from './_components/Footer'
import { Header } from './_components/Header'
import { Providers } from './_providers'
import { InitTheme } from './_providers/Theme/InitTheme'
import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

import './_css/app.scss'

import dynamic from 'next/dynamic'

// Dynamically import the ClientWeglotScript component
const ClientWeglotScript = dynamic(() => import('./useWeglotScript'), {
  ssr: false,  // This ensures the component is only rendered on the client side
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon-logo2.png" sizes="32x32" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Providers>
          <AdminBar />
          {/* <div className="content-container"> */}
            {/* @ts-expect-error */}
            <Header />
            {children}
          {/* </div> */}
          {/* @ts-expect-error */}
          <Footer />
        </Providers>

        {/* Include the client-side Weglot script */}
        <ClientWeglotScript />
      </body>
    </html>
  )
}


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
  openGraph: mergeOpenGraph(),
}