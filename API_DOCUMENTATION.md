# Task Management Application API Documentation

This document provides comprehensive information about the Task Management Application's REST API endpoints, including request/response formats, authentication requirements, and example usage.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:8080/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require a valid JWT token in the Authorization header.

### How to Authenticate

1. Register a new user or login with existing credentials
2. Include the JWT token in the Authorization header for subsequent requests:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

#### Register a New User

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Creates a new user account

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "password123",
  "name": "John Doe",
  "roles": ["user"]  // Optional: defaults to "user" if not specified
}
```

**Response:**
```json
{
  "message": "User registered successfully!"
}
```

#### Login

- **URL**: `/auth/signin`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Authenticates a user and returns a JWT token

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "roles": ["ROLE_USER"]
}
```

### User Management

#### Get User Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves the current user's profile information

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "profilePicture": null
}
```

#### Update User Profile

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Updates the current user's profile information

**Request Body:**
```json
{
  "email": "john.updated@example.com",
  "name": "John Updated"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john.updated@example.com",
  "name": "John Updated",
  "profilePicture": null
}
```

#### Change Password

- **URL**: `/users/change-password`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Changes the current user's password

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword456"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

### Task Management

#### Get All Tasks

- **URL**: `/tasks`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves all tasks for the current user

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the project",
    "dueDate": "2025-05-15T18:00:00",
    "priority": "HIGH",
    "completed": false,
    "categoryId": 1,
    "categoryName": "Work",
    "createdAt": "2025-04-30T10:15:30",
    "updatedAt": "2025-04-30T10:15:30"
  },
  {
    "id": 2,
    "title": "Buy groceries",
    "description": "Get milk, eggs, and bread",
    "dueDate": "2025-05-01T12:00:00",
    "priority": "MEDIUM",
    "completed": false,
    "categoryId": 2,
    "categoryName": "Personal",
    "createdAt": "2025-04-30T10:20:15",
    "updatedAt": "2025-04-30T10:20:15"
  }
]
```

#### Get Tasks by Priority

- **URL**: `/tasks/priority`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves all tasks for the current user, sorted by priority

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the project",
    "dueDate": "2025-05-15T18:00:00",
    "priority": "HIGH",
    "completed": false,
    "categoryId": 1,
    "categoryName": "Work",
    "createdAt": "2025-04-30T10:15:30",
    "updatedAt": "2025-04-30T10:15:30"
  },
  {
    "id": 2,
    "title": "Buy groceries",
    "description": "Get milk, eggs, and bread",
    "dueDate": "2025-05-01T12:00:00",
    "priority": "MEDIUM",
    "completed": false,
    "categoryId": 2,
    "categoryName": "Personal",
    "createdAt": "2025-04-30T10:20:15",
    "updatedAt": "2025-04-30T10:20:15"
  }
]
```

#### Get Completed Tasks

- **URL**: `/tasks/completed`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves all completed tasks for the current user

**Response:**
```json
[
  {
    "id": 3,
    "title": "Send weekly report",
    "description": "Email the weekly progress report to the team",
    "dueDate": "2025-04-29T17:00:00",
    "priority": "HIGH",
    "completed": true,
    "categoryId": 1,
    "categoryName": "Work",
    "createdAt": "2025-04-28T09:00:00",
    "updatedAt": "2025-04-29T16:45:00"
  }
]
```

#### Get Pending Tasks

- **URL**: `/tasks/pending`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves all pending (not completed) tasks for the current user

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the project",
    "dueDate": "2025-05-15T18:00:00",
    "priority": "HIGH",
    "completed": false,
    "categoryId": 1,
    "categoryName": "Work",
    "createdAt": "2025-04-30T10:15:30",
    "updatedAt": "2025-04-30T10:15:30"
  },
  {
    "id": 2,
    "title": "Buy groceries",
    "description": "Get milk, eggs, and bread",
    "dueDate": "2025-05-01T12:00:00",
    "priority": "MEDIUM",
    "completed": false,
    "categoryId": 2,
    "categoryName": "Personal",
    "createdAt": "2025-04-30T10:20:15",
    "updatedAt": "2025-04-30T10:20:15"
  }
]
```

#### Get Overdue Tasks

- **URL**: `/tasks/overdue`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves all overdue tasks (due date in the past and not completed) for the current user

**Response:**
```json
[
  {
    "id": 4,
    "title": "Submit tax documents",
    "description": "Send tax documents to the accountant",
    "dueDate": "2025-04-15T23:59:59",
    "priority": "HIGH",
    "completed": false,
    "categoryId": 2,
    "categoryName": "Personal",
    "createdAt": "2025-04-01T14:30:00",
    "updatedAt": "2025-04-01T14:30:00"
  }
]
```

#### Get Task by ID

- **URL**: `/tasks/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves a specific task by its ID

**Response:**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the project",
  "dueDate": "2025-05-15T18:00:00",
  "priority": "HIGH",
  "completed": false,
  "categoryId": 1,
  "categoryName": "Work",
  "createdAt": "2025-04-30T10:15:30",
  "updatedAt": "2025-04-30T10:15:30"
}
```

#### Create a New Task

- **URL**: `/tasks`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Creates a new task for the current user

**Request Body:**
```json
{
  "title": "Prepare presentation",
  "description": "Create slides for the client meeting",
  "dueDate": "2025-05-10T14:00:00",
  "priority": "HIGH",
  "categoryId": 1
}
```

**Response:**
```json
{
  "id": 5,
  "title": "Prepare presentation",
  "description": "Create slides for the client meeting",
  "dueDate": "2025-05-10T14:00:00",
  "priority": "HIGH",
  "completed": false,
  "categoryId": 1,
  "categoryName": "Work",
  "createdAt": "2025-04-30T11:25:45",
  "updatedAt": "2025-04-30T11:25:45"
}
```

#### Update a Task

- **URL**: `/tasks/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Updates an existing task

**Request Body:**
```json
{
  "title": "Prepare presentation with demo",
  "description": "Create slides and prepare demo for the client meeting",
  "dueDate": "2025-05-11T16:00:00",
  "priority": "HIGH",
  "completed": false,
  "categoryId": 1
}
```

**Response:**
```json
{
  "id": 5,
  "title": "Prepare presentation with demo",
  "description": "Create slides and prepare demo for the client meeting",
  "dueDate": "2025-05-11T16:00:00",
  "priority": "HIGH",
  "completed": false,
  "categoryId": 1,
  "categoryName": "Work",
  "createdAt": "2025-04-30T11:25:45",
  "updatedAt": "2025-04-30T11:40:20"
}
```

#### Delete a Task

- **URL**: `/tasks/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Deletes a task by its ID

**Response:**
```
204 No Content
```

#### Toggle Task Completion

- **URL**: `/tasks/{id}/toggle-completion`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Description**: Toggles the completion status of a task

**Response:**
```json
{
  "id": 5,
  "title": "Prepare presentation with demo",
  "description": "Create slides and prepare demo for the client meeting",
  "dueDate": "2025-05-11T16:00:00",
  "priority": "HIGH",
  "completed": true,
  "categoryId": 1,
  "categoryName": "Work",
  "createdAt": "2025-04-30T11:25:45",
  "updatedAt": "2025-04-30T12:05:10"
}
```

### Category Management

#### Get All Categories

- **URL**: `/categories`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves all categories for the current user

**Response:**
```json
[
  {
    "id": 1,
    "name": "Work",
    "description": "Work-related tasks",
    "taskCount": 3
  },
  {
    "id": 2,
    "name": "Personal",
    "description": "Personal tasks and errands",
    "taskCount": 2
  }
]
```

#### Get Category by ID

- **URL**: `/categories/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves a specific category by its ID

**Response:**
```json
{
  "id": 1,
  "name": "Work",
  "description": "Work-related tasks",
  "taskCount": 3
}
```

#### Create a New Category

- **URL**: `/categories`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Creates a new category for the current user

**Request Body:**
```json
{
  "name": "Study",
  "description": "Tasks related to courses and learning"
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Study",
  "description": "Tasks related to courses and learning",
  "taskCount": 0
}
```

#### Update a Category

- **URL**: `/categories/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Updates an existing category

**Request Body:**
```json
{
  "name": "Education",
  "description": "Tasks related to courses, learning, and education"
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Education",
  "description": "Tasks related to courses, learning, and education",
  "taskCount": 0
}
```

#### Delete a Category

- **URL**: `/categories/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Deletes a category by its ID

**Response:**
```
204 No Content
```

### Dashboard

#### Get Dashboard Data

- **URL**: `/dashboard`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Retrieves dashboard data for the current user, including task statistics and upcoming tasks

**Response:**
```json
{
  "totalTasks": 5,
  "completedTasks": 1,
  "pendingTasks": 4,
  "overdueTasks": 1,
  "upcomingTasks": [
    {
      "id": 2,
      "title": "Buy groceries",
      "description": "Get milk, eggs, and bread",
      "dueDate": "2025-05-01T12:00:00",
      "priority": "MEDIUM",
      "completed": false,
      "categoryId": 2,
      "categoryName": "Personal",
      "createdAt": "2025-04-30T10:20:15",
      "updatedAt": "2025-04-30T10:20:15"
    },
    {
      "id": 5,
      "title": "Prepare presentation with demo",
      "description": "Create slides and prepare demo for the client meeting",
      "dueDate": "2025-05-11T16:00:00",
      "priority": "HIGH",
      "completed": false,
      "categoryId": 1,
      "categoryName": "Work",
      "createdAt": "2025-04-30T11:25:45",
      "updatedAt": "2025-04-30T11:40:20"
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "Work",
      "description": "Work-related tasks",
      "taskCount": 3
    },
    {
      "id": 2,
      "name": "Personal",
      "description": "Personal tasks and errands",
      "taskCount": 2
    }
  ]
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures:

### Common Error Responses

#### 400 Bad Request
```json
{
  "message": "Error: Username is already taken!"
}
```

#### 401 Unauthorized
```json
{
  "message": "Error: Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "message": "Error: Forbidden"
}
```

#### 404 Not Found
```json
{
  "message": "Error: Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "message": "Error: Internal server error"
}
```

## Data Models

### Task
- `id`: Long - Unique identifier
- `title`: String - Task title (required)
- `description`: String - Task description
- `dueDate`: DateTime - Task due date (required)
- `priority`: Enum (LOW, MEDIUM, HIGH) - Task priority (required)
- `completed`: Boolean - Task completion status
- `categoryId`: Long - ID of the associated category
- `categoryName`: String - Name of the associated category
- `createdAt`: DateTime - Creation timestamp
- `updatedAt`: DateTime - Last update timestamp

### Category
- `id`: Long - Unique identifier
- `name`: String - Category name (required)
- `description`: String - Category description
- `taskCount`: Integer - Number of tasks in this category

### User
- `id`: Long - Unique identifier
- `username`: String - Username (required, unique)
- `email`: String - Email address (required, unique)
- `name`: String - Full name (required)
- `profilePicture`: String - URL to profile picture (optional)

## Authentication Notes

- JWT tokens expire after 24 hours
- All protected endpoints require a valid JWT token in the Authorization header
- Invalid or expired tokens will result in a 401 Unauthorized response
