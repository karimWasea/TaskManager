# ⚡ Task Manager — Full-Stack ASP.NET Core Clean Architecture + React UI

A production-quality Task Manager web application with an **ASP.NET Core 8** backend following **Clean Architecture** principles, **Entity Framework Core 8** Code-First SQL Server migrations, **FluentValidation**, centralized error handling, and a modern **React (Vite)** frontend.

---

## 📁 Solution Structure

```
D:\Task_ManagerTechnical Task\
├── README.md                               # This file
├── TaskManager/                            # ASP.NET Core 8 Web API Backend
│   ├── TaskManager.slnx                    # .NET Solution file
│   ├── Domain/                             # Entities, Enums, Repository & UoW Interfaces (zero deps)
│   ├── Application/                        # DTOs, FluentValidation, Services (depends on Domain)
│   ├── Infrastructure/                     # EF Core DbContext, Repositories, UoW, Migrations
│   └── TaskManager/                        # Controllers, Middleware, Program.cs (API)
│
└── TaskManagerReactUI/                     # React + Vite Frontend
    ├── src/
    │   ├── api.js                          # Centralized HTTP client service
    │   ├── App.jsx                         # Router + Layout
    │   ├── main.jsx                        # Entry point
    │   ├── index.css                       # Global styles (Inter font, design system)
    │   ├── pages/
    │   │   ├── ProjectsPage.jsx            # Project dashboard (CRUD, search, cards)
    │   │   └── ProjectDetailPage.jsx       # Project detail + task management
    │   └── components/
    │       ├── Modal.jsx                   # Reusable modal dialog
    │       ├── Spinner.jsx                 # Loading spinner
    │       └── StatusBadge.jsx             # Color-coded status pill
    └── vite.config.js                      # Vite config with API proxy
```

---

## 🏗️ Backend Architecture (Clean Architecture)

```
    ┌──────────────────┐
    │   API Layer      │ Controllers, Middleware, Program.cs
    │  (TaskManager)   │ Depends on Application & Infrastructure
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │ Application Layer│ DTOs, Services, Validators
    │  (Application)   │ Depends on Domain only
    └────────┬─────────┘
             │
    ┌────────▼─────────┐    ┌────────────────────┐
    │   Domain Layer   │◄───│ Infrastructure Layer│ EF Core, Repositories
    │    (Domain)      │    │  (Infrastructure)   │ Depends on Application
    │  Zero deps       │    └────────────────────┘
    └──────────────────┘
```

### Key Design Patterns
- **Repository Pattern** with generic `IRepository<T>`, `IProjectRepository`, `ITaskRepository`
- **Unit of Work** (`IUnitOfWork`) — single transaction boundary per HTTP request
- **Service Layer** — `IProjectService` / `ITaskService` with business logic
- **FluentValidation** — DTO input validation with structured error messages
- **Centralized Exception Middleware** — maps exceptions to proper HTTP status codes (400, 404, 500)
- **Dependency Injection** — all services, repositories, and validators registered through DI

### Microservice Readiness (Bonus)
Projects and Tasks are structurally separated at every layer (separate controllers, services, repositories). To split into independent microservices:
- Extract `ProjectService` and `TaskService` into separate API projects
- Replace `UnitOfWork` coupling with HTTP/gRPC calls or event-driven messaging

---

## 🌐 API Endpoints

### Projects (`/api/projects`)

| Method   | Endpoint                   | Description                          |
|----------|----------------------------|--------------------------------------|
| `GET`    | `/api/projects`            | List all projects with task counts   |
| `GET`    | `/api/projects/{id}`       | Get project detail with tasks        |
| `POST`   | `/api/projects`            | Create a new project                 |
| `PUT`    | `/api/projects/{id}`       | Update a project                     |
| `DELETE` | `/api/projects/{id}`       | Delete project (cascades to tasks)   |
| `GET`    | `/api/projects/{id}/tasks` | Get all tasks for a project          |

### Tasks (`/api/tasks`)

| Method   | Endpoint                     | Description                        |
|----------|------------------------------|------------------------------------|
| `GET`    | `/api/tasks`                 | Get all tasks                      |
| `GET`    | `/api/tasks?status=ToDo`     | Filter tasks by status             |
| `GET`    | `/api/tasks/{id}`            | Get task by ID                     |
| `POST`   | `/api/tasks`                 | Create a new task                  |
| `PUT`    | `/api/tasks/{id}`            | Update task                        |
| `PATCH`  | `/api/tasks/{id}/status`     | Change task status only            |
| `DELETE` | `/api/tasks/{id}`            | Delete a task                      |

---

## 🎨 Frontend Features (React)

- **Projects Dashboard**: Responsive card grid, real-time search, "New Project" modal, project deletion
- **Project Detail Page**: Inline project editing, task status filter tabs (All/ToDo/InProgress/Done), task CRUD modal, inline status dropdown change (optimistic UI), task deletion
- **Reusable Components**: Modal, StatusBadge, Spinner
- **Clean Design**: Inter font, dark navy navbar, white cards with hover elevation, color-coded status badges and task card borders

---

## 🗄️ Database

- **SQL Server LocalDB** (`(localdb)\MSSQLLocalDB`)
- **Database**: `TaskManagerDb`
- **Tables**:
  - `Projects` (Id GUID PK, Name, Description, CreatedAt)
  - `Tasks` (Id GUID PK, Title, Description, Status string, DueDate, ProjectId FK → Projects, CreatedAt)
- **FK**: `Tasks.ProjectId` → `Projects.Id` with cascade delete
- **Indexes**: `IX_Tasks_ProjectId`, `IX_Tasks_Status`
- **Migration files** are included in `Infrastructure/Migrations/`

---

## 🛠️ How to Run

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download) (or .NET 10 SDK)
- SQL Server LocalDB (included with Visual Studio)
- [Node.js 18+](https://nodejs.org/)

### Step 1: Backend API

```bash
cd "D:\Task_ManagerTechnical Task\TaskManager"

# Build the solution
dotnet build TaskManager.slnx

# Apply database migrations (creates the database automatically)
dotnet ef database update --project Infrastructure/Infrastructure.csproj --startup-project TaskManager/TaskManager.csproj

# Run the API on http://localhost:5000
dotnet run --project TaskManager/TaskManager.csproj --urls "http://localhost:5000"
```

> **Swagger UI**: http://localhost:5000/swagger

### Step 2: React Frontend

```bash
cd "D:\Task_ManagerTechnical Task\TaskManagerReactUI"

# Install dependencies
npm install

# Start development server
npm run dev
```

> **App**: http://localhost:5173

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so both must be running simultaneously.

---

## 💡 Design Decisions & Assumptions

1. **GUID Primary Keys** — Avoids sequential ID leaks and supports distributed scenarios
2. **Status as String in DB** — `HasConversion<string>()` for SQL readability; indexed for filter performance
3. **Cascade Delete** — Deleting a project removes all associated tasks via FK constraint
4. **FluentValidation** — Structured validation errors with field-level error dictionaries
5. **No AutoMapper** — Deliberate manual mapping for transparency and self-documenting code
6. **React (not Angular)** — Chosen for minimal setup footprint; the API is framework-agnostic
7. **Vite Proxy** — API calls use relative paths (`/api/...`) proxied to the backend, avoiding CORS complexity in dev
8. **Optimistic Status Updates** — Task status changes update the UI immediately before server confirmation for responsiveness

---

## 🚀 What I'd Add With More Time

- JWT authentication & per-user projects
- Pagination & sorting for large task lists
- Kanban drag-and-drop board view
- SignalR real-time task updates
- Unit tests (xUnit + Moq for backend, Vitest for frontend)
- Docker Compose for one-command startup
- CI/CD pipeline with GitHub Actions
