import { z } from "zod"
export const PersonSchema = z
  .object({
    starships: z
      .array(z.any())
      .describe("An array of starship resources that this person has piloted"),
    edited: z
      .string()
      .datetime({ offset: true })
      .describe(
        "the ISO 8601 date format of the time that this resource was edited.",
      ),
    name: z.string().describe("The name of this person."),
    created: z
      .string()
      .datetime({ offset: true })
      .describe(
        "The ISO 8601 date format of the time that this resource was created.",
      ),
    url: z.string().url().describe("The url of this resource"),
    gender: z.string().describe("The gender of this person (if known)."),
    vehicles: z
      .array(z.any())
      .describe("An array of vehicle resources that this person has piloted"),
    skin_color: z.string().describe("The skin color of this person."),
    hair_color: z.string().describe("The hair color of this person."),
    height: z.string().describe("The height of this person in meters."),
    eye_color: z.string().describe("The eye color of this person."),
    mass: z.string().describe("The mass of this person in kilograms."),
    films: z
      .array(z.any())
      .describe(
        "An array of urls of film resources that this person has been in.",
      ),
    species: z
      .array(z.any())
      .describe("The url of the species resource that this person is."),
    homeworld: z
      .string()
      .describe("The url of the planet resource that this person was born on."),
    birth_year: z
      .string()
      .describe(
        "The birth year of this person. BBY (Before the Battle of Yavin) or ABY (After the Battle of Yavin).",
      ),
  })
  .describe("A person within the Star Wars universe")
export type Person = z.infer<typeof PersonSchema>

export const PlanetsSchema = z
  .object({
    diameter: z.string().describe("The diameter of this planet in kilometers."),
    climate: z
      .string()
      .describe("The climate of this planet. Comma-seperated if diverse."),
    surface_water: z
      .string()
      .describe(
        "The percentage of the planet surface that is naturally occuring water or bodies of water.",
      ),
    name: z.string().describe("The name of this planet."),
    created: z
      .string()
      .datetime({ offset: true })
      .describe(
        "The ISO 8601 date format of the time that this resource was created.",
      ),
    url: z.string().url().describe("The hypermedia URL of this resource."),
    rotation_period: z
      .string()
      .describe(
        "The number of standard hours it takes for this planet to complete a single rotation on its axis.",
      ),
    edited: z
      .string()
      .datetime({ offset: true })
      .describe(
        "the ISO 8601 date format of the time that this resource was edited.",
      ),
    terrain: z
      .string()
      .describe("the terrain of this planet. Comma-seperated if diverse."),
    gravity: z
      .string()
      .describe(
        "A number denoting the gravity of this planet. Where 1 is normal.",
      ),
    orbital_period: z
      .string()
      .describe(
        "The number of standard days it takes for this planet to complete a single orbit of its local star.",
      ),
    films: z
      .array(z.any())
      .describe(
        "An array of Film URL Resources that this planet has appeared in.",
      ),
    residents: z
      .array(z.any())
      .describe("An array of People URL Resources that live on this planet."),
    population: z
      .string()
      .describe(
        "The average populationof sentient beings inhabiting this planet.",
      ),
  })
  .describe("A planet.")
export type Planets = z.infer<typeof PlanetsSchema>
