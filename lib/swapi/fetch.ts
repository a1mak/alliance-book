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

      if (!response.ok) {
        throw new Error(`Failed to fetch resource: ${resource}`)
      }

      const data = await response.json()

      const name = schemasConfig.find((s) => s.url === resource)!.name
      const schema = SwapiSchema[`${name}Schema`]

      return swapiPageSchema(z.array(schema)).parse(
        data,
      ) as SwapiPageResponse<T>
    },
    [resource, page.toString()],
    {
      revalidate: revalidationTime,
      tags: [resource, page.toString()],
    },
  )(resource)
