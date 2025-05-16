"use client"

import { Avatar } from "@/components/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Person } from "@/generated/swapiSchema"
import React, { useMemo, useState } from "react"
import { MessageBox } from "../message-box"
import { FilterColumn } from "./filter-column"
import { Pagination } from "./pagination"
import { PersonDetailsDialog } from "./person-details-dialog"
import { Search } from "./search"
import { useFilters } from "./utils/use-filters"

const columns: PeopleTableWrapperProps["cols"] = {
  photo: { name: "Photo", className: "w-16" },
  name: { name: "Name" },
  birth_year: { 
    name: "Birth Year", 
    className: "w-1/8 hidden md:table-cell" 
  },
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
  people: Person[]
}

export const PeopleTable: React.FC<PeopleTableProps> = ({ people }) => {
  const { itemsPage: peoplePage, totalPages } = useFilters(people)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const extendedColumns = useMemo(
    () => ({
      ...columns,
      hair_color: {
        ...columns.hair_color,
        filter: {
          values: Array.from(
            new Set(
              people.map((person) => person.hair_color.split(", ")).flat(),
            ),
          ),
        },
      },
      gender: {
        ...columns.gender,
        filter: {
          values: Array.from(new Set(people.map((person) => person.gender))),
        },
      },
    }),
    [people],
  )

  return (
    <>
      <Search placeholder="Search people..." />
      <PeopleTableWrapper cols={extendedColumns}>
        {peoplePage.length === 0 && (
          <TableRow>
            <TableCell colSpan={5}>
              <MessageBox
                title="No results found"
                message="No people found matching your search criteria."
                type="info"
              />
            </TableCell>
          </TableRow>
        )}
        {peoplePage.map((person) => (
          <TableRow
            key={person.name}
            className="animate-in slide-in-from-bottom-5 fade-in duration-300 cursor-pointer hover:bg-slate-100 focus:outline-none focus:bg-slate-100"
            onClick={() => setSelectedPerson(person)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setSelectedPerson(person)
              }
            }}
            tabIndex={0}
          >
            <TableCell>
              <Avatar
                personId={person.url.split("/").slice(-2, -1)[0]}
                alt={person.name}
              />
            </TableCell>
            <TableCell className="font-bold">{person.name}</TableCell>
            <TableCell className="hidden md:table-cell">{person.birth_year}</TableCell>
            <TableCell className="px-4">{person.hair_color}</TableCell>
            <TableCell className="px-4">{person.gender}</TableCell>
          </TableRow>
        ))}
      </PeopleTableWrapper>
      <Pagination totalPages={totalPages} />
      <PersonDetailsDialog
        person={selectedPerson}
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
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
