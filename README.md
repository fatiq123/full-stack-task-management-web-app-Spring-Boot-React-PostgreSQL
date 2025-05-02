# Task Management Web Application

A full-stack task management web application built with Spring Boot, React, and PostgreSQL.

## Features

- User authentication (signup, login, JWT)
- Task management (create, read, update, delete)
- Task categorization
- Task prioritization
- Task status tracking
- Dashboard with task statistics
- User profile management

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React 19
- Redux Toolkit
- Material UI 7
- Axios
- React Router 7
- Formik & Yup
- TypeScript

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL

### Backend Setup
1. Clone the repository
2. Configure PostgreSQL database in `application.properties`
3. Run the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## API Documentation

The API documentation is available in the `API_DOCUMENTATION.md` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
