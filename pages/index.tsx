import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Envless | OpenSource, frictionless and secure way to share and manage app secrets across teams.</title>
        <meta name="description" content="OpenSource, frictionless and secure way to share and manage app secrets across teams." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link className="" href="/auth">Get Started</Link>
      <br />
      <Link className="" href="/console">Console</Link>
    </div>
  )
}
