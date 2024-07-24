Rastapopoulos
=============

Rastapopoulos is a React-based CRUD (Create, Read, Update, Delete) application for managing solar PV install information. It provides a dynamic table interface using Mantine React Table and integrates with the Snowy API for data management.

Project Overview
----------------

Rastapopoulos showcases a modular and scalable structure, utilizing various libraries for UI components, state management, and testing. The application allows users to view, create, update, and delete solar PV install information through an intuitive table interface.

Key Dependencies
----------------

-   **React**: A JavaScript library for building user interfaces.
-   **Next.js**: A React framework for applications.
-   **Mantine**: A suite of React components and hooks for building user interfaces.
-   **Mantine React Table**: A powerful and customizable table component for React.
-   **React Query**: A library for managing and synchronizing server state in React applications.
-   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
-   **Jest** and **Testing Library**: Tools for writing and running tests for React components.

Project Structure
-----------------

The project follows a modular and scalable structure, with the following main directories and files:

-   **`app/`**: Contains the Next.js app structure.
  -   **`elevations/`**: Contains the Elevations page and related components.
    -   **`ElevationTableWrapper.tsx`**: A client component that wraps the ElevationTable and handles data fetching and mutations.
    -   **`page.tsx`**: The server component that renders the Elevations page.
  -   **`layout.tsx`**: Defines the root layout for the application.
  -   **`page.tsx`**: The main page of the application.
  -   **`QueryProvider.tsx`**: Provides the React Query client to the application.
-   **`components/`**: Contains reusable UI components for the application.
  -   **`ColorSchemeToggle/`**: Allows toggling between light and dark color schemes.
  -   **`ElevationDetails/`**: Displays detailed information about a selected elevation.
  -   **`ElevationTable/`**: Renders the table for managing elevations.
  -   **`Welcome/`**: Displays a welcome message on the main page.
-   **`hooks/`**: Contains custom React hooks.
  -   **`useElevations.ts`**: A custom hook for managing elevations data using React Query.
-   **`services/`**: Contains API service functions for interacting with the Snowy API.
  -   **`elevationsService.ts`**: Provides functions for fetching, creating, updating, and deleting elevations.
-   **`types/`**: Contains TypeScript type definitions for the application's data models.
  -   **`elevation.ts`**: Defines the Elevation interface.
-   **`utils/`**: Contains utility functions and modules.
  -   **`api.ts`**: Defines the API request function and API service functions for interacting with the Snowy API.
-   **`theme.ts`**: Defines the Mantine theme configuration for the application.
-   **`next.config.mjs`**: Configuration file for Next.js.
-   **`postcss.config.cjs`**: Configuration file for PostCSS.
-   **`tsconfig.json`**: TypeScript configuration file.
-   **`jest.config.cjs`** and **`jest.setup.cjs`**: Configuration files for Jest testing framework.

Application Flow
----------------

1.  The user navigates to the Elevations page (`app/elevations/page.tsx`).
2.  The `ElevationTableWrapper` component (`app/elevations/ElevationTableWrapper.tsx`) fetches the elevations data from the Snowy API using the `useQuery` hook from React Query.
3.  The `ElevationTable` component (`components/ElevationTable/ElevationTable.tsx`) renders the table with the fetched elevations data.
4.  The user can perform CRUD operations on the elevations:
  -   Create: The user can click the "Create New Elevation" button to open a modal and fill in the details for a new elevation. The `createMutation` from `ElevationTableWrapper` sends a POST request to the Snowy API to create the new elevation.
  -   Read: The user can view the elevations in the table and click on a row to see more details in the `ElevationDetails` component (`components/ElevationDetails/ElevationDetails.tsx`).
  -   Update: The user can click the edit icon on a row to open a modal and update the elevation details. The `updateMutation` from `ElevationTableWrapper` sends a PUT request to the Snowy API to update the elevation.
  -   Delete: The user can click the delete icon on a row to delete an elevation. The `deleteMutation` from `ElevationTableWrapper` sends a DELETE request to the Snowy API to delete the elevation.
5.  The `useElevations` hook (`hooks/useElevations.ts`) provides the necessary data fetching and mutation functions for managing elevations data using React Query.
6.  The `elevationsService` (`services/elevationsService.ts`) acts as an intermediary between the application and the Snowy API, providing functions for fetching, creating, updating, and deleting elevations.
7.  The `api` utility module (`utils/api.ts`) handles the API requests and error handling, making use of the Mantine notifications system to display error messages.

Running the Project
-------------------

1.  Install dependencies: `npm install`
2.  Start the development server: `npm run dev`
3.  Open the application in your browser at `http://localhost:3000`

Available Scripts
-----------------

The project includes several npm scripts for development, testing, building, and deployment. Here's a detailed explanation of each script:

- `npm run dev`: Starts the Next.js development server. Use this for local development.
- `npm run build`: Creates an optimized production build of the application.
- `npm run analyze`: Builds the application and generates bundle analysis reports.
- `npm run start`: Starts the Next.js production server. Run this after `npm run build`.
- `npm run typecheck`: Runs TypeScript compiler to check for type errors without emitting files.
- `npm run lint`: Runs ESLint and Stylelint to check for code style issues.
- `npm run lint:stylelint`: Runs Stylelint specifically for CSS files.
- `npm run jest`: Runs Jest tests once.
- `npm run jest:watch`: Runs Jest tests in watch mode, re-running tests on file changes.
- `npm run prettier:check`: Checks if all TypeScript and TSX files are formatted correctly.
- `npm run prettier:write`: Automatically formats all TypeScript and TSX files.
- `npm run test`: Runs a full test suite including Prettier checks, linting, type checking, and Jest tests.
- `npm run storybook`: Starts the Storybook development server for component development and testing.
- `npm run storybook:build`: Builds a static Storybook site for deployment.
- `npm run deploy`: Builds and deploys the application to Cloudflare Pages using Wrangler.

Deployment
----------

The project is configured to deploy to Cloudflare Pages. To deploy the application:

1. Ensure you have Wrangler installed globally: `npm install -g wrangler`
2. Authenticate with Cloudflare: `wrangler login`
3. Run the deployment script: `npm run deploy`

This will build the application and deploy it to:
- https://rastapopoulos.pages.dev
- https://rastapopoulos.migratingdragons.com

Note: Make sure you have the necessary permissions and have set up your Cloudflare account correctly before deploying.

Testing
-------

The project includes a comprehensive testing setup using Jest and Testing Library. To run the full test suite, use:

```bash
npm run test
```

This command will:
1. Check code formatting with Prettier
2. Run linting checks with ESLint and Stylelint
3. Perform TypeScript type checking
4. Execute Jest tests

For development, you can use `npm run jest:watch` to run tests in watch mode, which will re-run tests as you make changes to your code.

Storybook
---------

Storybook is integrated into the project for component development and testing. To start the Storybook development server, run:

```bash
npm run storybook
```

This will launch Storybook, allowing you to view and interact with your components in isolation.

Code Quality and Formatting
---------------------------

To ensure code quality and consistent formatting:

- Run `npm run lint` to check for linting issues.
- Use `npm run prettier:check` to verify formatting.
- Run `npm run prettier:write` to automatically format your code.

These commands are also part of the `npm run test` script, which is recommended to run before committing changes or submitting pull requests.
