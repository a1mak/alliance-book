import { Search } from "@/components/people/search"
import { PeopleTable } from "@/components/people/table"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"
import { SearchParams } from "./_types"

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = SearchParams.parse(await props.searchParams)

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
        <PeopleTable
          page={searchParams.page}
          search={searchParams.search}
          gender={searchParams.gender}
          hairColor={searchParams.hair_color}
        />
      </Suspense>
    </div>
  )
}
