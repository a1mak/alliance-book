"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { Funnel } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface FilterColumnProps {
  name?: string
  paramName: string
  options: string[]
}

export const FilterColumn: React.FC<FilterColumnProps> = ({
  name,
  paramName,
  options,
}) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleFilter = (option: string, checked: Checked) => {
    const params = new URLSearchParams(searchParams)

    params.set("page", "1")

    if (checked) {
      params.append(paramName, option)
    } else {
      const currentGender = params.getAll(paramName)
      params.delete(paramName)
      currentGender.forEach((item) => {
        if (item !== option) {
          params.append(paramName, item)
        }
      })
    }

    replace(`${pathname}?${params.toString()}`)
  }
  const selectedOptions = useMemo(() => {
    const selected = searchParams.getAll(paramName)
    return selected.length > 0 ? selected : []
  }, [paramName, searchParams])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="transition-colors ease-in duration-200"
        >
          <Funnel
            className={cn({ "fill-amber-400": selectedOptions.length > 0 })}
          />
          {name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selectedOptions.includes(option)}
            onCheckedChange={(checked) => handleFilter(option, checked)}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
