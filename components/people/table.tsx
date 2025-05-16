import { Avatar } from "@/components/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchSwapiAllPages } from "@/lib/swapi/fetch"
import { MessageBox } from "../message-box"
import { FilterColumn } from "./filter-column"
import { Pagination } from "./pagination"
import React from "react"

const ITEMS_PER_PAGE = 10
const columns: PeopleTableWrapperProps["cols"] = {
  photo: { name: "Photo", className: "w-16" },
  name: { name: "Name" },
  birth_year: { name: "Birth Year", className: "w-1/8" },
  hair_color: {
    name: "Hair Color",
    className: "w-1/8",
  },
  gender: {
    name: "Gender",
    className: "w-1/8",
  },
}

interface PeopleTableProps {
  page: number
  search?: string
  gender?: string | string[]
  hairColor?: string | string[]
}

export const PeopleTable: React.FC<PeopleTableProps> = async ({
  page,
  search,
  gender,
  hairColor,
}) => {
  const response = await fetchSwapiAllPages("/people")

  const renderTableMessage = (children: React.ReactNode) => (
    <PeopleTableWrapper cols={columns}>
      <TableRow>
        <TableCell colSpan={5}>{children}</TableCell>
      </TableRow>
    </PeopleTableWrapper>
  )

  if (response.status === "failure") {
    return renderTableMessage(
      <MessageBox
        title={response.error.status.toString()}
        message={response.error.message}
        type="error"
      />,
    )
  }

  const { results: people } = response.data
  const filteredPeople = people
    .filter((person) => {
      if (search) {
        return person.name.toLowerCase().includes(search.toLowerCase())
      }
      return true
    })
    .filter((person) => {
      if (gender) {
        return Array.isArray(gender)
          ? gender.includes(person.gender)
          : person.gender === gender
      }

      return true
    })
    .filter((person) => {
      const personHairColor = person.hair_color.split(", ")
      if (Array.isArray(hairColor) && hairColor.length > 0) {
        return hairColor.some((color) => personHairColor.includes(color))
      }
      if (typeof hairColor === "string") {
        return personHairColor.includes(hairColor)
      }
      return true
    })
  const peoplePage = filteredPeople.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  )
  const genders = Array.from(new Set(people.map((person) => person.gender)))
  const hairColors = Array.from(
    new Set(people.map((person) => person.hair_color.split(", ")).flat()),
  )
  const totalPages = Math.ceil(filteredPeople.length / ITEMS_PER_PAGE)

  columns.hair_color.filter = { values: hairColors }
  columns.gender.filter = { values: genders }

  if (filteredPeople.length === 0) {
    return renderTableMessage(
      <MessageBox
        title="No results found"
        message="No people found matching your search criteria."
        type="info"
      />,
    )
  }

  return (
    <>
      <PeopleTableWrapper cols={columns}>
        {peoplePage.map((person) => (
          <TableRow key={person.name}>
            <TableCell>
              <Avatar
                personId={person.url.split("/").slice(-2, -1)[0]}
                alt={person.name}
              />
            </TableCell>
            <TableCell className="font-bold">{person.name}</TableCell>
            <TableCell>{person.birth_year}</TableCell>
            <TableCell className="px-4">{person.hair_color}</TableCell>
            <TableCell className="px-4">{person.gender}</TableCell>
          </TableRow>
        ))}
      </PeopleTableWrapper>
      <Pagination totalPages={totalPages} />
    </>
  )
}

interface PeopleTableWrapperProps {
  cols: Record<
    string,
    {
      name: string
      className?: string
      filter?: { values: string[] }
    }
  >
  children: React.ReactNode
}

const PeopleTableWrapper: React.FC<PeopleTableWrapperProps> = ({
  cols,
  children,
}) => {
  return (
    <div className="mt-4 border-1 shadow-xs rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="!bg-slate-200">
            {Object.entries(cols).map(([key, col]) => (
              <TableHead key={col.name} className={col.className}>
                {col.filter ? (
                  <FilterColumn
                    name={col.name}
                    paramName={key}
                    options={col.filter.values}
                  />
                ) : (
                  col.name
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  )
}
