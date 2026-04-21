# Sproad (Project Management) API

Backend service for a project management application built with Go, Fiber, GORM, and PostgreSQL. This API handles authentication, user management, board collaboration, list management, and card operations for a Trello-style workflow.

## Overview

This repository provides the backend layer for a project management platform with:

- JWT-based authentication
- User management
- Board creation and member management
- List management inside boards
- Card management inside lists
- PostgreSQL persistence
- Docker-based local deployment

## Tech Stack

- Go `1.25`
- Fiber `v3`
- GORM
- PostgreSQL
- Docker and Docker Compose
- JWT authentication

## Project Structure

```text
.
|-- config/         # Application config and database connection
|-- controllers/    # HTTP handlers
|-- database/       # SQL migrations and seeders
|-- middleware/     # Request middleware such as JWT auth
|-- models/         # Domain and database models
|-- repositories/   # Data access layer
|-- routes/         # API route registration
|-- services/       # Business logic layer
|-- utils/          # Shared helpers
|-- main.go         # Application entry point
|-- dockerfile
`-- docker-compose.yaml
```

## Main Features

### Authentication

- Register new user
- Login and receive JWT token
- Protect private endpoints with JWT middleware

### Users

- Get user detail
- Update user profile
- Delete user
- Paginated user listing

### Boards

- Create board
- Update board
- Get boards owned by the authenticated user
- Add and remove board members
- Retrieve lists inside a board

### Lists

- Create list
- Update list
- Delete list
- Retrieve cards inside a list

### Cards

- Create card
- Update card
- Delete card
- Get card detail

## API Base Paths

- Public auth routes: `/v1/auth`
- Protected routes: `/api/v1`

## Available Endpoints

### Public

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/v1/auth/register` | Register a new user |
| `POST` | `/v1/auth/login` | Authenticate user |

### Protected

All endpoints below require a valid JWT token.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/users/page` | Get paginated users |
| `GET` | `/api/v1/users/:id` | Get user detail |
| `PUT` | `/api/v1/users/:id` | Update user |
| `DELETE` | `/api/v1/users/:id` | Delete user |
| `POST` | `/api/v1/boards/` | Create board |
| `PUT` | `/api/v1/boards/:id` | Update board |
| `POST` | `/api/v1/boards/:id/members` | Add board members |
| `DELETE` | `/api/v1/boards/:id/members` | Remove board members |
| `GET` | `/api/v1/boards/my` | Get authenticated user's boards |
| `GET` | `/api/v1/boards/:board_id/lists` | Get lists in board |
| `POST` | `/api/v1/lists/` | Create list |
| `GET` | `/api/v1/lists/:id/cards` | Get cards in list |
| `PUT` | `/api/v1/lists/:id` | Update list |
| `DELETE` | `/api/v1/lists/:id` | Delete list |
| `POST` | `/api/v1/cards/` | Create card |
| `PUT` | `/api/v1/cards/:id` | Update card |
| `DELETE` | `/api/v1/cards/:id` | Delete card |
| `GET` | `/api/v1/cards/:id` | Get card detail |

## Environment Variables

Create a `.env` file in the project root and configure the following values:

```env
PORT=3030
DB_HOST=localhost
DB_PORT=5432
DB_USER=[Your user]
DB_PASSWORD=[Your password]
DB_NAME=[Your DB name]

APP_URL=http://localhost:3030 // local

JWT_SECRET=[Your jwt secret]
JWT_EXPIRED=2h
REFRESH_TOKEN_EXPIRED=24h

ADMIN_EMAIL=[name@example.com]
ADMIN_PASSWORD=[Pass]
ADMIN_ROLE=admin

ENV=development
```

## Getting Started

### Run Locally

1. Clone the repository.
2. Create and adjust the `.env` file.
3. Install dependencies:

```bash
go mod download
```

4. Start PostgreSQL.
5. Run the application:

```bash
go run main.go
```

The server will run on `http://localhost:3030` by default.

## Run with Docker

This project includes Docker support for the API service, PostgreSQL, and pgAdmin.

```bash
docker compose up --build
```

Default exposed services:

- API: `http://localhost:3030`
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`

## Database Notes

- Database migrations are executed automatically when `ENV=production`
- Admin seed data is initialized on application startup
- Migration files are stored in `database/migrations`

## Architecture Notes

The codebase follows a layered structure:

- `controllers` handle HTTP requests and responses
- `services` contain business logic
- `repositories` manage database access
- `models` define application entities

This separation helps keep the project easier to maintain and extend as features grow.

## Development Notes

- Protected routes use JWT middleware
- The application uses PostgreSQL as the primary database
- Docker Compose is the fastest way to boot the full local environment

## Future Improvements

- Add Swagger or OpenAPI documentation
- Add unit and integration tests
- Add CI pipeline for linting and automated testing
- Add structured logging and monitoring

## License

This project is intended for personal or portfolio use unless stated otherwise by the repository owner.
