import * as SwapiSchema from "@/generated/swapiSchema"
import schemasConfig from "@/swapi/schemas-config"
import { z } from "zod"

export const createSwapiPageSchema = <T extends z.ZodObject<z.ZodRawShape>>(
  results: z.ZodArray<T>,
) =>
  z.object({
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

export type SwapiPageSchema<T extends z.ZodObject<z.ZodRawShape>> = z.infer<
  ReturnType<typeof createSwapiPageSchema<T>>
>
export type SchemaMapByUrl = {
  [K in (typeof schemasConfig)[number] as Lowercase<
    K["url"]
  >]: (typeof SwapiSchema)[`${K["name"]}Schema`]
}
export type SwapiPageResponse<T extends keyof SchemaMapByUrl> =
  | {
      status: "success"
      data: SwapiPageSchema<SchemaMapByUrl[T]>
    }
  | {
      status: "failure"
      error: {
        message: string
        status: number
      }
    }
export type FetchSwapiConfig = {
  page: number
  search?: string
}
