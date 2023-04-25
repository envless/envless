import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

const ActiveLink = ({ children, activeClassName, className, ...props }) => {
  const { asPath, isReady } = useRouter()
  const [computedClassName, setComputedClassName] = useState(className)

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(props.as || props.href, location.href)
        .pathname

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, location.href).pathname

      const newClassName =
        linkPathname === activePathname
          ? `${className} ${activeClassName}`.trim()
          : className

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName)
      }
    }
  }, [
    asPath,
    isReady,
    props.as,
    props.href,
    activeClassName,
    className,
    computedClassName,
  ])

  return (
    <Link className={computedClassName} {...props}>
      {children}
    </Link>
  )
}

export default ActiveLink
