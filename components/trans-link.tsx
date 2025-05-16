"use client"

import { useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  showLoader?: boolean
  disabled?: boolean
}

export const TransLink: React.FC<TransLinkProps> = ({
  href,
  children,
  replace,
  showLoader = true,
  disabled = false,
  className,
  ...propsRest
}) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Link
      href={href}
      onClick={(event) => {
        event.preventDefault()

        if (isPending || disabled) return

        startTransition(() => {
          router[replace ? "replace" : "push"](href.toString())
        })
      }}
      className={cn(`relative`, className, {
        "cursor-default bg-slate-300 hover:bg-slate-300": isPending || disabled,
      })}
      {...propsRest}
    >
      {children}
      {isPending && showLoader && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-300 opacity-90" />
          <Loader2 className="h-5 w-5 animate-spin inline" />
        </div>
      )}
    </Link>
  )
}
