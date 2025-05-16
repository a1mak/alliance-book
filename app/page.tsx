import { fetchSwapi } from "@/lib/swapi/fetch"

export default async function Home() {
  const { results: people, count } = await fetchSwapi("/people", {
    page: 1,
  })

  return (
    <div>
      {count} people found
      {people.map((person) => (
        <div key={person.name} className="flex items-center gap-4">
          <span>{person.name}</span>
        </div>
      ))}
    </div>
  )
}
