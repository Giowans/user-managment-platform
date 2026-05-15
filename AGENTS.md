# User Management Platform - Project Documentation

## Project Overview

This is a microservices-based User Management Platform (IAM lite version). The system includes authentication, user management, audit logging, role-based access control, and AI-powered contextual assistant using RAG.

## Architecture

### High-Level Architecture

- **Client**: React Frontend
- **API Gateway / BFF**: Single entry point (NestJS, port 3000)
- **Microservices**:
  - Auth Service (port 3002) - Authentication & authorization
  - User Service (port 3003) - User profile management
  - Audit Service (port 3001) - Audit logging (async consumer from RabbitMQ)
  - AI Service - Not yet implemented

### Databases & Infrastructure

| Service | Database | Purpose |
|---|---|---|
| Auth Service | PostgreSQL (port 5433) | Authentication & roles |
| User Service | PostgreSQL (port 5433) | User management |
| Audit Service | MongoDB (port 27017) | Audit logs |
| Auth Service | Redis (port 6379) | Cache/session support |
| API Gateway | - | - |
| Infrastructure | RabbitMQ (port 5672, UI: 15672) | Event-driven messaging |
| AI Service | Qdrant (port 6333) | Vector embeddings |

### Communication Strategy

- **Synchronous (REST)**: Auth, User, AI services - direct request-response
- **Asynchronous (RabbitMQ)**: Audit Service consumes events (`user_created`, `user_updated`, `login_success`, `role_updated`)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite + TailwindCSS 4 |
| Backend | NestJS 11 |
| ORM | Prisma 7 |
| Databases | PostgreSQL 16, MongoDB 7 |
| Cache | Redis 7 |
| Messaging | RabbitMQ 3-management |
| Vector DB | Qdrant |
| Containerization | Docker Compose |

## Project Structure

```
user-managment-platform/
├── docker-compose.yml          # All services orchestration
├── README.md
├── AGENTS.md                   # This file
├── docs/
│   └── architecture.md         # Detailed architecture docs
├── services/
│   ├── api-gateway/            # Port 3000
│   ├── auth-service/           # Port 3002
│   ├── user-service/           # Port 3003
│   └── audit-service/          # Port 3001
└── frontend/
    └── web-app/                # Port 5173 (Vite)
```

## Services Details

### API Gateway (NestJS)
- Entry point on port 3000
- Routes requests to auth, user, and AI services
- JWT validation
- No database, uses ConfigModule

### Auth Service (NestJS)
- Port 3002
- In-memory user storage (needs database implementation)
- JWT authentication with passport-jwt
- Endpoints: POST /auth/register, POST /auth/login
- Uses bcrypt for password hashing
- Environment: JWT_SECRET, JWT_EXPIRES_IN

### User Service (NestJS)
- Port 3003
- Prisma ORM with PostgreSQL
- Models: User, Role, UserRole (many-to-many)
- Currently only returns "Hello World" - needs implementation

### Audit Service (NestJS)
- Port 3001
- MongoDB connection (needs implementation)
- Consumes events from RabbitMQ
- Currently only returns "Hello World" - needs implementation

### Frontend (React + Vite)
- Port 5173
- TailwindCSS 4 for styling
- VITE_API_URL=http://localhost:3000

## Running the Project

```bash
# Start all services
docker compose up --build

# Individual service commands (in service directory)
npm run start:dev    # Development with hot reload
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
```


## Key Files

- `docs/architecture.md` - Detailed architecture documentation
- `docker-compose.yml` - Service orchestration
- `services/user-service/prisma/schema.prisma` - Database schema

## Notes for Future Development

1. **Auth Service**: Currently uses in-memory storage. Needs PostgreSQL integration.
2. **User Service**: Basic scaffolding done, CRUD operations not implemented.
3. **Audit Service**: Needs MongoDB connection and RabbitMQ consumer implementation.
4. **AI Service**: Not yet created, needs Qdrant and OpenAI integration.
5. **Frontend**: Basic Vite + React template, needs full UI implementation.