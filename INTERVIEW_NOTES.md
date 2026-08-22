# 🎙️ Car Dealership Inventory System — Technical Interview Notes

This document provides a concise, structured guide designed to help a candidate clearly explain every architectural, technological, and algorithmic decision during an engineering interview at **Incubyte**.

---

## 1. Architecture Overview
- **Pattern**: Layered Clean Architecture with Repository Pattern and strict Separation of Concerns.
- **Data Flow**: `React SPA (Client)` &rarr; `FastAPI Routers (HTTP Transport)` &rarr; `Dependencies (JWT/RBAC Auth)` &rarr; `Service Layer (Domain Business Rules)` &rarr; `Repository Layer (Database Query Logic)` &rarr; `SQLAlchemy ORM (Data Access)` &rarr; `PostgreSQL / SQLite Database`.
- **Decoupling**: Business logic does not depend on database drivers or transport mechanisms, allowing modular unit testing and independent evolution.

---

## 2. Why FastAPI?
- **High Throughput & Speed**: Built on Starlette (ASGI) and Pydantic (Rust-based core `pydantic-core`), rivaling Node.js and Go in raw HTTP throughput.
- **Type Safety & Data Validation**: Native Python type hints eliminate repetitive input sanitization; automatic JSON schema validation generates informative HTTP 422 errors.
- **Automated Interactive Docs**: Swagger UI (`/docs`) and ReDoc (`/redoc`) generated dynamically from Pydantic schemas.
- **Dependency Injection**: Powerful dependency injection framework for JWT authentication, database session lifecycles, and role checks.

---

## 3. Why PostgreSQL?
- **ACID Compliance**: Full transactional integrity for critical financial and inventory operations.
- **Concurrency & Row Locking**: Native support for row-level locking (`FOR UPDATE`) and atomic conditional write operations (`UPDATE ... WHERE quantity > 0`).
- **Data Integrity**: Database-level constraints (`CHECK (price > 0)`, `CHECK (quantity >= 0)`, unique indexes on emails).

---

## 4. Why React + Vite + Tailwind CSS?
- **React 18 SPA**: Component modularity and reactive state management for real-time inventory updates and filter transitions.
- **Vite**: Lightning-fast Hot Module Replacement (HMR) and optimized Rollup production builds.
- **Tailwind CSS**: Utility-first CSS ensuring minimal production bundle size, responsive mobile-first layouts, and accessible color contrast.

---

## 5. JWT Authentication
- **Mechanism**: Stateless Bearer tokens signed with HMAC-SHA256 (`HS256`).
- **Payload Claims**: User ID (`sub`), Email (`email`), Role (`role`), and Expiration timestamp (`exp`).
- **Security**: The backend validates signature and expiration on every protected request. No server-side session store is needed, allowing frictionless horizontal scaling.

---

## 6. Password Hashing
- **Algorithm**: Salted `bcrypt` hashing with auto-generated unique salt per user.
- **Security Rule**: Plaintext passwords are never logged, persisted, or returned in API responses. Verification uses constant-time string comparison to mitigate timing attacks.

---

## 7. Role-Based Access Control (RBAC)
- **Roles**:
  - `USER` (Customer): Can view catalog, search/filter, and purchase vehicles.
  - `ADMIN` (Staff): Full vehicle catalog CRUD (Add, Edit, Delete) and Restock capabilities.
- **Implementation**: Reusable dependency guards (`get_current_user`, `require_admin`).
- **Key Principle**: Frontend role checks are only for user experience (e.g. hiding buttons); backend authorization is the mandatory, non-negotiable security layer.

---

## 8. SQLAlchemy 2.0 ORM
- **Modern Declarative Syntax**: Python 3.10+ typed mapped attributes (`Mapped[int]`, `Mapped[str]`).
- **Clean Session Management**: Scoped generator dependency (`get_db`) ensuring database connections are properly acquired, committed, and closed per HTTP request.

---

## 9. Alembic Database Migrations
- **Version Control for Schema**: Every table alteration, index, or constraint is tracked in code version files (`backend/alembic/versions/`).
- **Deterministic Deployments**: Running `alembic upgrade head` ensures production databases match development schemas without manual DDL scripts.

---

## 10. Vehicle Search & Multi-Criteria Filtering
- **Case-Insensitive Match**: Uses SQL `ilike` (`%query%`) on `make` and `model` columns.
- **Range Queries**: Dynamic SQL predicates for `price >= min_price` and `price <= max_price`.
- **Composable Filters**: Query builders assemble only the parameters provided by the client, maintaining high query execution speed with database indexes.

---

## 11. Purchase Transactions & Audit Trail
- **Transaction Scope**: Each purchase initiates a single database transaction encompassing:
  1. Atomic inventory decrement.
  2. Insertion of an immutable audit record into the `purchases` table (linking `vehicle_id`, `user_id`, `unit_price`, `total_price`, and `created_at`).
  3. Atomic commit.

---

## 12. Preventing Negative Inventory (Concurrency Safety)
- **Problem**: In concurrent scenarios, two users purchasing the last available unit simultaneously could cause negative stock if the application reads quantity, checks `quantity > 0` in Python, and updates.
- **Solution**: Atomic conditional SQL update:
  ```sql
  UPDATE vehicles
  SET quantity = quantity - 1, updated_at = :now
  WHERE id = :vehicle_id AND quantity >= 1;
  ```
- If rows affected equals 0, the transaction immediately raises `HTTP 400 Bad Request` ("Vehicle is out of stock"), preventing race condition oversales.

---

## 13. Test-Driven Development (TDD)
- **Philosophy**: Red &rarr; Green &rarr; Refactor.
- **Workflow**:
  1. Write failing test defining expected behavior, edge cases, and error responses.
  2. Implement minimum code to pass the test.
  3. Refactor code for readability, performance, and clean architectural separation.
- **Benefit**: 100% confidence when refactoring and zero regression bugs.

---

## 14. Testing Strategy & Suites
- **Backend (Pytest)**:
  - Integration tests for all HTTP REST routes (`test_auth.py`, `test_vehicles.py`, `test_inventory.py`).
  - Unit & concurrency tests for database atomicity, repository CRUD, and security token expiration (`test_concurrency_and_inventory.py`, `test_security.py`).
  - **Result**: 44 passed, **96% Code Coverage**.
- **Frontend (Vitest + React Testing Library)**:
  - Form validation, input error states, mock API integration, and disabled button behavior at zero stock.
  - **Result**: 27 passed across 7 test suites.

---

## 15. Frontend & Backend Communication
- **Protocol**: RESTful HTTP over JSON.
- **Client**: Axios instance with automatic request interceptors injecting `Authorization: Bearer <jwt_token>` from `localStorage`.
- **Response Handling**: Centralized error interceptor mapping FastAPI detail objects to user-friendly toast messages.

---

## 16. Deployment Architecture
- **Frontend**: Static SPA hosted on Vercel or packaged inside multi-stage Nginx Docker container.
- **Backend**: Containerized FastAPI service on Render / Railway executing Uvicorn ASGI server.
- **Database**: Managed PostgreSQL instance with automated Alembic migrations on startup.
- **Docker Compose**: Orchestrates PostgreSQL, FastAPI, and React Nginx with health checks.

---

## 17. AI Usage & Engineering Ethics
- **Role of AI**: AI served as an intelligent pair programmer for boilerplate scaffolding, test case synthesis, and cross-platform compatibility checks.
- **Human Oversight**: Every generated test, database constraint, and architectural boundary was executed, verified, and reviewed for correctness in live Python and Node runtimes.

---

## 18. Important Engineering Challenges Faced
1. **Concurrency Race Conditions**: Ensuring multiple simultaneous purchase requests for a single remaining vehicle never result in overselling or negative inventory.
2. **Dual Database Compatibility**: Supporting both PostgreSQL (production) and SQLite (quick local evaluation) without writing dialect-specific code.
3. **Strict TypeScript & React 18 Event Types**: Handling async form events, optional vehicle properties, and dynamic filters without resorting to `any` types.

---

## 19. Solutions Implemented
1. **Atomic Conditional SQL**: Solved concurrency by pushing the availability check down to the database engine level inside an atomic `UPDATE ... WHERE quantity >= qty` query.
2. **SQLAlchemy Abstraction**: Used standard SQLAlchemy 2.0 ORM construct expressions and Alembic migrations that translate seamlessly across PostgreSQL and SQLite dialects.
3. **Comprehensive Type Definitions**: Authored dedicated TypeScript interfaces in `frontend/src/types/index.ts` with strict input models (`VehicleCreateInput`, `VehicleUpdateInput`, `FilterState`).
