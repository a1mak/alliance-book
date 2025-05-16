import * as SwapiSchema from "@/generated/swapiSchema"
import schemasConfig from "@/swapi/schemas-config"
import { z } from "zod"

export const swapiPageSchema = <T extends z.ZodObject<z.ZodRawShape>>(
  results: z.ZodArray<T>,
) =>
  z
    .object({
      count: z.number(),
      next: z
        .string()
        .url()
        .startsWith(process.env.SWAPI_URL ?? "")
        .nullable(),
      previous: z
        .string()
        .url()
        .startsWith(process.env.SWAPI_URL ?? "")
        .nullable(),
      results,
    })
    .describe("A page of results from the SWAPI API.")

export type SwapiPageSchema = z.infer<ReturnType<typeof swapiPageSchema>>
export type SchemaMapByUrl = {
  [K in (typeof schemasConfig)[number] as Lowercase<K["url"]>]: z.infer<
    (typeof SwapiSchema)[`${K["name"]}Schema`]
  >
}
export type SwapiPageResponse<T extends keyof SchemaMapByUrl> = Omit<
  SwapiPageSchema,
  "results"
> & {
  results: SchemaMapByUrl[T][]
}
