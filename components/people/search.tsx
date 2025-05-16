"use client"

import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

export const Search: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        const query = event.target.value
        const params = new URLSearchParams(searchParams)

        params.set("page", "1")

        if (query) {
          params.set("search", query)
        } else {
          params.delete("search")
        }

        replace(`${pathname}?${params.toString()}`)
      })
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
      {isPending && (
        <div className="absolute top-0 right-0 bottom-0 px-3 flex items-center justify-center">
          <Loader2 className="ml-2 h-5 w-5 animate-spin inline" />
        </div>
      )}
    </div>
  )
}
