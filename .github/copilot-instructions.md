# Copilot Instructions for vivamente-app-principal

## Project Overview
This is a React + Vite application for the Vivamente platform. The codebase is organized for modularity and scalability, with a focus on user routines, learning modules, and interactive tools.

## Architecture & Key Directories
- `src/components/`: Reusable UI components. Subfolder `ui/` contains atomic design elements (buttons, dialogs, forms, etc.).
- `src/pages/`: Route-level components for main app screens (e.g., `Rotina.jsx`, `AprenderHome.jsx`).
- `src/data/`: Static JSON data for lessons, programs, quizzes, and user tasks. Used for local development and as mock data.
- `src/hooks/`: Custom React hooks for mobile detection, authentication, courses, quizzes, and routines.
- `src/lib/supabaseClient.js`: Supabase integration for backend data and auth.
- `public/`: Static assets (favicon, images).

## Developer Workflows
- **Build:** Use Vite (`npm run build`) for fast builds and hot reloads.
- **Start:** `npm run dev` launches the development server.
- **Lint:** Run `npx eslint .` (config in `eslint.config.js`).
- **No formal test suite** detected; manual testing via UI is standard.

## Patterns & Conventions
- **Component Structure:** Prefer functional components. UI primitives are in `src/components/ui/`, higher-level components in `src/components/`.
- **Data Flow:** Static data is loaded from `src/data/`. Dynamic data and auth use Supabase via `src/lib/supabaseClient.js`.
- **Routing:** Page components in `src/pages/` are mapped to routes (see `main.jsx`).
- **Protected Routes:** Use `ProtectedRoute.jsx` for auth-guarded pages.
- **Styling:** CSS modules (`App.css`, `index.css`) and component-level styles.
- **External Libraries:** Supabase for backend, Vite for build, ESLint for linting.

## Integration Points
- **Supabase:** All backend communication (auth, data) is via `src/lib/supabaseClient.js`.
- **Static Data:** For development, use JSON files in `src/data/`.

## Examples
- To add a new UI element, create it in `src/components/ui/` and import where needed.
- To add a new page, create a component in `src/pages/` and update routing in `main.jsx`.
- For backend calls, use the Supabase client from `src/lib/supabaseClient.js`.

## Tips for AI Agents
- Always check for existing components in `src/components/ui/` before creating new UI primitives.
- Use static data from `src/data/` for mockups and prototyping.
- Follow the functional component and hooks pattern for new features.
- Reference `ProtectedRoute.jsx` for implementing authentication checks.

---

Please review and suggest any additions or corrections for unclear or incomplete sections.