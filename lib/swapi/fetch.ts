"use server"

import * as SwapiSchema from "@/generated/swapiSchema"
import schemasConfig from "@/swapi/schemas-config"
import { unstable_cache } from "next/cache"
import { z } from "zod"
import {
  FetchSwapiConfig,
  SchemaMapByUrl,
  SwapiPageResponse,
  createSwapiPageSchema,
} from "./types"

const revalidationTime = 1

const catchError = <T>(
  promise: Promise<T>,
): Promise<
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: Error }
> => {
  return promise.then(
    (data) => ({ success: true, data }),
    (error) => ({ success: false, error }),
  )
}

export const fetchSwapi = async <T extends keyof SchemaMapByUrl>(
  resource: T,
  { page, search }: FetchSwapiConfig,
) =>
  unstable_cache(
    async (resource: T): Promise<SwapiPageResponse<T>> => {
      const createError = (status: number = 500): SwapiPageResponse<T> => ({
        status: "failure",
        error: {
          message: `Failed to fetch resource: ${resource}`,
          status,
        },
      })
      const searchParams = new URLSearchParams([["page", page.toString()]])

      if (search) {
        searchParams.append("search", search)
      }

      const url = new URL(`${process.env.SWAPI_URL}${resource}`)
      url.search = searchParams.toString()

      const {
        success: fetchSuccess,
        error: fetchError,
        data: response,
      } = await catchError(fetch(url))

      if (!fetchSuccess) {
        console.error("Failed to fetch resource", fetchError)
        return createError(500)
      }

      const name = schemasConfig.find((s) => s.url === resource)!.name
      const schema = SwapiSchema[`${name}Schema`]
      const swapiPageSchema = createSwapiPageSchema(z.array(schema))

      if (!response.ok) {
        console.error(
          `Failed to fetch resource: ${resource}\n ${response.status} : ${response.statusText}`,
        )
        return createError(response.status)
      }

      const {
        success: jsonSuccess,
        error: jsonError,
        data: jsonData,
      } = await catchError(response.json())

      if (!jsonSuccess) {
        console.error("Failed to parse response", jsonError)
        return createError(500)
      }

      const {
        error: parseError,
        data: parsedData,
        success: parseSuccess,
      } = swapiPageSchema.safeParse(jsonData)

      if (!parseSuccess) {
        console.error("Failed to validate response", parseError)
        return createError(500)
      }

      return {
        status: "success",
        data: parsedData,
      }
    },
    [resource, page.toString(), search ?? ""],
    {
      revalidate: revalidationTime,
      tags: [resource, page.toString(), search ?? ""],
    },
  )(resource)

export const fetchSwapiAllPages = async <T extends keyof SchemaMapByUrl>(
  resource: T,
) =>
  unstable_cache(
    async (resource: T) => {
      const response = await fetchSwapi(resource, {
        page: 1,
      })

      if (response.status === "failure") {
        return {
          error: response.error,
          status: response.status,
        }
      }

      const { count, results } = response.data
      const totalPages = Math.ceil(count / results.length)

      const peopleRestResponses = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          fetchSwapi(resource, {
            page: i + 2,
          }),
        ),
      )

      peopleRestResponses.forEach((response) => {
        if (response.status === "failure") {
          return
        }
        results.push(...response.data.results)
      })

      return { data: { results, count }, status: "success" as const }
    },
    [resource],
    {
      revalidate: revalidationTime,
      tags: [resource],
    },
  )(resource)
