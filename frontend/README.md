# Task Management Application Frontend

This is the frontend for the Task Management Application, built with React, TypeScript, and Material-UI.

## Features

- User authentication (login, registration)
- Dashboard with task statistics and charts
- Task management (create, read, update, delete)
- Task filtering (all, pending, completed, overdue)
- Category management
- User profile management
- Responsive design for all devices

## Tech Stack

- **React**: UI library
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Material-UI**: UI components
- **Formik & Yup**: Form handling and validation
- **Chart.js**: Data visualization
- **Axios**: API requests
- **date-fns**: Date manipulation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd task-management-app/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the Development Server

```
npm start
```
or
```
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```
npm run build
```
or
```
yarn build
```

## Project Structure

- `src/components`: React components organized by feature
- `src/services`: API service layer
- `src/store`: Redux store configuration and slices
- `src/types`: TypeScript type definitions
- `src/App.tsx`: Main application component
- `src/index.tsx`: Entry point

## API Integration

The frontend communicates with the Spring Boot backend API. The base URL for API requests can be configured in `src/services/api.ts`.

## Authentication

The application uses JWT (JSON Web Token) for authentication. The token is stored in localStorage and included in the headers of API requests.
