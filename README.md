# refine-project

<div align="center" style="margin: 30px;">
    <a href="https://refine.dev">
    <img src="https://refine.ams3.cdn.digitaloceanspaces.com/refine_logo.png"  align="center" />
    </a>
</div>
<br/>

This [refine](https://github.com/pankod/refine) project was generated with [superplate](https://github.com/pankod/refine).

## Getting Started

**refine** is a React-based framework for building data-intensive applications in no time ✨

Refine offers lots of out-of-the box functionality for rapid development, without compromising extreme customizability. Use-cases include, but are not limited to admin panels, B2B applications and dashboards.

## Available Scripts

### Running the development server

```bash
npm run dev
```

### Building for production

```bash
npm run build
```

### Running the production server

```bash
npm run start
```

## Learn More

To learn more about **refine**, please check out the [Documentation](https://refine.dev/docs)

- **Supabase Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Material UI** [Docs](https://refine.dev/docs/ui-frameworks/mui/tutorial/)
- **Inferencer** [Docs](https://refine.dev/docs/packages/documentation/inferencer)
- **i18n** [Docs](https://refine.dev/docs/core/providers/i18n-provider/)

##  Configuration

You need to create a .env file in the root directory of the project and add the following environment variables.

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY
PROJECT_REF=YOUR_SUPABASE_PROJECT_REF
```

Also, you can use the following command to create a .env file from .env.example.

```bash
cp .env.example .env
```

##  Generating Supabase Types

To generate types for your Supabase tables, you can use the following command. When you run this command, it will create a `supabase.ts` file in the `src/types` folder.  Also, you need to set the `PROJECT_REF` environment variable in the `.env` file.

```bash
npm run generate:types
```

### Table Types

You can define types for your tables in a file by importing the `Database` type from the `supabase.ts` file.

```ts
// src/types/index.ts
import { Database } from "./supabase";

type Team = Database["public"]["Tables"]["teams"]["Row"];
```

## License

MIT
