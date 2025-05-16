"use client"

import { Button } from "@/components/ui/button"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useUrlParams } from "./utils/use-url-params"
import { useCallback } from "react"

export const Pagination: React.FC<{ totalPages: number }> = ({
  totalPages,
}) => {
  const { params, pushParams } = useUrlParams()
  const currentPage = Number(params.get("page")) || 1

  const handlePageChange = useCallback(
    (page: number) => {
      params.set("page", String(page))
      pushParams({ scroll: false })
    },
    [params, pushParams],
  )

  return (
    <div className="flex items-center justify-between mt-4 gap-1">
      <span className="mx-2">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <NavButton
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronFirst />
        </NavButton>
        <NavButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </NavButton>
        <NavButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </NavButton>
        <NavButton
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronLast />
        </NavButton>
      </div>
    </div>
  )
}

const NavButton: React.FC<{
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}> = ({ children, onClick, disabled }) => {
  return (
    <Button
      variant="default"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className="bg-amber-400 hover:bg-slate-600 disabled:bg-slate-300 disabled:hover:bg-slate-300"
    >
      {children}
    </Button>
  )
}
