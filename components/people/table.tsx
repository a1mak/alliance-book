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
import { Pagination } from "./pagination"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle } from "lucide-react"

const ITEMS_PER_PAGE = 10

interface PeopleTableProps {
  page: number
}

export const PeopleTable: React.FC<PeopleTableProps> = async ({ page }) => {
  const response = await fetchSwapi("/people", {
    page,
  })

  if (response.status === "failure") {
    return (
      <PeopleTableWrapper>
        <TableRow>
          <TableCell colSpan={4}>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{response.error.status}</AlertTitle>
              <AlertDescription>{response.error.message}</AlertDescription>
            </Alert>
          </TableCell>
        </TableRow>
      </PeopleTableWrapper>
    )
  }

  const { count, results: people } = response.data
  const totalPages = Math.ceil(count / ITEMS_PER_PAGE)

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
