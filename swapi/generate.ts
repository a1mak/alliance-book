import prettierConfig from "@/.prettierrc.json"
import "@/dotenv.config"
import { mkdirSync, writeFileSync } from "fs"
import { JsonSchema, jsonSchemaToZod } from "json-schema-to-zod"
import path from "path"
import { format } from "prettier"
import schemaConfigs from "./schemas-config"

const outputDir = "./generated"

async function generateZodSchema() {
  const fetchTasks = schemaConfigs.map(async (schema) => {
    const res = await fetch(
      path.join(process.env.SWAPI_URL ?? "", schema.url, "schema"),
    )
    const jsonSchema = await res.json()

    return jsonSchemaToZod(jsonSchema as JsonSchema, {
      module: "esm",
      name: `${schema.name}Schema`,
      type: schema.name,
      noImport: true,
    })
  })

  const schemas = await Promise.all(fetchTasks)

  const zodSchemaModule = await format(
    `import { z } from "zod"\n${schemas.join("\n")}`,
    {
      parser: "typescript",
      ...prettierConfig,
    },
  )

  mkdirSync(outputDir, { recursive: true })
  writeFileSync(`${outputDir}/swapiSchema.ts`, zodSchemaModule, "utf-8")

  console.log("Schema imported successfully")
}

generateZodSchema()
