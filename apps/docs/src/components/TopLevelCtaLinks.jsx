import ActiveLink from './ActiveLink'
import GithubIcon from './icons/GithubIcon'
import {
  Zap,
  Home,
  LayoutGrid,
  LayoutList,
  ShieldCheck,
  HeartHandshake,
  GitPullRequest,
} from 'lucide-react'

export function TopLevelCtaLinks(props) {
  return (
    <>
      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-150 dark:bg-teal-400/20 dark:text-teal-400">
          <Home className="h-4 w-4" />
        </button>
        <ActiveLink
          href="/"
          className="text-sm font-semibold"
          activeClassName="text-teal-400"
        >
          Home
        </ActiveLink>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-150 dark:bg-teal-400/20 dark:text-teal-400">
          <Zap className="h-4 w-4" />
        </button>

        <ActiveLink
          href="/quickstart"
          className="text-sm font-semibold"
          activeClassName="text-teal-400"
        >
          Quickstart
        </ActiveLink>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-150 dark:bg-teal-400/20 dark:text-teal-400">
          <GithubIcon className="h-4 w-4 fill-white dark:fill-teal-400" />
        </button>
        <ActiveLink
          href="https://github.com/envless/envless"
          target="_blank"
          rel="nofollow"
          className="text-sm font-semibold"
          activeClassName="text-teal-400"
        >
          <span className="inline-block">Github</span>
          <img
            className="ml-2 inline-block"
            src="https://img.shields.io/github/stars/envless/envless??style=flat&label=stars&color=16a34a"
            alt="Github"
          />
        </ActiveLink>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-150 dark:bg-teal-400/20 dark:text-teal-400">
          <ShieldCheck className="h-4 w-4" />
        </button>
        <ActiveLink href="/security" className="text-sm font-semibold ">
          Security
        </ActiveLink>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-150 dark:bg-teal-400/20 dark:text-teal-400">
          <LayoutGrid className="h-4 w-4" />
        </button>
        <ActiveLink
          href="/features"
          className="text-sm font-semibold"
          activeClassName="text-teal-400"
        >
          Features
        </ActiveLink>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-150 dark:bg-teal-400/20 dark:text-teal-400">
          <LayoutList className="h-4 w-4" />
        </button>
        <ActiveLink
          href="https://envless.dev/changelog"
          className="text-sm font-semibold"
          activeClassName="text-teal-400"
        >
          Changelog
        </ActiveLink>
      </li>

      <li className="relative mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-150 dark:bg-teal-400/20 dark:text-teal-400">
          <HeartHandshake className="h-4 w-4" />
        </button>
        <ActiveLink
          href="/community"
          className="text-sm font-semibold"
          activeClassName="text-teal-400"
        >
          Community
        </ActiveLink>
      </li>

      <li className="relative mb-8 mt-4 text-zinc-900 hover:text-teal-400 dark:text-white hover:dark:text-teal-400">
        <button className="focus:shadow-outline mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors duration-150 dark:bg-teal-400/20 dark:text-teal-400">
          <GitPullRequest className="h-4 w-4" />
        </button>
        <ActiveLink
          href="/contribution"
          className="text-sm font-semibold"
          activeClassName="text-teal-400"
        >
          Contribution
        </ActiveLink>
      </li>
    </>
  )
}
