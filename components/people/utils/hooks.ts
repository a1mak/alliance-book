import { Person } from "@/generated/swapiSchema"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

const ITEMS_PER_PAGE = 10

export const usePeople = (people: Person[]) => {
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page")) || 1
  const search = searchParams.get("search") || ""
  const gender = searchParams.getAll("gender")
  const hairColor = searchParams.getAll("hair_color")

  const filteredPeople = useMemo(() => {
    return people
      .filter((person) => {
        if (!search) {
          return true
        }

        return person.name.toLowerCase().includes(search.toLowerCase())
      })
      .filter((person) => {
        if (!gender.length) {
          return true
        }

        return Array.isArray(gender)
          ? gender.includes(person.gender)
          : person.gender === gender
      })
      .filter((person) => {
        if (!hairColor.length) {
          return true
        }

        const personHairColor = person.hair_color.split(", ")

        return hairColor.some((color) => personHairColor.includes(color))
      })
  }, [people, search, gender, hairColor])

  const [peoplePage, totalPages] = useMemo(() => {
    return [
      filteredPeople.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
      Math.ceil(filteredPeople.length / ITEMS_PER_PAGE),
    ]
  }, [filteredPeople, page])

  return { peoplePage, totalPages }
}
