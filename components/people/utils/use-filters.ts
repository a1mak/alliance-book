import { Person } from "@/generated/swapiSchema"
import { useMemo } from "react"
import { useUrlParams } from "./use-url-params"

const ITEMS_PER_PAGE = 10

export const useFilters = (items: Person[]) => {
  const { params } = useUrlParams()

  const page = Number(params.get("page")) || 1
  const search = params.get("search") || ""
  const gender = params.getAll("gender")
  const hairColor = params.getAll("hair_color")

  const filteredItems = useMemo(() => {
    let filteredItems = items

    if (search) {
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (gender.length) {
      filteredItems = filteredItems.filter((item) =>
        gender.includes(item.gender),
      )
    }

    if (hairColor.length) {
      filteredItems = filteredItems.filter((item) => {
        const itemHairColor = item.hair_color.split(", ")

        return hairColor.some((color) => itemHairColor.includes(color))
      })
    }

    return filteredItems
  }, [items, search, gender, hairColor])

  const [itemsPage, totalPages] = useMemo(() => {
    return [
      filteredItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
      Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
    ]
  }, [filteredItems, page])

  return { itemsPage, totalPages }
}
