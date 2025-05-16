import { MessageBox } from "@/components/message-box"
import { PeopleTable } from "@/components/people/table"
import { fetchSwapiAllPages } from "@/lib/swapi/fetch"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"
export default async function Home() {
  const response = await fetchSwapiAllPages("/people")

  if (response.status === "failure") {
    return (
      <MessageBox
        title={response.error.status.toString()}
        message={response.error.message}
        type="error"
      />
    )
  }

  const { results: people } = response.data

  return (
    <div className="container mx-auto p-4">
      <Suspense
        fallback={
          <div className="flex justify-center">
            <Loader2 className=" my-20 h-15 w-15 animate-spin inline" />
          </div>
        }
      >
        <PeopleTable people={people} />
      </Suspense>
    </div>
  )
}
