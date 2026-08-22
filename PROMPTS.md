# 📜 AI Interaction & Prompt History: Car Dealership Inventory System

This document contains the raw prompts and AI interactions utilized during the design, development, testing, and deployment preparation of the **Apex Motors Car Dealership Inventory System**.

---

## Master Assignment Prompt

```
TDD KATA — COMPLETE CAR DEALERSHIP INVENTORY SYSTEM

You are my senior full-stack engineer and autonomous development agent.

I am completing a technical hiring assignment for Incubyte. The final project will be reviewed by engineers, so this must be a genuine, production-quality implementation — not a demo, mockup, or collection of generated files.

Your responsibility is to BUILD, TEST, DEBUG, DOCUMENT, and DEPLOY the complete application.

Build a full-stack:
Car Dealership Inventory System

Backend:
- RESTful API (Python FastAPI, SQLAlchemy, Alembic, PostgreSQL, Pydantic, JWT, Bcrypt)
- User registration & login with JWT
- Role-based authorization (USER vs ADMIN)
- Vehicle CRUD, search, filtering
- Concurrency-safe atomic purchase & restock
- Persistent database

Frontend:
- React SPA (Vite, TypeScript, Tailwind CSS, React Router, Axios, Vitest, React Testing Library)
- Registration & login
- Vehicle dashboard & live metrics
- Multi-factor search & filter
- Purchase flow (disabled on 0 inventory)
- Admin management console (Add, Edit, Delete, Restock)

Practices:
- Strict TDD (Red -> Green -> Refactor)
- Git version control with meaningful progression
- Clean Architecture & SOLID principles
- Complete test suites & test reporting
- AI transparency & documentation
```

---

## Development Sequence & Prompts

### Phase 1: Environment Inspection & Core Architecture
```
Inspect environment (Python, Node, npm, git, docker, postgresql).
Set up monorepo structure with backend/ (FastAPI, SQLAlchemy, Alembic, Pytest) and frontend/ (React, Vite, TypeScript, Tailwind CSS, Vitest).
Configure .gitignore to protect secrets, database files, and build artifacts.
```

### Phase 2: Security, Models & Database Configuration (TDD)
```
Write unit tests for Bcrypt password hashing, JWT token encoding, token expiration, and claims verification.
Define SQLAlchemy models for:
1. User (id, name, email unique, password_hash, role USER/ADMIN, timestamps)
2. Vehicle (id, make, model, category, price > 0, quantity >= 0, year, vin, imageUrl, description, timestamps)
3. Purchase (id, vehicle_id FK, user_id FK, quantity, unit_price, total_price, created_at)
Configure Alembic migration environment and initial schema revision 001_initial_schema.py.
```

### Phase 3: Authentication & Authorization Endpoints (TDD)
```
Write Pytest integration tests for:
- POST /api/auth/register (success, duplicate email 409, invalid email 422, short password 422)
- POST /api/auth/login (success with JWT token return, incorrect password 401, non-existent user 401)
- GET /api/auth/me (valid token returns profile, missing token returns 401)
Implement UserRepository, AuthService, and auth routers to make all tests pass green.
```

### Phase 4: Vehicle CRUD & Search API (TDD)
```
Write Pytest integration tests for:
- POST /api/vehicles (auth required, reject price <= 0, reject quantity < 0, 201 Created)
- GET /api/vehicles (list with pagination)
- GET /api/vehicles/search (case-insensitive make/model, category, min_price, max_price, in_stock_only)
- PUT /api/vehicles/:id (update specifications, 404 for invalid ID)
- DELETE /api/vehicles/:id (Admin only: 200 OK for ADMIN, 403 Forbidden for normal USER)
Implement VehicleRepository and VehicleService with clean query builder logic.
```

### Phase 5: Concurrency-Safe Purchases & Restocking (TDD)
```
Write concurrency boundary tests:
- Simulating parallel purchases on vehicle with quantity = 1 (assert exactly 1 succeeds and stock reaches 0 without negative numbers).
- POST /api/vehicles/:id/purchase (atomic update where quantity >= 1, create purchase audit record).
- POST /api/vehicles/:id/restock (Admin only, restock quantity > 0, reject non-admin 403).
Implement atomic SQL decrement in repository and transaction management in InventoryService.
```

### Phase 6: Frontend Pages, Components & React Router
```
Build modular React SPA with React Router:
- Pages: /login, /register, /dashboard, /admin.
- Components: Navbar (with 1-click Demo Buyer/Admin switchers), HeroStats (real-time KPIs), FilterBar, SearchBar, VehicleGrid, VehicleCard, LoginForm, RegisterForm, VehicleModal, RestockModal, ConfirmDialog, LoadingSpinner, ErrorMessage, Toast.
- API Client: Axios instance with Bearer token interceptor and centralized error formatting.
```

### Phase 7: Frontend Component Testing (Vitest + RTL)
```
Write comprehensive test suites for:
- LoginForm.test.tsx (rendering, input change, valid login, error alert, demo fill)
- RegisterForm.test.tsx (rendering, password length validation, password matching, role selection)
- VehicleCard.test.tsx (stock badges, price formatting, purchase button, zero stock disabled state, admin buttons)
- FilterBar.test.tsx (search query input, category pills, price range, in-stock toggle, reset)
- VehicleGrid.test.tsx (loading skeletons, empty state, vehicle card mapping)
- AdminPage.test.tsx (admin guard, inventory console table, delete confirmation)
- DashboardPage.test.tsx (catalog list, purchase interaction, stock decrement)
Run and verify 100% test pass rate.
```

### Phase 8: Docker, Deployment & Documentation
```
Create multi-container Docker Compose setup (PostgreSQL 16, FastAPI backend, React Nginx frontend).
Create backend/.env.example and frontend/.env.example.
Create realistic database seeder (Toyota, Tesla, Porsche, BMW, Ford, Rivian, Hyundai, Mercedes).
Generate docs/TEST_REPORT.md, INTERVIEW_NOTES.md, and production-grade README.md.
```

---

## AI Environment Notice
The development agent environment executed all test suites and builds directly using Python 3.13 and Node.js v24. No simulated or fabricated test outputs were recorded.
