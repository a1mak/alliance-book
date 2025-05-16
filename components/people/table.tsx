import { Avatar } from "@/components/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchSwapi } from "@/lib/swapi/fetch"
import { MessageBox } from "../message-box"
import { Pagination } from "./pagination"

const ITEMS_PER_PAGE = 10

interface PeopleTableProps {
  page: number
  search?: string
}

export const PeopleTable: React.FC<PeopleTableProps> = async ({
  page,
  search,
}) => {
  const response = await fetchSwapi("/people", {
    page,
    search,
  })

  if (response.status === "failure") {
    return (
      <PeopleTableWrapper>
        <TableRow>
          <TableCell colSpan={4}>
            <MessageBox
              title={response.error.status.toString()}
              message={response.error.message}
              type="error"
            />
          </TableCell>
        </TableRow>
      </PeopleTableWrapper>
    )
  }

  const { count, results: people } = response.data
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE)

  if (people.length === 0) {
    return (
      <PeopleTableWrapper>
        <TableRow>
          <TableCell colSpan={4}>
            <MessageBox
              title="No results found"
              message="No people found matching your search criteria."
              type="info"
            />
          </TableCell>
        </TableRow>
      </PeopleTableWrapper>
    )
  }

  return (
    <>
      <PeopleTableWrapper>
        {people.map((person) => (
          <TableRow key={person.name}>
            <TableCell>
              <Avatar
                personId={person.url.split("/").slice(-2, -1)[0]}
                alt={person.name}
              />
            </TableCell>
            <TableCell className="font-bold">{person.name}</TableCell>
            <TableCell>{person.birth_year}</TableCell>
            <TableCell className="px-4">{person.gender}</TableCell>
          </TableRow>
        ))}
      </PeopleTableWrapper>
      <Pagination totalPages={totalPages} />
    </>
  )
}

const PeopleTableWrapper: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="mt-4 border-1 shadow-xs rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="!bg-slate-200">
            <TableHead className="w-16">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-1/8">Birth Year</TableHead>
            <TableHead className="w-1/8">Gender</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  )
}
