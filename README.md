# Rastapopoulos

This is a React front end for displaying solar PV install information.

## Project Overview

Rastapopoulos is a React-based CRUD (Create, Read, Update, Delete) application, showcasing a dynamic table interface using Mantine React Table. It integrates various libraries for UI components, state management, and testing.

## Key Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Mantine**: A suite of React components and hooks.
- **Mantine React Table** - Table components.
- **React Query**: Manages and synchronizes asynchronous data in React applications.
- **Testing Library**: Provides simple and complete testing utilities for React components.

## Project Structure

The project follows a modular and scalable structure, with the following main directories:
components/: This folder contains all the reusable UI components for your application, organized by feature or functionality.
Here's a breakdown of the folders and files:

- **`components/`**: This folder contains all the reusable UI components for your application, organized by feature or functionality.
    - **`ElevationTable/`**: This directory contains the Elevation Table component and its related files (styles, tests, etc.).
    - **`ProjectDetails/`**: This directory contains the Project Details component and its related files.
    - **`shared/`**: This directory contains shared UI components, such as a generic Button or Modal component.
- **`hooks/`**: This folder contains custom React hooks, such as `useElevations` and `useProjectDetails`, which handle data fetching and other logic.
- **`pages/`**: This folder contains the main pages of your application, such as the Elevations page and the Projects page.
- **`services/`**: This folder contains the API service functions for fetching data from the backend, such as `elevationsService` and `projectsService`.
- **`types/`**: This folder contains TypeScript type definitions for your application's data models, such as `Elevation` and `Project`.
- **`utils/`**: This folder contains utility functions, such as the `api` module for making API requests and the `validations` module for input validation.
- **`App.tsx`**: The main React component that renders the application.
- **`index.tsx`**: The entry point of the application.
- **`theme.ts`**: The Mantine theme configuration for your application.

This structure separates concerns, improves code organization, and follows common best practices for React projects. It includes folders for components, hooks, pages, services, types, and utilities, making it easier to navigate and maintain the codebase as the project grows.

## Application Architecture

- **React Components**: The UI is built using functional React components.
- **State Management**: Uses React Query for managing server state and React's useState for local state.
- **Styling**: Mantine and custom CSS are used for styling components.
- **Data Fetching**: React Query's hooks (`useQuery`, `useMutation`) handle data fetching, updating, and caching.

## Coding Style

- **Functional Components**: Utilizes React functional components with hooks.
- **Async/Await**: Asynchronous JavaScript operations are handled using async/await syntax.
- **Modularization**: Code is organized into small, reusable components and utility functions.

## Current TODO List

- [ ] Implement error handling for API requests.
- [ ] Add more unit tests for components and utility functions.
- [ ] Optimize performance for large datasets.
- [ ] Enhance mobile responsiveness of the table interface.
- [ ] Integrate a backend API for real data management.

## Running the Project

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Run tests: `npm test`
4. Build for production: `npm run build`

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

## Contributing

Contributions are welcome. Please fork the repository, make your changes, and submit a pull request.

## Tech we're using

We're using Manatine with next.js and Manatine react table 
in addition to:
- [PostCSS](https://postcss.org/) with [mantine-postcss-preset](https://mantine.dev/styles/postcss-preset)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Jest](https://jestjs.io/) setup with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## npm scripts


### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier
