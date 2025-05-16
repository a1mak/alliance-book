"use client"

import { TransLink } from "@/components/trans-link"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

const NavButton: React.FC<{
  children: React.ReactNode
  href: string
  disabled?: boolean
}> = ({ children, href, disabled }) => {
  return (
    <TransLink
      href={href}
      className="px-1 py-1 bg-amber-400 text-white rounded hover:bg-slate-600"
      disabled={disabled}
    >
      {children}
    </TransLink>
  )
}

export const Pagination: React.FC<{ totalPages: number }> = ({
  totalPages,
}) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const currentPage = Number(searchParams.get("page")) || 1

  const constructPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(page))
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-between mt-4 gap-1">
      <span className="mx-2">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <NavButton href={constructPageUrl(1)} disabled={currentPage === 1}>
          <ChevronFirst />
        </NavButton>
        <NavButton
          href={constructPageUrl(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </NavButton>
        <NavButton
          href={constructPageUrl(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </NavButton>
        <NavButton
          href={constructPageUrl(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronLast />
        </NavButton>
      </div>
    </div>
  )
}
