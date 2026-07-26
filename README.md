# ⚡ Task Manager — ASP.NET Core 8 Clean Architecture + Angular UI

A production-quality full-stack Task Manager application built with **ASP.NET Core 8 Web API** (Clean Architecture, SQL Server EF Core 8 Code-First migrations, FluentValidation, generic Result Pattern) and an **Angular 19/22** frontend single-page application.

---

## 📁 Project Structure (2 Core Projects)

```
D:\Task_ManagerTechnical Task\
├── README.md                               # Full technical documentation
├── TaskManager/                            # 1. ASP.NET Core 8 Web API Backend
│   ├── TaskManager.slnx                    # .NET Solution file
│   ├── Domain/                             # Entities, Enums, Repository & UoW Interfaces
│   ├── Application/                        # DTOs, FluentValidation, Services, Result Pattern
│   ├── Infrastructure/                     # EF Core DbContext, Repositories, Migrations
│   └── TaskManager/                        # Controllers, Middleware, Program.cs (API)
│
└── TaskManagerAngulerUI/                   # 2. Angular Frontend UI
    └── TaskManager/                        # Angular SPA (HttpClient, Standalone components)
        ├── src/
        │   ├── app/
        │   │   ├── core/
        │   │   │   ├── models/             # Project & Task models, ApiResult, PagedResult
        │   │   │   └── services/           # ProjectService & TaskService (HttpClient)
        │   │   └── features/
        │   │       ├── projects-list/      # Dashboard (search, list, pagination, create modal)
        │   │       └── project-detail/     # Project detail (inline edit, task CRUD, status tabs, pagination)
        │   └── styles.css                  # Global Bootstrap 5 styles & pop-up modal styling
        └── angular.json
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
    │ Application Layer│ DTOs, Services, Validators, Result<T>
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
- **Repository Pattern & Unit of Work**: Generic `IRepository<T>`, `IProjectRepository`, `ITaskRepository`, `IUnitOfWork`
- **Result Pattern (`Result<T>`)**: All API responses wrap payloads in a standardized `Result<T>` structure (`IsSuccess`, `Data`, `Message`, `Errors`)
- **ABP-Style Request Objects**: `GetProjectsInputDto` and `GetTasksInputDto` (`PageNumber`, `PageSize`, `Sorting`, `Search`, `Status`)
- **FluentValidation**: Input validation for DTOs with error mapping
- **Global Error Handling**: Custom `ExceptionHandlingMiddleware` for HTTP status code mapping

---

## 🌐 API Endpoints

### Projects (`/api/projects`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | List projects (supports `pageNumber`, `pageSize`, `search`) |
| `GET` | `/api/projects/{id}` | Get project details with tasks |
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects/{id}` | Update project details |
| `DELETE` | `/api/projects/{id}` | Delete project (cascades to tasks) |
| `GET` | `/api/projects/{id}/tasks` | Get project tasks (supports `status`, `pageNumber`, `pageSize`) |

### Tasks (`/api/tasks`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports `status`, `pageNumber`, `pageSize`) |
| `GET` | `/api/tasks/{id}` | Get task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/{id}` | Update task details |
| `PATCH` | `/api/tasks/{id}/status` | Direct task status update |
| `DELETE` | `/api/tasks/{id}` | Delete task |

---

## 🚀 How to Run

### 1. Backend API (ASP.NET Core 8)
```bash
cd "D:\Task_ManagerTechnical Task\TaskManager"
dotnet build TaskManager.slnx
dotnet run --project TaskManager/TaskManager.csproj --urls "http://localhost:5000"
```
> **Swagger UI**: http://localhost:5000/swagger

### 2. Angular Frontend UI
```bash
cd "D:\Task_ManagerTechnical Task\TaskManagerAngulerUI\TaskManager"
npm install
npm start
```
> **App**: http://localhost:4200
