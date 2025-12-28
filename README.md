# Synapse

A visual workflow automation platform built with Next.js. Create, manage, and execute automated workflows through an intuitive drag-and-drop interface.

## Architecture

```mermaid
graph TB
    subgraph Client["Frontend (React)"]
        UI["UI Components<br/>(Radix UI + Tailwind)"]
        Editor["Workflow Editor<br/>(@xyflow/react)"]
        State["State Management<br/>(TanStack Query + Jotai)"]
        tRPCClient["tRPC Client"]
    end

    subgraph Server["Backend (Next.js App Router)"]
        API["API Routes"]
        tRPCServer["tRPC Server"]
        Auth["Authentication<br/>(better-auth)"]
        Inngest["Background Jobs<br/>(Inngest)"]
    end

    subgraph Data["Data Layer"]
        Prisma["Prisma ORM"]
        DB[(PostgreSQL)]
    end

    subgraph External["External Services"]
        AI["AI Providers<br/>(OpenAI, Anthropic, Google, Groq)"]
        Polar["Payments<br/>(Polar.sh)"]
    end

    UI --> State
    Editor --> State
    State --> tRPCClient
    tRPCClient --> tRPCServer
    tRPCServer --> Auth
    tRPCServer --> Prisma
    API --> Inngest
    Prisma --> DB
    Inngest --> AI
    Auth --> Polar
```

## Project Structure

```
synapse/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication pages
│   ├── (mainlayout)/       # Main application pages
│   ├── api/                # API routes (tRPC, auth, inngest)
│   └── generated/          # Prisma generated client
├── features/               # Feature modules
│   ├── auth/               # Authentication logic
│   ├── editor/             # Workflow canvas editor
│   ├── executions/         # Execution nodes (HTTP Request, etc.)
│   ├── triggers/           # Trigger nodes (Manual, etc.)
│   ├── workflows/          # Workflow CRUD operations
│   └── subscriptions/      # Premium features
├── components/             # Shared UI components
├── trpc/                   # tRPC configuration
├── prisma/                 # Database schema & migrations
├── inngest/                # Background job definitions
└── lib/                    # Utilities and configurations
```

## Data Model

```mermaid
erDiagram
    User ||--o{ WorkFlow : owns
    User ||--o{ Account : has
    User ||--o{ Session : has
    WorkFlow ||--o{ Node : contains
    WorkFlow ||--o{ Connection : contains
    Node ||--o{ Connection : "connects from"
    Node ||--o{ Connection : "connects to"

    User {
        string id PK
        string name
        string email UK
        boolean emailVerified
        string image
    }

    WorkFlow {
        string id PK
        string name
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    Node {
        string id PK
        string workflowId FK
        string name
        NodeType type
        json position
        json data
    }

    Connection {
        string id PK
        string workflowId FK
        string fromNodeId FK
        string toNodeId FK
        string fromOutput
        string toInput
    }
```

## Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Framework | Next.js 16 (App Router) |
| Language  | TypeScript              |
| Database  | PostgreSQL + Prisma     |
| API       | tRPC                    |
| State     | TanStack Query + Jotai  |
| Auth      | better-auth             |
| UI        | Radix UI + Tailwind CSS |
| Editor    | @xyflow/react           |
| AI        | Vercel AI SDK           |
| Jobs      | Inngest                 |
| Payments  | Polar.sh                |

## Getting Started

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

3. **Set up the database**

   ```bash
   bunx prisma migrate dev
   bunx prisma generate
   ```

4. **Run the development server**

   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Node Types

- **INITIAL** - Starting point for workflows
- **MANUAL_TRIGGER** - Manually triggered workflow execution
- **HTTP_REQUEST** - Make HTTP API calls with configurable method, endpoint, and body

## License

Private project.
