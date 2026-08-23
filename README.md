# 🏎️ Apex Motors: Car Dealership Inventory System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pytest](https://img.shields.io/badge/pytest-44%20passed-brightgreen.svg?style=flat&logo=pytest&logoColor=white)](https://pytest.org)
[![Vitest](https://img.shields.io/badge/vitest-27%20passed-brightgreen.svg?style=flat&logo=vitest&logoColor=white)](https://vitest.dev)
[![Coverage](https://img.shields.io/badge/backend%20coverage-96%25-brightgreen.svg?style=flat)]()

A full-stack, enterprise-grade **Car Dealership Inventory Management System** built with **Test-Driven Development (TDD)**, clean layered architecture, **FastAPI (Python 3.13)**, **SQLAlchemy 2.0 ORM**, **Alembic migrations**, a persistent relational database (**PostgreSQL & SQLite**), and a reactive **React 18 SPA** with **TypeScript**, **Tailwind CSS**, and **Vitest / React Testing Library**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [API Endpoint Table](#api-endpoint-table)
- [User Roles](#user-roles)
- [TDD Approach](#tdd-approach)
- [Red-Green-Refactor](#red-green-refactor)
- [Local Setup](#local-setup)
- [PostgreSQL Setup](#postgresql-setup)
- [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
- [Backend Installation](#backend-installation)
- [Frontend Installation](#frontend-installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Live Demo](#live-demo)
- [Git Repository](#git-repository)
- [My AI Usage](#my-ai-usage)
- [Security Considerations](#security-considerations)
- [Design Decisions](#design-decisions)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## Overview

The **Car Dealership Inventory System** is engineered to provide vehicle dealerships with a high-integrity, real-time inventory management and purchasing platform. It demonstrates production-level engineering practices including:

1. **Strict Concurrency Safety**: Guaranteed non-negative inventory via atomic row-level database updates during checkout.
2. **Layered Clean Architecture**: Strict separation of concerns (Routers &rarr; Services &rarr; Repositories &rarr; Database Models).
3. **Role-Based Access Control (RBAC)**: Dual permission levels with cryptographic JWT authentication.
4. **Complete TDD Test Suites**: 44 backend integration/unit tests (96% code coverage) and 27 frontend component tests.
5. **Production Dockerization**: Full-stack multi-container Docker Compose setup with health checks.

---

## Features

### Backend (FastAPI REST API)
- **JWT Authentication**: Secure registration and login issuing signed JSON Web Tokens.
- **Argon2 / Bcrypt Password Hashing**: Passwords are salted and hashed; plaintext passwords are never stored.
- **RBAC Authorization**: Reusable dependency guards (`get_current_user`, `require_admin`).
- **Vehicle Catalog CRUD**: Full create, read, update, and admin-only deletion capabilities.
- **Multi-Factor Search & Filtering**: Case-insensitive filtering by make, model, category, and minimum/maximum price bounds.
- **Atomic Purchases**: Transactions decremented safely via `UPDATE ... WHERE quantity > 0` atomic queries.
- **Restock Management**: Admin-only inventory increment with validation guards.
- **Audit Logging**: Dedicated `purchases` ledger tracking buyer, vehicle ID, unit price, total price, and timestamp.
- **Interactive OpenAPI Documentation**: Auto-generated Swagger UI (`/docs`) and ReDoc (`/redoc`).

### Frontend (React SPA)
- **Responsive Automotive Design**: Sleek dark theme with modern glassmorphism, responsive grid, and Tailwind CSS.
- **Live Inventory Metrics (HeroStats)**: KPI indicators for total models, available stock units, low-stock warnings, and sold-out items.
- **Dynamic Search & Filter Bar**: Instant multi-condition search with category pills and price sliders.
- **Interactive Vehicle Cards**: Badges for category, stock level (🟢 In Stock, 🟡 Low Stock, 🔴 Out of Stock), and pricing.
- **Protected Purchase Flow**: Disabled purchase buttons with clear "SOLD OUT" indicators when stock reaches 0.
- **Admin Management Portal**: Administrative console to create, update, delete, and restock vehicles with confirmation modals.
- **Demo Quick-Login Switchers**: One-click login shortcuts in the navbar for fast persona testing (`Buyer` vs `Admin`).
- **Real-Time Toast Feedback**: Toast notification banner alerts for all state transitions and API errors.

---

## Technology Stack

### Backend
- **Language**: Python 3.13
- **Framework**: FastAPI 0.115+
- **ORM & DB Toolkit**: SQLAlchemy 2.0+ & Alembic 1.14+
- **Data Validation & Settings**: Pydantic v2 & Pydantic-Settings
- **Security & Cryptography**: Bcrypt, Passlib, Python-Jose (JWT)
- **Testing**: Pytest 8.3+, Pytest-Cov 6.0+, Pytest-Asyncio, HTTPX

### Frontend
- **Framework**: React 18 (Vite Bundler)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS 3.4+, PostCSS, Lucide React Icons
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (with Bearer Token Interceptors)
- **Testing**: Vitest 4.1+, React Testing Library, JSDOM, User-Event

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 16 (production/Docker) & SQLite (local development fallback)
- **Web Server / Reverse Proxy**: Nginx (Frontend container) & Uvicorn ASGI (Backend)
- **Version Control**: Git & GitHub

---

## Architecture

The project adheres to **Clean Architecture** and **SOLID principles**, isolating data persistence, business logic, and transport layers.

```
┌─────────────────────────────────────────────────────────────┐
│                 React SPA (Vite / TypeScript)               │
│   Navbar | VehicleGrid | FilterBar | Modals | AuthContext   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (Axios + JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FastAPI REST API Layer                      │
│     Routers: /api/auth | /api/vehicles | /api/inventory     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Dependencies & Security
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Service Layer (Business Logic)              │
│       AuthService | VehicleService | InventoryService       │
└──────────────────────────────┬──────────────────────────────┘
                               │ Repository Pattern
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Data Access Layer (SQLAlchemy ORM)          │
│       UserRepository | VehicleRepository | PurchaseRepo     │
└──────────────────────────────┬──────────────────────────────┘
                               │ SQL Transactions / Row-Locks
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 PostgreSQL / SQLite Database                │
│             users | vehicles | purchases tables             │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
car-dealership-inventory/
├── backend/
│   ├── alembic/                 # Database migration environments
│   │   ├── versions/            # 001_initial_schema.py
│   │   └── env.py
│   ├── app/
│   │   ├── core/                # Config, Database engine, Security utilities
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── dependencies/        # JWT & RBAC dependency injection
│   │   │   └── auth.py          # get_current_user, require_admin
│   │   ├── models/              # SQLAlchemy declarative models
│   │   │   ├── user.py
│   │   │   ├── vehicle.py
│   │   │   └── purchase.py
│   │   ├── repositories/        # Database query abstractions
│   │   │   ├── user_repository.py
│   │   │   ├── vehicle_repository.py
│   │   │   └── purchase_repository.py
│   │   ├── routers/             # FastAPI APIRouters
│   │   │   ├── auth.py
│   │   │   ├── vehicles.py
│   │   │   └── inventory.py
│   │   ├── schemas/             # Pydantic request/response models
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── vehicle.py
│   │   │   └── inventory.py
│   │   ├── services/            # Core business domain logic
│   │   │   ├── auth_service.py
│   │   │   ├── vehicle_service.py
│   │   │   └── inventory_service.py
│   │   ├── utils/               # Realistic seed scripts
│   │   │   └── seed.py
│   │   └── main.py              # Application entrypoint & CORS
│   ├── tests/                   # Pytest suite (44 tests)
│   │   ├── conftest.py          # Isolated test database fixtures
│   │   ├── integration/         # REST API endpoint tests
│   │   └── unit/                # Concurrency, boundary, security tests
│   ├── alembic.ini
│   ├── pytest.ini
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios client & JWT interceptors
│   │   │   └── client.ts
│   │   ├── components/          # Reusable UI components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── HeroStats.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── RestockModal.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── VehicleCard.tsx
│   │   │   ├── VehicleGrid.tsx
│   │   │   └── VehicleModal.tsx
│   │   ├── context/             # AuthContext state provider
│   │   │   └── AuthContext.tsx
│   │   ├── pages/               # React Router page views
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── types/               # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── setupTests.ts
│   ├── tests/                   # Vitest & React Testing Library (27 tests)
│   │   ├── AdminPage.test.tsx
│   │   ├── DashboardPage.test.tsx
│   │   ├── FilterBar.test.tsx
│   │   ├── LoginForm.test.tsx
│   │   ├── RegisterForm.test.tsx
│   │   ├── VehicleCard.test.tsx
│   │   └── VehicleGrid.test.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── docs/
│   └── TEST_REPORT.md           # Comprehensive test execution report
├── screenshots/                 # Real application UI captures
├── docker-compose.yml
├── .gitignore
├── README.md
├── PROMPTS.md                   # Complete AI interaction transcript
└── INTERVIEW_NOTES.md           # Comprehensive technical interview guide
```

---

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ PURCHASES : places
    VEHICLES ||--o{ PURCHASES : records

    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        string role "USER | ADMIN"
        datetime created_at
        datetime updated_at
    }

    VEHICLES {
        int id PK
        string make
        string model
        string category
        float price "CHECK (price > 0)"
        int quantity "CHECK (quantity >= 0)"
        string year
        string vin
        string image_url
        string description
        datetime created_at
        datetime updated_at
    }

    PURCHASES {
        int id PK
        int vehicle_id FK
        int user_id FK
        int quantity
        float unit_price
        float total_price
        datetime created_at
    }
```

### Concurrency & Inventory Safety
Purchases execute atomically using database transactions. The quantity update checks inventory availability directly in the atomic SQL statement:
```sql
UPDATE vehicles
SET quantity = quantity - :qty, updated_at = :now
WHERE id = :vehicle_id AND quantity >= :qty;
```
If the affected rows count is 0 (due to concurrent purchases exhausting inventory), the transaction aborts and returns an HTTP `400 Bad Request` ("Vehicle is out of stock"), eliminating race-condition oversales.

---

## Authentication

Authentication is implemented using stateless **JSON Web Tokens (JWT)** with the `HS256` algorithm.

1. **Registration** (`POST /api/auth/register`): Validates email format and password strength, salts and hashes the password via `bcrypt`, inserts the user record, and issues an access token.
2. **Login** (`POST /api/auth/login`): Verifies credentials against the bcrypt hash and returns a signed bearer token.
3. **Bearer Verification**: Incoming authenticated requests supply the `Authorization: Bearer <token>` header, parsed by FastAPI's `OAuth2PasswordBearer` dependency.

---

## API Documentation

FastAPI provides automated interactive documentation out of the box:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

---

## API Endpoint Table

| Method | Endpoint                   | Auth | Role       | Description                                  |
| ------ | -------------------------- | ---- | ---------- | -------------------------------------------- |
| POST   | `/api/auth/register`       | No   | Public     | Register a new user account                  |
| POST   | `/api/auth/login`          | No   | Public     | Authenticate and receive JWT access token    |
| GET    | `/api/auth/me`             | Yes  | User/Admin | Retrieve current authenticated user profile  |
| POST   | `/api/vehicles`            | Yes  | Admin | Add a new vehicle to catalog                 |
| GET    | `/api/vehicles`            | Yes  | User/Admin | List all catalog vehicles with pagination    |
| GET    | `/api/vehicles/search`     | Yes  | User/Admin | Search vehicles by make, model, price range  |
| GET    | `/api/vehicles/{id}`       | Yes  | User/Admin | Get detailed vehicle information by ID       |
| PUT    | `/api/vehicles/{id}`       | Yes  | Admin | Update vehicle specifications                |
| DELETE | `/api/vehicles/{id}`       | Yes  | Admin      | Permanently remove vehicle (Admin only)      |
| POST   | `/api/vehicles/{id}/purchase` | Yes  | User/Admin | Purchase vehicle and decrement stock atomically |
| POST   | `/api/vehicles/{id}/restock`  | Yes  | Admin      | Restock vehicle quantity (Admin only)        |

---

## User Roles

| Role | Permissions |
| ---- | ----------- |
| **USER** (Customer) | View catalog, search/filter vehicles, purchase available inventory, view purchase audit confirmations. |
| **ADMIN** (Staff) | All `USER` capabilities plus: Add new vehicle records, edit any vehicle, delete vehicle records, and restock units. |

---

## TDD Approach

Development followed strict **Test-Driven Development (TDD)**:
1. **Red**: Test cases were authored before writing business logic (e.g. invalid price rejection, non-negative inventory constraints, non-admin deletion guards).
2. **Green**: Minimum code was written in repositories and services to satisfy test assertions.
3. **Refactor**: Code was refined into clean architectural layers, removing duplication and enforcing strict Pydantic schemas.

---

## Red-Green-Refactor

Example from the inventory purchase module:
- 🔴 **Red**: Wrote `test_purchase_out_of_stock_rejected` and `test_purchase_race_condition_does_not_oversell` asserting that purchasing a vehicle with `quantity = 0` returns `HTTP 400`.
- 🟢 **Green**: Implemented atomic query decrement in `VehicleRepository.decrement_quantity` with strict `quantity >= qty` condition.
- 🔵 **Refactor**: Wrapped the operation in a unified `InventoryService` managing database transactions and automatic audit logging in the `purchases` table.

---

## Local Setup

### Prerequisites
- Python 3.13+
- Node.js v20+ & npm 10+
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Gnaneshwari017/car-dealership-inventory-system.git
cd car-dealership-inventory-system
```

---

## PostgreSQL Setup

To run with local PostgreSQL:
1. Create a database: `CREATE DATABASE dealership_db;`
2. Configure `.env` in `backend/`:
   ```env
   DATABASE_URL=postgresql+psycopg2://postgres:yourpassword@localhost:5432/dealership_db
   ```
3. Run migrations: `alembic upgrade head`
4. Seed catalog: `python -m app.utils.seed`

*(Note: SQLite is also fully supported out-of-the-box via `sqlite:///./dealership.db` for zero-setup local execution).*

---

## Docker Setup

Run the entire full-stack application (PostgreSQL + FastAPI + React Nginx) with a single command:

```bash
docker compose up --build
```

Services will be available at:
- **Frontend SPA**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`
- **PostgreSQL**: `localhost:5432`

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=sqlite:///./dealership.db
JWT_SECRET=your-secure-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
ENVIRONMENT=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=/api
```

---

## Backend Installation

```bash
cd backend
python -m pip install -r requirements.txt
python -m app.utils.seed
```

---

## Frontend Installation

```bash
cd frontend
npm install
```

---

## Running the Application

### Terminal 1: Backend Server
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Terminal 2: Frontend Client
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Running Tests

### Backend Tests (Pytest)
```bash
cd backend
python -m pytest --cov=app --cov-report=term-missing
```

### Frontend Tests (Vitest)
```bash
cd frontend
npm test
```

---

## Test Coverage

### Backend Coverage Summary (96% Coverage)
```
Name                                      Stmts   Miss  Cover   Missing
-----------------------------------------------------------------------
app/core/config.py                           22      0   100%
app/core/database.py                         14      4    71%
app/core/security.py                         27      2    93%
app/dependencies/auth.py                     27      3    89%
app/main.py                                  14      0   100%
app/models/purchase.py                       17      1    94%
app/models/user.py                           18      1    94%
app/models/vehicle.py                        16      1    94%
app/repositories/purchase_repository.py      15      0   100%
app/repositories/user_repository.py          15      0   100%
app/repositories/vehicle_repository.py       39      0   100%
app/routers/auth.py                          20      0   100%
app/routers/inventory.py                     16      0   100%
app/routers/vehicles.py                      33      0   100%
app/schemas/auth.py                          20      0   100%
app/schemas/inventory.py                     17      0   100%
app/schemas/user.py                          16      0   100%
app/schemas/vehicle.py                       18      0   100%
app/services/auth_service.py                 27      0   100%
app/services/inventory_service.py            41      1    98%
app/services/vehicle_service.py              32      1    97%
app/utils/seed.py                            33      5    85%
-----------------------------------------------------------------------
TOTAL                                       497     19    96%
============================= 44 passed in 15.03s =============================
```

### Frontend Test Results
```
 Test Files  7 passed (7)
      Tests  27 passed (27)
   Start at  18:08:56
   Duration  11.84s
```

---

## Screenshots

The application UI includes realistic data and states:

| Dashboard & Catalog | Admin Management Console |
| :---: | :---: |
| ![Dashboard](screenshots/dashboard.svg) | ![Admin Console](screenshots/admin_dashboard.svg) |

| Sign In & Quick Switcher | Add / Edit Vehicle Modal |
| :---: | :---: |
| ![Login Form](screenshots/login.svg) | ![Add Vehicle](screenshots/add_vehicle.svg) |

---

## Deployment

### Frontend (Vercel)
1. Import repository on Vercel.
2. Root directory: `frontend`.
3. Set Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`.
4. Deploy!

### Backend (Render / Railway)
1. Create a new Web Service pointing to `backend/Dockerfile` or standard Python environment.
2. Build Command: `pip install -r requirements.txt && alembic upgrade head && python -m app.utils.seed`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables:
   - `DATABASE_URL`: Your managed PostgreSQL connection URL
   - `JWT_SECRET`: Random 256-bit string
   - `CORS_ORIGINS`: `https://your-frontend.vercel.app`

---

## Live Demo

- **Frontend URL**: `https://apex-motors-dealership.vercel.app` *(or local `http://localhost:5173`)*
- **Backend API**: `https://apex-motors-api.onrender.com` *(or local `http://localhost:8000`)*
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

### Demo Credentials
- **Admin**: `admin@dealership.com` / `Admin@123`
- **Buyer**: `customer@dealership.com` / `Customer@123`

---

## Git Repository

- **Branch**: `main`
- **Commit Convention**: Conventional Commits (`feat:`, `test:`, `fix:`, `docs:`, `chore:`)
- **Repository URL**: `https://github.com/Gnaneshwari017/car-dealership-inventory-system`

---

## My AI Usage

### AI Tools Used
- **Google DeepMind Antigravity Coding Agent (Gemini 3.7 Flash)** used for test generation, code scaffolding, and architecture auditing.

### Why AI Was Used
- To accelerate boilerplate setup (Alembic configuration, TypeScript interface mapping, Tailwind UI components) while adhering to TDD test-first rigor.

### What AI Generated
- Initial test suites for Pytest and Vitest based on user requirement specifications.
- FastAPI router, service, and repository boilerplate.
- Tailwind CSS UI layout and mock vehicle seed catalog.

### What AI Helped Debug
- Resolution of TypeScript strict type inferences in React 18 event handlers.
- Database transaction boundaries in pytest fixtures to prevent cross-test state leakage.
- Race condition testing under multi-threaded purchase simulations.

### How Tests Were Created
- Test files were written first following Red-Green-Refactor. The agent generated failing test assertions for status codes, edge cases (e.g. price &le; 0, duplicate email, non-admin delete), and then implemented the minimum code required to satisfy the assertions.

### What Was Manually Reviewed
- Database constraint definitions (`CHECK (price > 0)`, `CHECK (quantity >= 0)`).
- SQL atomic update queries to ensure database concurrency safety.
- Password hashing rounds and JWT token expiry lifetimes.

### How AI Improved Development Speed
- Reduced manual typing time for CRUD endpoints, Pydantic validation models, and React UI components by ~70%.

### Limitations of AI
- AI models occasionally generate syntax variations between testing library versions (e.g., Jest vs Vitest syntax). Manual verification and test execution in the live runtime were required to ensure 100% pass rates.

### How Correctness Was Verified
- Every single test was executed in the real Python 3.13 and Node.js v24 runtime.
- 44 Pytest backend tests and 27 Vitest frontend tests were executed and passed without mock failures.

---

## Security Considerations

1. **Password Security**: Salted Bcrypt hashing ensures passwords are never readable even if database storage is compromised.
2. **SQL Injection Prevention**: Parameterized queries via SQLAlchemy ORM prevent SQL injection vectors.
3. **Strict RBAC**: Critical operations (e.g., vehicle deletion, restocking) check claims directly on the cryptographically validated JWT payload in backend dependencies.
4. **Environment Isolation**: No hardcoded API keys or secrets; all configurations are driven by `.env` with fallback templates.
5. **CORS Hardening**: CORS origins are strictly configurable per environment.

---

## Design Decisions

1. **FastAPI over Flask/Django**: Native asynchronous support, automatic OpenAPI schema generation, and high-speed execution with Pydantic serialization.
2. **SQLAlchemy 2.0 Repository Pattern**: Decoupled database queries from business logic to enable unit testing and database portability between SQLite and PostgreSQL.
3. **Atomic SQL Updates for Purchases**: Avoiding Python-level read-modify-write loops prevents inventory overselling under high concurrency.
4. **React SPA with Tailwind CSS**: Fast, reactive client interface with modular components and zero runtime CSS overhead.

---

## Known Limitations

1. **Simulated Payment Gateway**: Purchases decrement inventory and create audit records, but do not connect to live Stripe/PayPal payment processors.
2. **Single-Currency Support**: All vehicle prices are in USD.

---

## Future Improvements

1. **Stripe Payment Gateway Integration**: Real-time card processing and webhook fulfillment.
2. **Customer Test-Drive Booking**: Appointment scheduler calendar for in-person vehicle test drives.
3. **Vehicle Image Upload**: Direct S3 / Cloudinary image uploads for dealership staff.
4. **Financing / Loan Calculator**: Interactive monthly loan installment estimation widget on vehicle cards.

---
&copy; 2026 Apex Motors Inc. Built for the Incubyte Technical Hiring Assessment.
