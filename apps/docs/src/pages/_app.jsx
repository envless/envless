import { Inter } from '@next/font/google'
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'
import 'ui/styles/zoom.css'

const font = Inter({ subsets: ['latin'], weight: '400' })

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('hashChangeStart', onRouteChange)
Router.events.on('routeChangeComplete', onRouteChange)
Router.events.on('routeChangeError', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()

  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>Envless</title>
        ) : (
          <title>{`${pageProps.title} - Envless`}</title>
        )}
        <meta name="description" content={pageProps.description} />
      </Head>
      <MDXProvider components={mdxComponents}>
        <Layout {...pageProps} className={font.className}>
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
    </>
  )
}
