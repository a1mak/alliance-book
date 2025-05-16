import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const useUrlParams = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { push, replace } = useRouter()
  const params = new URLSearchParams(searchParams)

  return {
    params,
    pathname,
    pushParams: (options?: NavigateOptions) =>
      push(`${pathname}?${params.toString()}`, options),
    replaceParams: (options?: NavigateOptions) =>
      replace(`${pathname}?${params.toString()}`, options),
  }
}
