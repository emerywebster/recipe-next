# Tempo Recipe App (Next.js)

## This is a test

This is a recipe management application built with Next.js. It allows users to save, categorize, and search for recipes.

## Migrated from Vite to Next.js

This application has been migrated from a Vite-based React application to Next.js. Key changes include:

- Adoption of the Next.js App Router architecture
- Server-side rendering for improved performance and SEO
- File-based routing system
- Environment variable management via Next.js
- Migration of all UI components to Next.js patterns

## Features

- User authentication via Supabase
- Add and manage recipes
- Filter recipes by tags
- Search functionality
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

### Development

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

### Building for Production

```bash
npm run build
# or
yarn build
```

## Folder Structure

- `/app` - Next.js App Router files and components
  - `/components` - React components
  - `/lib` - Utility functions and helpers
  - `/types` - TypeScript type definitions
- `/public` - Static assets

## Migration Notes

### Path Aliases

We use path aliases to simplify imports. The main aliases are:

- `@/app/*` - Points to the app directory
- `@/app/components/*` - Points to UI components
- `@/app/lib/*` - Points to utility functions

### Authentication

Authentication is handled via Supabase and implemented using React Context. The `AuthProvider` in `app/lib/auth.tsx` provides authentication state and methods throughout the application.

### Data Fetching

Data fetching is primarily done client-side using the Supabase JavaScript client. For improved performance, consider implementing server components for data fetching in future updates.

### UI Components

We use Shadcn UI components, which are built on top of Radix UI and styled with Tailwind CSS. These components are located in `app/components/ui`.

## Migration Status

The migration from Vite to Next.js has been successfully completed. All code has been restructured to follow the Next.js App Router architecture, and the old Vite-based code structure has been removed.

## Deployment

### Vercel Deployment

This application is configured for deployment on Vercel. The configuration includes special handling for Supabase Edge Functions, which use Deno syntax that is incompatible with the Node.js environment used by Vercel for building Next.js applications.

Key deployment files:

- `.vercel/project.json` - Contains Vercel-specific configuration
- `next.config.js` - Includes webpack configuration to exclude Supabase functions
- `tsconfig.json` - Excludes Supabase functions from TypeScript checking

When deploying to Vercel, make sure these configuration files are included in your repository.

### Supabase Edge Functions

The application includes Supabase Edge Functions in the `supabase/functions` directory. These functions should be deployed separately using the Supabase CLI:

```bash
supabase functions deploy parse-recipe
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
