"use server"

import * as SwapiSchema from "@/generated/swapiSchema"
import schemasConfig from "@/swapi/schemas-config"
import { unstable_cache } from "next/cache"
import { z } from "zod"
import { SchemaMapByUrl, SwapiPageResponse, swapiPageSchema } from "./types"

const revalidationTime = 3600

export const fetchSwapi = async <T extends keyof SchemaMapByUrl>(
  resource: T,
  { page }: { page: number },
) =>
  unstable_cache(
    async (resource) => {
      const response = await fetch(
        `${process.env.SWAPI_URL}${resource}?page=${page}`,
      )

      const name = schemasConfig.find((s) => s.url === resource)!.name
      const schema = SwapiSchema[`${name}Schema`]

      if (!response.ok) {
        return swapiPageSchema(z.array(schema)).parse({
          status: "failure",
          error: {
            message: `Failed to fetch resource: ${resource}`,
            status: response.status,
          },
        }) as SwapiPageResponse<T>
      }

      const data = await response.json()

      return swapiPageSchema(z.array(schema)).parse({
        status: "success",
        data,
      }) as SwapiPageResponse<T>
    },
    [resource, page.toString()],
    {
      revalidate: revalidationTime,
      tags: [resource, page.toString()],
    },
  )(resource)
