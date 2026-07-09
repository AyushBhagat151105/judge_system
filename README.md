# judge_system

This project was created with [Better Fullstack](https://github.com/Marve10s/Better-Fullstack), a modern TypeScript stack that combines React, TanStack Router, Express, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS v4** - CSS framework
- **shadcn/ui** - UI components
- **Express** - Fast, unopinionated web framework
- **Bun** - Runtime environment
- **Prisma** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better Auth with email/password and Google OAuth
- **Turborepo** - Optimized monorepo build system
- **TanStack Query** - Server state management
- **TanStack AI** - AI integration with Tavily search
- **Winston** - Structured logging
- **Zustand** - Client state management

---

## Screenshots

### Landing Page
![Landing Page](public/landingpage.png)

### Authentication
![Authentication](public/auth.png)

### Dashboard
![Dashboard](public/dashboard.png)

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.2.0
- [PostgreSQL](https://www.postgresql.org/) >= 16 (or use Docker)
- [Node.js](https://nodejs.org/) >= 20 (for tooling compatibility)

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
# For the server
cp apps/server/.env.example apps/server/.env

# For the web app (if needed)
cp apps/web/.env.example apps/web/.env
```

> **Important**: The server requires several environment variables to start. See [Environment Variables](#environment-variables) below for details.

### 3. Start Database (using Docker)

```bash
docker compose up -d db
```

### 4. Push Database Schema

```bash
bun run db:push
```

### 5. Start Development Servers

```bash
# Start both web and server
bun run dev

# Or start individually
bun run dev:web      # Frontend on http://localhost:3001
bun run dev:server   # Backend API on http://localhost:3000
```

---

## Environment Variables

### Server (`apps/server/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/judge_system` |
| `BETTER_AUTH_SECRET` | ✅ | Secret for signing auth tokens (min 32 chars) | `your-super-secret-key-at-least-32-chars-long` |
| `BETTER_AUTH_URL` | ✅ | Base URL of the auth server | `http://localhost:3000` |
| `CORS_ORIGIN` | ✅ | Frontend URL for CORS | `http://localhost:3001` |
| `JUDGE_SYSTEM_API_KEY` | ✅ | Internal API key for judge system | `sk-judge-system-random-string` |
| `TAVILY_API_KEY` | ✅ | Tavily API key for AI search | `tvly-your-tavily-key` |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret | `GOCSPX-your-secret` |
| `NODE_ENV` | ✅ | Environment (default: development) | `development` |

### Web (`apps/web/.env`)

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_SERVER_URL` | ✅ | Backend API URL | `http://localhost:3000` |

### Generate Auth Secret

```bash
# Generate a secure random secret
openssl rand -base64 32
```

### Example `.env` File

```bash
# apps/server/.env
DATABASE_URL="postgresql://postgres:password@localhost:5432/judge_system"
BETTER_AUTH_SECRET="your-generated-secret-here-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3001"
JUDGE_SYSTEM_API_KEY="sk-judge-system-dev-key-12345"
TAVILY_API_KEY="tvly-your-tavily-api-key-here"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NODE_ENV="development"
```

---

## Docker Deployment

### Development with Docker Compose

```bash
# Start all services (web, server, postgres)
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (resets database)
docker compose down -v
```

### Production Build

```bash
# Build all images
docker compose build

# Start production stack
docker compose up -d
```

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `web` | 3000 | Frontend (served by Vite preview in prod) |
| `server` | 3001 | Backend API |
| `db` | 5432 | PostgreSQL database |

---

## Project Structure

```
judge_system/
├── apps/
│   ├── web/                 # Frontend (React + TanStack Router + Vite)
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── lib/         # Utilities, query client, auth client
│   │   │   └── routes/      # File-based routes (TanStack Router)
│   │   └── ...
│   └── server/              # Backend (Express + TypeScript)
│       ├── src/
│       │   ├── chat/        # Chat routes & logic
│       │   ├── client/      # External API clients
│       │   ├── lib/         # Error handling, middleware
│       │   ├── tools/       # AI tool definitions
│       │   └── index.ts     # Express app entry point
│       └── ...
├── packages/
│   ├── auth/                # Better Auth configuration
│   ├── config/              # Shared TypeScript/ESLint config
│   ├── db/                  # Prisma schema & client
│   │   └── prisma/schema/   # Split schema files
│   └── env/                 # Type-safe environment validation (t3-env)
├── turbo.json               # Turborepo pipeline config
├── docker-compose.yml       # Local development stack
└── package.json             # Root workspace config
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in development mode |
| `bun run build` | Build all apps for production |
| `bun run check-types` | Type-check all packages |
| `bun run dev:web` | Start only frontend |
| `bun run dev:server` | Start only backend |
| `bun run db:push` | Push schema changes to database |
| `bun run db:studio` | Open Prisma Studio UI |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Run database migrations |
| `bun run test` | Run tests for web and server |

---

## Database Management

### Prisma Commands

```bash
# Push schema (development)
bun run db:push

# Create migration
bun run db:migrate

# Generate client after schema changes
bun run db:generate

# Open Prisma Studio (database GUI)
bun run db:studio

# Reset database (dev only)
bun run db:push --force-reset
```

### Schema Organization

The Prisma schema is split across multiple files in `packages/db/prisma/schema/`:

- `schema.prisma` - Generator & datasource config
- `auth.prisma` - User, Session, Account, Verification models
- `evaluation.prisma` - Evaluation model for AI judging

---

## Development Workflow

### Adding a New Feature

1. **Database changes**: Edit schema in `packages/db/prisma/schema/`
2. **Push schema**: `bun run db:push`
3. **Backend**: Add routes in `apps/server/src/`
4. **Frontend**: Add routes in `apps/web/src/routes/`
5. **Types**: Shared types via `@judge_system/db` package

### Code Quality

```bash
# Type checking
bun run check-types

# Linting (if configured)
bun run lint

# Format (if prettier configured)
bun run format
```

---

## Testing

```bash
# Run all tests
bun run test

# Run web tests only
cd apps/web && bun test

# Run server tests only
cd apps/server && bun test

# Run with UI
bun test --ui

# Run with coverage
bun test --coverage
```

---

## AI Features

The system includes AI-powered evaluation using:

- **TanStack AI** - LLM orchestration
- **Tavily** - Web search for context
- **Custom Tools** - Defined in `apps/server/src/tools/`
- **NVIDIA NIM** - Hosted LLM inference via NVIDIA's API

### AI Models Used

The system uses multiple specialized models via NVIDIA's NIM (NVIDIA Inference Microservices) platform:

| Adapter | Model | Purpose |
|---------|-------|---------|
| `judgeModelAdapter` | `meta/llama-3.1-70b-instruct` | Primary judging/evaluation model |
| `techFeasibilityAdapter` | `mistralai/codestral-22b-instruct-v0.1` | Technical feasibility analysis |
| `marketViabilityAdapter` | `writer/palmyra-fin-70b-32k` | Market viability & financial analysis |
| `riskAssessmentAdapter` | `nvidia/llama-3.1-nemotron-51b-instruct` | Risk assessment & safety evaluation |

All models are accessed through the **NVIDIA NIM API** at `https://integrate.api.nvidia.com/v1` using OpenAI-compatible endpoints.

### Getting NVIDIA API Key

1. Go to [NVIDIA Build Platform](https://build.nvidia.com/settings/api-keys)
2. Sign in with your NVIDIA account (or create one)
3. Generate a new API key
4. Copy the key and add it to your server `.env` as `JUDGE_SYSTEM_API_KEY`

```bash
# apps/server/.env
JUDGE_SYSTEM_API_KEY="nvapi-your-nvidia-api-key-here"
```

### Configuration

Requires `TAVILY_API_KEY` and `JUDGE_SYSTEM_API_KEY` in server environment.

The adapters are defined in `apps/server/src/client/adapters.ts` and use a custom `NvidiaChatCompletionsTextAdapter` that extends TanStack AI's OpenAI adapter to work with NVIDIA's API format.

---

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `BETTER_AUTH_SECRET` (64+ chars)
- [ ] Configure production `DATABASE_URL`
- [ ] Set correct `CORS_ORIGIN` for production frontend
- [ ] Configure `BETTER_AUTH_URL` to production API URL
- [ ] Set up Google OAuth credentials for production domain
- [ ] Run `bun run build` to compile all packages
- [ ] Run database migrations: `bun run db:migrate`
- [ ] Configure reverse proxy (nginx/Cloudflare) for SSL
- [ ] Set up monitoring/logging (Winston configured)

---

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker compose ps db

# Check database logs
docker compose logs db

# Verify connection string
bun run db:studio
```

### Auth Not Working

- Verify `BETTER_AUTH_SECRET` is set and >= 32 chars
- Check `BETTER_AUTH_URL` matches your API URL exactly
- Ensure `CORS_ORIGIN` includes your frontend URL
- Check cookie settings in `packages/auth/src/index.ts`

### Port Conflicts

Default ports:
- Web: 3001 (dev) / 3000 (docker)
- Server: 3000 (dev) / 3001 (docker)
- Database: 5432

Change in `docker-compose.yml` or Vite/Express config if needed.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run `bun run check-types` and `bun run test`
5. Submit a PR

---

## License

MIT License - see LICENSE file for details.
