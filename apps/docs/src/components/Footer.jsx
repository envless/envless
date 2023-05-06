import { Button } from '@/components/Button'
import { navigation } from '@/components/Navigation'
import GithubIcon from '@/components/icons/GithubIcon'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { forwardRef, Fragment, useState } from 'react'

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="10" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6.75 10.813 2.438 2.437c1.218-4.469 4.062-6.5 4.062-6.5"
      />
    </svg>
  )
}

function FeedbackButton(props) {
  return (
    <button
      type="submit"
      className="px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
      {...props}
    />
  )
}

const FeedbackForm = forwardRef(function FeedbackForm({ onSubmit }, ref) {
  return (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className="absolute inset-0 flex items-center justify-center gap-6 md:justify-start"
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Was this page helpful?
      </p>
      <div className="group grid h-8 grid-cols-[1fr,1px,1fr] overflow-hidden rounded-full border border-zinc-900/10 dark:border-white/10">
        <FeedbackButton data-response="yes">Yes</FeedbackButton>
        <div className="bg-zinc-900/10 dark:bg-white/10" />
        <FeedbackButton data-response="no">No</FeedbackButton>
      </div>
    </form>
  )
})

const FeedbackThanks = forwardRef(function FeedbackThanks(_props, ref) {
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex justify-center md:justify-start"
    >
      <div className="flex items-center gap-3 rounded-full bg-teal-50/50 py-1 pl-1.5 pr-3 text-sm text-teal-900 ring-1 ring-inset ring-teal-500/20 dark:bg-teal-500/5 dark:text-teal-400 dark:ring-teal-500/30">
        <CheckIcon className="h-5 w-5 flex-none fill-teal-500 stroke-white dark:fill-teal-200/20 dark:stroke-teal-200" />
        Thanks for your feedback!
      </div>
    </div>
  )
})

function Feedback() {
  let [submitted, setSubmitted] = useState(false)

  function onSubmit(event) {
    event.preventDefault()

    // event.nativeEvent.submitter.dataset.response
    // => "yes" or "no"

    setSubmitted(true)
  }

  return (
    <div className="relative h-8">
      <Transition
        show={!submitted}
        as={Fragment}
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        leave="pointer-events-none duration-300"
      >
        <FeedbackForm onSubmit={onSubmit} />
      </Transition>
      <Transition
        show={submitted}
        as={Fragment}
        enterFrom="opacity-0"
        enterTo="opacity-100"
        enter="delay-150 duration-300"
      >
        <FeedbackThanks />
      </Transition>
    </div>
  )
}

function PageLink({ label, page, previous = false }) {
  return (
    <>
      <Button
        href={page.href}
        aria-label={`${label}: ${page.title}`}
        variant="secondary"
        arrow={previous ? 'left' : 'right'}
      >
        {page.title}
      </Button>
      {/* <Link
        href={page.href}
        tabIndex={-1}
        aria-hidden="true"
        className="text-base font-semibold text-zinc-900 transition hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
      >
        {page.title}
      </Link> */}
    </>
  )
}

function PageNavigation() {
  let router = useRouter()
  let allPages = navigation.flatMap((group) => group.links)
  let currentPageIndex = allPages.findIndex(
    (page) => page.href === router.pathname
  )

  if (currentPageIndex === -1) {
    return null
  }

  let previousPage = allPages[currentPageIndex - 1]
  let nextPage = allPages[currentPageIndex + 1]

  if (!previousPage && !nextPage) {
    return null
  }

  return (
    <div className="flex">
      {previousPage && (
        <div className="flex flex-col items-start gap-3">
          <PageLink label="Previous" page={previousPage} previous />
        </div>
      )}
      {nextPage && (
        <div className="ml-auto flex flex-col items-end gap-3">
          <PageLink label="Next" page={nextPage} />
        </div>
      )}
    </div>
  )
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M16.712 6.652c.01.146.01.29.01.436 0 4.449-3.267 9.579-9.242 9.579v-.003a8.963 8.963 0 0 1-4.98-1.509 6.379 6.379 0 0 0 4.807-1.396c-1.39-.027-2.608-.966-3.035-2.337.487.097.99.077 1.467-.059-1.514-.316-2.606-1.696-2.606-3.3v-.041c.45.26.956.404 1.475.42C3.18 7.454 2.74 5.486 3.602 3.947c1.65 2.104 4.083 3.382 6.695 3.517a3.446 3.446 0 0 1 .94-3.217 3.172 3.172 0 0 1 4.596.148 6.38 6.38 0 0 0 2.063-.817 3.357 3.357 0 0 1-1.428 1.861 6.283 6.283 0 0 0 1.865-.53 6.735 6.735 0 0 1-1.62 1.744Z" />
    </svg>
  )
}

function DiscordIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M16.238 4.515a14.842 14.842 0 0 0-3.664-1.136.055.055 0 0 0-.059.027 10.35 10.35 0 0 0-.456.938 13.702 13.702 0 0 0-4.115 0 9.479 9.479 0 0 0-.464-.938.058.058 0 0 0-.058-.027c-1.266.218-2.497.6-3.664 1.136a.052.052 0 0 0-.024.02C1.4 8.023.76 11.424 1.074 14.782a.062.062 0 0 0 .024.042 14.923 14.923 0 0 0 4.494 2.272.058.058 0 0 0 .064-.02c.346-.473.654-.972.92-1.496a.057.057 0 0 0-.032-.08 9.83 9.83 0 0 1-1.404-.669.058.058 0 0 1-.029-.046.058.058 0 0 1 .023-.05c.094-.07.189-.144.279-.218a.056.056 0 0 1 .058-.008c2.946 1.345 6.135 1.345 9.046 0a.056.056 0 0 1 .059.007c.09.074.184.149.28.22a.058.058 0 0 1 .023.049.059.059 0 0 1-.028.046 9.224 9.224 0 0 1-1.405.669.058.058 0 0 0-.033.033.056.056 0 0 0 .002.047c.27.523.58 1.022.92 1.495a.056.056 0 0 0 .062.021 14.878 14.878 0 0 0 4.502-2.272.055.055 0 0 0 .016-.018.056.056 0 0 0 .008-.023c.375-3.883-.63-7.256-2.662-10.246a.046.046 0 0 0-.023-.021Zm-9.223 8.221c-.887 0-1.618-.814-1.618-1.814s.717-1.814 1.618-1.814c.908 0 1.632.821 1.618 1.814 0 1-.717 1.814-1.618 1.814Zm5.981 0c-.887 0-1.618-.814-1.618-1.814s.717-1.814 1.618-1.814c.908 0 1.632.821 1.618 1.814 0 1-.71 1.814-1.618 1.814Z" />
    </svg>
  )
}

function SlackIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M6.52739 14.5138C6.52739 15.5969 5.64264 16.4816 4.55959 16.4816C3.47654 16.4816 2.5918 15.5969 2.5918 14.5138C2.5918 13.4308 3.47654 12.546 4.55959 12.546H6.52739V14.5138ZM7.51892 14.5138C7.51892 13.4308 8.40366 12.546 9.48671 12.546C10.5698 12.546 11.4545 13.4308 11.4545 14.5138V19.4409C11.4545 20.524 10.5698 21.4087 9.48671 21.4087C8.40366 21.4087 7.51892 20.524 7.51892 19.4409V14.5138ZM9.48671 6.52739C8.40366 6.52739 7.51892 5.64264 7.51892 4.55959C7.51892 3.47654 8.40366 2.5918 9.48671 2.5918C10.5698 2.5918 11.4545 3.47654 11.4545 4.55959V6.52739H9.48671ZM9.48671 7.51892C10.5698 7.51892 11.4545 8.40366 11.4545 9.48671C11.4545 10.5698 10.5698 11.4545 9.48671 11.4545H4.55959C3.47654 11.4545 2.5918 10.5698 2.5918 9.48671C2.5918 8.40366 3.47654 7.51892 4.55959 7.51892H9.48671ZM17.4732 9.48671C17.4732 8.40366 18.3579 7.51892 19.4409 7.51892C20.524 7.51892 21.4087 8.40366 21.4087 9.48671C21.4087 10.5698 20.524 11.4545 19.4409 11.4545H17.4732V9.48671ZM16.4816 9.48671C16.4816 10.5698 15.5969 11.4545 14.5138 11.4545C13.4308 11.4545 12.546 10.5698 12.546 9.48671V4.55959C12.546 3.47654 13.4308 2.5918 14.5138 2.5918C15.5969 2.5918 16.4816 3.47654 16.4816 4.55959V9.48671ZM14.5138 17.4732C15.5969 17.4732 16.4816 18.3579 16.4816 19.4409C16.4816 20.524 15.5969 21.4087 14.5138 21.4087C13.4308 21.4087 12.546 20.524 12.546 19.4409V17.4732H14.5138ZM14.5138 16.4816C13.4308 16.4816 12.546 15.5969 12.546 14.5138C12.546 13.4308 13.4308 12.546 14.5138 12.546H19.4409C20.524 12.546 21.4087 13.4308 21.4087 14.5138C21.4087 15.5969 20.524 16.4816 19.4409 16.4816H14.5138Z"></path>
    </svg>
  )
}

function SocialLink({ href, icon: Icon, children, target = '_blank' }) {
  return (
    <Link href={href} className="group" target={target}>
      <span className="sr-only">{children}</span>
      <Icon className="h-5 w-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500" />
    </Link>
  )
}

function SmallPrint() {
  return (
    <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 dark:border-white/5 sm:flex-row">
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        &copy; Envless {new Date().getFullYear()}. All rights reserved.
      </p>
      <div className="flex gap-4">
        <SocialLink href="https://twitter.com/envless" icon={TwitterIcon}>
          Follow @envless on Twitter
        </SocialLink>
        <SocialLink href="https://github.com/envless/envless" icon={GithubIcon}>
          Star envless/envless GitHub
        </SocialLink>
        <SocialLink href="https://dub.sh/envless-discord" icon={DiscordIcon}>
          Join our Discord server
        </SocialLink>

        <SocialLink href="https://dub.sh/envless-slack" icon={SlackIcon}>
          Join our Slack
        </SocialLink>
      </div>
    </div>
  )
}

export function Footer() {
  let router = useRouter()

  return (
    <footer className="mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <Feedback key={router.pathname} />
      <PageNavigation />
      <SmallPrint />
    </footer>
  )
}
