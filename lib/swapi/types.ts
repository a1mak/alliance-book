import * as SwapiSchema from "@/generated/swapiSchema"
import schemasConfig from "@/swapi/schemas-config"
import { z } from "zod"

export const createSwapiPageSchema = <T extends z.ZodObject<z.ZodRawShape>>(
  results: z.ZodArray<T>,
) =>
  z.discriminatedUnion("status", [
    z.object({
      status: z.literal("success"),
      data: z
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
        .describe("A page of results from the SWAPI API."),
    }),
    z.object({
      status: z.literal("failure"),
      error: z
        .object({
          message: z.string(),
          status: z.number(),
        })
        .describe("An error object from the SWAPI API."),
    }),
  ])

export type SwapiPageSchema<T extends z.ZodObject<z.ZodRawShape>> = z.infer<
  ReturnType<typeof createSwapiPageSchema<T>>
>
export type SchemaMapByUrl = {
  [K in (typeof schemasConfig)[number] as Lowercase<
    K["url"]
  >]: (typeof SwapiSchema)[`${K["name"]}Schema`]
}
export type SwapiPageResponse<T extends keyof SchemaMapByUrl> = SwapiPageSchema<
  SchemaMapByUrl[T]
>
export type FetchSwapiConfig = {
  page: number
  search?: string
}
