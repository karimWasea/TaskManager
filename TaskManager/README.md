# ⚡ Task Manager — Full-Stack ASP.NET Core Clean Architecture & Angular UI

A robust full-stack Task Manager web application built with **ASP.NET Core 8 Web API** (following strict **Clean Architecture** principles), **Entity Framework Core 8** with Code-First SQL Server migrations, **FluentValidation**, centralized error handling middleware, and an **Angular** frontend.

---

## 📁 Solution Architecture

```
D:\Task_ManagerTechnical Task\
├── TaskManager/                            # ASP.NET Core 8 Web API Backend
│   ├── TaskManager.slnx                    # Solution file
│   ├── Domain/                             # Entities, Enums, BaseEntity & Repository Interfaces
│   ├── Application/                        # DTOs, FluentValidation Validators, Service Interfaces & Services
│   ├── Infrastructure/                     # ApplicationDbContext, Repositories, UnitOfWork, EF Migrations
│   └── TaskManager/                        # Controllers, Middleware, Program.cs (API Layer)
│
└── TaskManagerAngulerUI/TaskManager/       # Angular 19+ Single Page Application
    ├── src/app/core/                       # Models & HTTP Services (ProjectService, TaskService)
    ├── src/app/features/projects-list/     # Projects Dashboard Component (Cards, Search, Create Modal)
    └── src/app/features/project-detail/    # Project Detail Component (Tasks, Status Filters, Add/Edit Tasks)
```

---

## 🏗️ Backend Architecture Layers (Clean Architecture)

```
[ API Layer ] ──► [ Application Layer ] ──► [ Domain Layer ]
[ Infrastructure Layer ] ──► [ Application Layer ] ──► [ Domain Layer ]
```

1. **Domain Layer (`Domain`)**:
   - Zero external dependencies.
   - Domain Entities: `Project`, `TaskItem`, `BaseEntity`.
   - Enums: `TaskItemStatus` (`ToDo`, `InProgress`, `Done`).
   - Abstractions: `IRepository<T>`, `IProjectRepository`, `ITaskRepository`, `IUnitOfWork`.

2. **Application Layer (`Application`)**:
   - Business logic, DTOs (`ProjectDto`, `ProjectDetailDto`, `TaskDto`), FluentValidation rules (`CreateProjectDtoValidator`, `CreateTaskDtoValidator`), and Application Services (`ProjectService`, `TaskService`).

3. **Infrastructure Layer (`Infrastructure`)**:
   - Database persistence via Entity Framework Core 8 (`ApplicationDbContext`).
   - Concrete implementations of `Repository<T>`, `ProjectRepository`, `TaskRepository`, and `UnitOfWork`.
   - EF Core SQL Server migrations.

4. **API / Presentation Layer (`TaskManager`)**:
   - REST API Controllers (`ProjectsController`, `TasksController`).
   - Centralized `ExceptionHandlingMiddleware` for consistent error handling and standard status codes (400 Bad Request, 404 Not Found, 500 Internal Server Error).
   - Swagger OpenAPI documentation & CORS integration.

---

## 🚀 Microservice Readiness (Bonus Requirement)

The system is designed so that the **Projects** and **Tasks** modules are loosely coupled:
- `ProjectsController` & `ProjectService` manage Project domain boundaries.
- `TasksController` & `TaskService` manage Task domain boundaries.
- The `IUnitOfWork` boundary orchestrates transactional consistency.
- To split into independent microservices (`ProjectsService` and `TasksService`), you can separate the `DbContext` models and convert foreign key navigation references into IDs communicated over gRPC or HTTP events with minimal refactoring.

---

## 🌐 API Endpoints Summary

### Projects API (`/api/projects`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List all projects with task counts |
| `GET` | `/api/projects/{id}` | Get detailed project information with all tasks |
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects/{id}` | Update project details |
| `DELETE` | `/api/projects/{id}` | Delete a project and cascade delete all its tasks |
| `GET` | `/api/projects/{id}/tasks` | Get all tasks for a specific project |

### Tasks API (`/api/tasks`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks across projects |
| `GET` | `/api/tasks?status=InProgress` | Filter tasks globally by status (`ToDo`, `InProgress`, `Done`) |
| `GET` | `/api/tasks/{id}` | Get task details by ID |
| `POST` | `/api/tasks` | Create a new task linked to a project |
| `PUT` | `/api/tasks/{id}` | Update task title, description, status, due date |
| `PATCH` | `/api/tasks/{id}/status` | Change task status directly |
| `DELETE` | `/api/tasks/{id}` | Delete a task |

---

## 🛠️ How to Run the Application

### Step 1: Run the Backend API

```bash
cd "D:\Task_ManagerTechnical Task\TaskManager"
dotnet build TaskManager.slnx
dotnet ef database update --project Infrastructure/Infrastructure.csproj --startup-project TaskManager/TaskManager.csproj
dotnet run --project TaskManager/TaskManager.csproj --urls "http://localhost:5000"
```

Swagger URL: `http://localhost:5000/swagger`

### Step 2: Run the Angular Frontend

```bash
cd "D:\Task_ManagerTechnical Task\TaskManagerAngulerUI\TaskManager"
npm start
```

App URL: `http://localhost:4200`
