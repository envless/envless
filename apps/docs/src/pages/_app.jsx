import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'
import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import OgImage from '@/images/og.png'

import '@/styles/tailwind.css'
import 'focus-visible'
// import 'ui/styles/zoom.css'
import '@/styles/zoom.css'

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('hashChangeStart', onRouteChange)
Router.events.on('routeChangeComplete', onRouteChange)
Router.events.on('routeChangeError', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()
  const title =
    router.pathname === '/'
      ? 'Envless Docs'
      : `${pageProps.title} - Envless Docs`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageProps.description} />
        <meta name="title" content={title} />

        {/* Open Graph / Facebook */}

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://envless.dev/docs" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={pageProps.description} />
        <meta property="og:image" content={OgImage.src} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://envless.dev/docs" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={pageProps.description} />
        <meta property="twitter:image" content={OgImage.src} />
      </Head>
      <MDXProvider components={mdxComponents}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
    </>
  )
}
