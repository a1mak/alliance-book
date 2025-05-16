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

const revalidationTime = 3600

export const fetchSwapi = async <T extends keyof SchemaMapByUrl>(
  resource: T,
  { page, search }: FetchSwapiConfig,
) =>
  unstable_cache(
    async (resource: T) => {
      const searchParams = new URLSearchParams([["page", page.toString()]])

      if (search) {
        searchParams.append("search", search)
      }

      const url = new URL(`${process.env.SWAPI_URL}${resource}`)
      url.search = searchParams.toString()

      const response = await fetch(url)

      const name = schemasConfig.find((s) => s.url === resource)!.name
      const schema = SwapiSchema[`${name}Schema`]
      const swapiPageSchema = createSwapiPageSchema(z.array(schema))

      if (!response.ok) {
        return swapiPageSchema.parse({
          status: "failure",
          error: {
            message: `Failed to fetch resource: ${resource}`,
            status: response.status,
          },
        }) as SwapiPageResponse<T>
      }

      const data = await response.json()

      return swapiPageSchema.parse({
        status: "success",
        data,
      }) as SwapiPageResponse<T>
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
