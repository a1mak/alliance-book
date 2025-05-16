import { MessageBox } from "@/components/message-box"
import { Search } from "@/components/people/search"
import { PeopleTable } from "@/components/people/table"
import { fetchSwapiAllPages } from "@/lib/swapi/fetch"
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
      <Search placeholder="Search people..." />
      <PeopleTable people={people} />
    </div>
  )
}
