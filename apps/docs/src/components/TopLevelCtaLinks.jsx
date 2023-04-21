import {
  Zap,
  Home,
  Pencil,
  LayoutGrid,
  LayoutList,
  ShieldCheck,
  HeartHandshake,
  GitPullRequest,
} from 'lucide-react'

import Link from 'next/link'

export function TopLevelCtaLinks(props) {
  return (
    <>
      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300 text-zinc-800 transition-colors duration-150 dark:bg-teal-400/30 dark:text-teal-400">
          <Home className="h-4 w-4" />
        </button>
        <Link href="/" className="text-sm font-semibold ">
          Home
        </Link>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300 text-zinc-800 transition-colors duration-150 dark:bg-teal-400/30 dark:text-teal-400">
          <ShieldCheck className="h-4 w-4" />
        </button>
        <a href="/" className="text-sm font-semibold ">
          Security
        </a>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300 text-zinc-800 transition-colors duration-150 dark:bg-teal-400/30 dark:text-teal-400">
          <LayoutGrid className="h-4 w-4" />
        </button>
        <a href="/" className="text-sm font-semibold ">
          Features
        </a>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300 text-zinc-800 transition-colors duration-150 dark:bg-teal-400/30 dark:text-teal-400">
          <LayoutList className="h-4 w-4" />
        </button>
        <Link
          href="https://envless.dev/changelog"
          className="text-sm font-semibold "
        >
          Changelog
        </Link>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300 text-zinc-800 transition-colors duration-150 dark:bg-teal-400/30 dark:text-teal-400">
          <Zap className="h-4 w-4" />
        </button>
        <a href="/" className="text-sm font-semibold ">
          Quickstart
        </a>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300 text-zinc-800 transition-colors duration-150 dark:bg-teal-400/30 dark:text-teal-400">
          <HeartHandshake className="h-4 w-4" />
        </button>
        <a href="/" className="text-sm font-semibold ">
          Community
        </a>
      </li>

      <li className="relative mb-8 mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-300 text-zinc-800 transition-colors duration-150 dark:bg-teal-400/30 dark:text-teal-400">
          <GitPullRequest className="h-4 w-4" />
        </button>
        <a href="/" className="text-sm font-semibold ">
          Contribution
        </a>
      </li>
    </>
  )
}
