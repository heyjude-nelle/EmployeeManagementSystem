# Employee Management System

A simple full-stack Employee Management System built with **Angular** and **ASP.NET Core Web API**. It lets you list, search, create, and edit employees through a REST API backed by SQL Server and a standalone-component Angular frontend.

## Project Overview

The application is split into two independently runnable projects:

- **Backend** — an ASP.NET Core Web API exposing CRUD endpoints for employees, using a Controller → Service → EF Core layering with DTOs and validation.
- **Frontend** — an Angular single-page app with two screens: an employee list (with name search) and an employee form (add/edit with reactive-form validation).

### Features

- List all employees in a table
- Search bar to filter employees by name in real time (disabled when there is no data)
- Create a new employee button in header
- Edit an existing employee button per row
- Saving the form routes back to the employee list
- Submit button stays disabled until the form is valid and has unsaved changes
- Empty state with distinct messages for "no employees yet" and "failed to load"
- Client-side and server-side validation
- Swagger UI for exploring the API

### API Endpoints

| Method | Route                 | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/employees`      | List all employees    |
| GET    | `/api/employees/{id}` | Get a single employee |
| POST   | `/api/employees`      | Create an employee    |
| PUT    | `/api/employees/{id}` | Update an employee    |
| DELETE | `/api/employees/{id}` | Delete an employee\*  |

\* `DELETE` is included for testing, and is not available in the UI.

### Employee Model

| Field              | Type   | Notes                                                      |
| ------------------ | ------ | ---------------------------------------------------------- |
| `EmployeeId`       | int    | Auto-generated primary key                                 |
| `FirstName`        | string | Required, max 100 chars                                    |
| `LastName`         | string | Required, max 100 chars                                    |
| `Email`            | string | Required, valid email format                               |
| `Department`       | enum   | Optional. e.g. `Engineering`, `HumanResources`, `Sales`, … |
| `EmploymentStatus` | enum   | `Hired`, `Active`, `Benched`, `OnLeave`, `Terminated`      |

## Technologies Used

**Backend**

- ASP.NET Core Web API (.NET 10)
- Entity Framework Core (SQL Server / LocalDB)
- Controllers + Services with Dependency Injection
- DTOs with DataAnnotations validation
- Swagger / OpenAPI (Swashbuckle)
- xUnit + EF Core In-Memory provider for tests

**Frontend**

- Angular 22 (standalone components)
- Reactive Forms
- HttpClient + Angular Router
- Angular Signals
- Vitest for unit tests

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 22.22+ (or 24.15+) and npm
- SQL Server LocalDB (bundled with Visual Studio, or via the [SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads) installer)
- EF Core CLI tools (for applying migrations):
  ```bash
  dotnet tool install --global dotnet-ef
  ```

## Setup — Backend

From the repository root:

```bash
cd backend/EmployeeManagementSystem.Api
```

1. **Restore dependencies**

   ```bash
   dotnet restore
   ```

2. **Apply the database migration** (creates the `EmployeeManagementDb` database in LocalDB):

   ```bash
   dotnet ef database update
   ```

   The connection string lives in [`appsettings.json`](backend/EmployeeManagementSystem.Api/appsettings.json). By default it targets:

   ```
   Server=(localdb)\mssqllocaldb;Database=EmployeeManagementDb;Trusted_Connection=True;
   ```

   Adjust it if you use a different SQL Server instance.

3. **Run the API**

   ```bash
   dotnet run
   ```

   The API starts at **http://localhost:5178**. Swagger UI is available at **http://localhost:5178/swagger**.

   > CORS is pre-configured to allow the Angular dev server at `http://localhost:4200`.

## Setup — Frontend

From the repository root, in a separate terminal:

```bash
cd frontend
```

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the dev server**

   ```bash
   npm start
   ```

   The app is served at **http://localhost:4200** and calls the API at `http://localhost:5178/api` (configured in [`src/environments/environment.development.ts`](frontend/src/environments/environment.development.ts)).

   > Start the backend first so the frontend has data to load.

## Running Tests

**Backend** (from `backend/EmployeeManagementSystem.Api.Tests/`):

```bash
dotnet test
```

Runs xUnit tests covering service logic (`EmployeeService`) and DTO validation.

**Frontend** (from `frontend/`):

```bash
npm test
```

Runs Vitest specs covering the app shell, employee service, list component, and form validation.

### Testing queries with the `.http` file

A ready-to-use [`EmployeeManagementSystem.Api.http`](backend/EmployeeManagementSystem.Api/EmployeeManagementSystem.Api.http) file is included with sample requests for every endpoint (GET all, GET by id, POST, PUT, DELETE). With the API running, open the file in:

- **Visual Studio 2022** (17.8+) — `.http` files are supported out of the box, no extension needed.
- **VS Code** — install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension by Huachao Mao (`humao.rest-client`).

Then click **Send Request** above any request block to exercise the API without leaving your editor.

## Git Conventions

Work is done on short-lived branches and merged into `main` through pull requests.

**Branch naming** — `type/short-description` in kebab-case:

| Prefix      | Used for                                | Example                     |
| ----------- | --------------------------------------- | --------------------------- |
| `feat/`     | new functionality                        | `feat/employee-form`        |
| `fix/`      | bug fixes                                | `fix/employee-id-field`     |
| `test/`     | adding or updating tests                 | `test/frontend-unit-tests`  |
| `docs/`     | documentation changes                    | `docs/readme`               |
| `style/`    | visual or formatting tweaks              | `style/update-browser-tab`  |
| `refactor/` | restructuring without behavior change    | `refactor/extract-types`    |

**Commit messages** — [Conventional Commits](https://www.conventionalcommits.org/) style, lowercase, imperative mood: `type: short description`.

```
feat: add employee service
fix: rename id to employeeid
test: add frontend unit tests
docs: add project readme
```

## Design Decisions

| Decision | Rationale |
| -------- | --------- |
| **Layered backend** — Controller → Service → EF Core, with DTOs | Controllers stay thin, business logic is testable in isolation, and EF entities are never exposed directly over the API. |
| **Validation on both sides** | Reactive Forms validators give instant UX feedback; DataAnnotations on the DTOs are the authoritative server-side check. Both enforce the same rules (e.g. 100-char names). |
| **Enums serialized as strings** | `JsonStringEnumConverter` with integer values rejected — self-documenting API payloads and no silently accepted invalid values. |
| **Service layer in Angular** | Components never touch `HttpClient` directly — `EmployeeService` owns the API URLs and error handling. |
| **No state-management store** | Components hold local state in signals and re-fetch on navigation; at this scale a store (e.g. NgRx) would add complexity without benefit. |
| **UX guards** | Empty state distinguishes "no data" from "failed to load"; search is disabled when there is nothing to search; submit is disabled until the form is valid and changed. |
| **Testing approach** | Backend services are tested against EF Core's In-Memory provider; frontend Vitest specs cover service calls, list rendering, and form validation through the DOM. |

## Assumptions & Limitations

- **Database provider:** SQL Server LocalDB is assumed for local development (Windows-only). Any EF Core-compatible SQL Server instance works by updating the connection string — e.g. a SQL Server Docker container on macOS/Linux.
- **Migrations are not applied automatically** on startup — run `dotnet ef database update` before first launch.
- **No authentication/authorization** — all endpoints are open, as it is out of scope for this challenge.
- **No seed data** — the database starts empty; add employees via the UI, Swagger, or the `.http` file.
- **Search** is a case-insensitive client-side filter on the full name, applied over the already-loaded list (suitable for the expected small dataset).
- **Department is optional; EmploymentStatus defaults to `Hired`** for new employees.
- **First and last names are assumed to be at most 100 characters.** This is enforced on both the client (`maxLength(100)`) and the server (`[StringLength(100)]`), though the form does not render a dedicated max-length error message.
- The API runs over plain **HTTP (5178)** in development to keep the frontend setup friction-free; an HTTPS profile (7186) is also available in `launchSettings.json`.
