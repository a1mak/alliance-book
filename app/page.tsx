import { Search } from "@/components/people/search"
import { PeopleTable } from "@/components/people/table"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const currentPage = Number(searchParams.page) || 1
  const currentSearch = searchParams.search
    ? String(searchParams.search)
    : undefined

  return (
    <div className="container mx-auto p-4">
      <Search placeholder="Search people..." />
      <Suspense
        fallback={
          <div className="flex justify-center">
            <Loader2 className=" my-20 h-15 w-15 animate-spin inline" />
          </div>
        }
      >
        <PeopleTable page={currentPage} search={currentSearch} />
      </Suspense>
    </div>
  )
}
