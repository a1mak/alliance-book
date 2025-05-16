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
import { useCallback, useMemo } from "react"
import { useUrlParams } from "./utils/use-url-params"

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
  const { params, pushParams } = useUrlParams()

  const handleFilter = useCallback(
    (option: string, checked: Checked) => {
      if (checked) {
        params.append(paramName, option)
      } else {
        const values = params.getAll(paramName)
        params.delete(paramName)
        values.forEach((value) => {
          if (value !== option) {
            params.append(paramName, value)
          }
        })
      }
      params.set("page", "1")
      pushParams({ scroll: false })
    },
    [paramName, params, pushParams],
  )

  const selectedOptions = useMemo(() => {
    return params.getAll(paramName)
  }, [params, paramName])

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
