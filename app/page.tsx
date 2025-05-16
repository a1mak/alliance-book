import { PeopleTable } from "@/components/people/table"
import { Suspense } from "react"

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const currentPage = Number((await props.searchParams).page) || 1

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PeopleTable page={currentPage} />
      </Suspense>
    </div>
  )
}
