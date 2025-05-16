# Alliance Book

A modern web application that integrates with the Star Wars API (SWAPI), using Next.js, TypeScript, and Zod for schema validation.  
This project includes tooling to generate Zod schemas from SWAPI's JSON schemas for type-safe API integration.

---

## Tech Stack

- **TypeScript** – Type-safe JavaScript
- **Next.js** – React framework for server-side rendering and static site generation
- **Zod** – TypeScript-first schema validation
- **json-schema-to-zod** – Converts JSON Schema to Zod schemas
- **SWAPI** – Star Wars API integration

---

## Scripts

Available scripts in `package.json`:

| Script     | Description                                 |
| ---------- | ------------------------------------------- |
| `dev`      | Start Next.js development server            |
| `build`    | Build the application for production        |
| `start`    | Start the production server                 |
| `lint`     | Run ESLint on the project                   |
| `generate` | Generate Zod schemas from SWAPI JSON schema |

---

## Installation

1. **Clone the repository:**

   ```sh
   git clone <repo-url>
   cd alliance-book
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env.local`:
     ```sh
     cp .env.example .env.local
     ```
   - Edit `.env.local` and set the required values (e.g., `SWAPI_URL`).

   > **Note:** The `.env.local` file is **not** tracked by git. You must create it yourself.

---

## Running the Project

- **Development server:**

  ```sh
  pnpm run dev
  ```

  Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Generate Zod schemas:**

  ```sh
  pnpm run generate
  ```

  This fetches JSON schemas from SWAPI and generates Zod schemas in `./generated/swapiSchema.ts`.

- **Lint and format:**
  ```sh
  pnpm run lint
  pnpm run format
  ```

---

## How Zod Schema Generation Works

The script at [`swapi/generate.ts`](swapi/generate.ts) fetches JSON schemas from SWAPI endpoints defined in [`swapi/schemas-config.ts`](swapi/schemas-config.ts), converts them to Zod schemas using `json-schema-to-zod`, formats the result with Prettier, and writes the output to `generated/swapiSchema.ts`.

The generated Zod schemas are then used in the application for type-safe API integration.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Zod Documentation](https://zod.dev/)
- [SWAPI](https://swapi.dev/)
