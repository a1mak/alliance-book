"use client"

import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export const Search: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value
      const params = new URLSearchParams(searchParams)

      params.set("page", "1")

      if (query) {
        params.set("search", query)
      } else {
        params.delete("search")
      }

      replace(`${pathname}?${params.toString()}`)
    },
    300,
  )

  return (
    <div className="flex items-center justify-center relative">
      <Input
        type="text"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={searchParams.get("search") ?? undefined}
      />
    </div>
  )
}
