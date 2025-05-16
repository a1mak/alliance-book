import { z } from "zod"

export const SearchParams = z.object({
  page: z.coerce.number().min(1).catch(1),
  search: z.string().optional(),
  gender: z.union([z.array(z.string()), z.string()]).optional(),
  hair_color: z.union([z.array(z.string()), z.string()]).optional(),
})

export type SearchParams = z.infer<typeof SearchParams>
