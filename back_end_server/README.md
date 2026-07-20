# Sproad API

Backend service for the Sproad project management application built with Go, Fiber, GORM, and PostgreSQL. This API powers authentication, user management, boards, lists, cards, members, assignees, and attachments for a Trello-style workflow.

## Overview

This backend provides the core server-side logic for a collaborative project management platform with features such as:

- JWT-based authentication
- user and profile management
- board creation and collaboration
- list and card workflow management
- position updates for lists and cards
- card assignees and attachments
- PostgreSQL persistence
- Docker-based local development

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
|-- config/         # Application configuration and DB connection
|-- controllers/    # HTTP handlers
|-- database/       # Migrations and seed data
|-- middleware/     # Auth and request middleware
|-- models/         # Domain and database models
|-- repositories/   # Data access layer
|-- routes/         # API route registration
|-- services/       # Business logic layer
|-- utils/          # Shared helper functions
|-- main.go         # Application entry point
|-- dockerfile
`-- docker-compose.yaml
```

## Main Features

### Authentication

- register new users
- login and issue JWT tokens
- protect private endpoints with middleware

### Users

- get user detail
- update user profile
- delete user
- paginated user listing

### Boards

- create and update boards
- view boards owned by the authenticated user
- manage board members
- retrieve board details and board lists
- update board list positions

### Lists

- create and update lists
- retrieve cards inside a list
- update card positions inside a list
- delete lists

### Cards

- create and update cards
- add assignees
- add and remove attachments
- retrieve card detail

## API Base Paths

- Public auth routes: `/v1/auth`
- Protected routes: `/api/v1`

## Available Endpoints

### Public Endpoints

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| `POST` | `/v1/auth/register` | Register a new user |
| `POST` | `/v1/auth/login`    | Authenticate a user |

### Protected Endpoints

All protected endpoints below require a valid JWT token.

| Method   | Endpoint                                       | Description                      |
| -------- | ---------------------------------------------- | -------------------------------- |
| `GET`    | `/api/v1/users/page`                           | Get paginated users              |
| `GET`    | `/api/v1/users/:id`                            | Get user detail                  |
| `PUT`    | `/api/v1/users/:id`                            | Update user                      |
| `DELETE` | `/api/v1/users/:id`                            | Delete user                      |
| `POST`   | `/api/v1/boards/`                              | Create board                     |
| `PUT`    | `/api/v1/boards/:id`                           | Update board                     |
| `POST`   | `/api/v1/boards/:id/members`                   | Add board members                |
| `GET`    | `/api/v1/boards/:id/members`                   | Get board members                |
| `DELETE` | `/api/v1/boards/:id/members`                   | Remove board members             |
| `PUT`    | `/api/v1/boards/:id/positions`                 | Update list positions on a board |
| `GET`    | `/api/v1/boards/my`                            | Get authenticated user's boards  |
| `GET`    | `/api/v1/boards/:id`                           | Get board detail                 |
| `GET`    | `/api/v1/boards/:board_id/lists`               | Get lists in a board             |
| `POST`   | `/api/v1/lists/`                               | Create list                      |
| `GET`    | `/api/v1/lists/:id/cards`                      | Get cards in a list              |
| `PUT`    | `/api/v1/lists/:id`                            | Update list                      |
| `PUT`    | `/api/v1/lists/:id/positions`                  | Update card positions in a list  |
| `DELETE` | `/api/v1/lists/:id`                            | Delete list                      |
| `POST`   | `/api/v1/cards/`                               | Create card                      |
| `PUT`    | `/api/v1/cards/:id`                            | Update card                      |
| `POST`   | `/api/v1/cards/:id/assignees`                  | Add card assignees               |
| `POST`   | `/api/v1/cards/:id/attachments`                | Add card attachments             |
| `DELETE` | `/api/v1/cards/:id/attachments/:attachment_id` | Remove a card attachment         |
| `DELETE` | `/api/v1/cards/:id`                            | Delete card                      |
| `GET`    | `/api/v1/cards/:id`                            | Get card detail                  |

## Environment Variables

Create a `.env` file in the project root and configure the following values:

```env
PORT=3030
DB_HOST=localhost
DB_PORT=5432
DB_USER=[Your user]
DB_PASSWORD=[Your password]
DB_NAME=[Your DB name]

APP_URL=http://localhost:3030
CORS_ALLOW_ORIGINS=[client host]

JWT_SECRET=[Your jwt secret]
JWT_EXPIRED=2h
REFRESH_TOKEN_EXPIRED=24h

ADMIN_EMAIL=[name@example.com]
ADMIN_PASSWORD=[Pass]
ADMIN_ROLE=admin

ENV=development
```

`CORS_ALLOW_ORIGINS` accepts a comma-separated list of allowed frontend origins. This is useful for local development when your client and API run on different hosts or ports.

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

- database migrations are executed automatically when `ENV=production`
- admin seed data is initialized on application startup
- migration files are stored in `database/migrations`

## Architecture Notes

The codebase follows a layered structure:

- `controllers` handle HTTP requests and responses
- `services` contain business logic
- `repositories` manage database access
- `models` define application entities

This separation helps keep the project easier to maintain and extend as features grow.

## Development Notes

- protected routes use JWT middleware
- the application uses PostgreSQL as the primary database
- Docker Compose is the fastest way to boot the full local environment

## License

This project is intended for personal or portfolio use unless stated otherwise by the repository owner.
