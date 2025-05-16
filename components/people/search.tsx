"use client"

import { Input } from "@/components/ui/input"
import { useDebouncedCallback } from "use-debounce"
import { useUrlParams } from "./utils/use-url-params"

export const Search: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const { params, pushParams } = useUrlParams()

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value
      if (query) {
        params.set("search", query)
      } else {
        params.delete("search")
      }
      params.set("page", "1")
      pushParams()
    },
    300,
  )

  return (
    <div className="flex items-center justify-center relative">
      <Input
        type="text"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={params.get("search") ?? undefined}
      />
    </div>
  )
}
