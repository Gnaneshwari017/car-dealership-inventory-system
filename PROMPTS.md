# PROMPTS

This file contains the main prompts used during the development of the Car Dealership Inventory System and the corresponding outputs/results.

---

## Prompt 1 — Create the Car Dealership Inventory System

### Prompt

> Create a full-stack Car Dealership Inventory System for Apex Motors.
>
> Build the backend using FastAPI and the frontend using React with TypeScript.
>
> The application should include:
> - User registration and login
> - JWT authentication
> - Role-based access control
> - Vehicle CRUD operations
> - Vehicle search and filtering
> - Vehicle purchase and restock functionality
> - Database integration
> - Responsive dashboard and vehicle catalog
> - Proper error handling
> - Automated tests
>
> Follow clean architecture, modular components, REST API principles, and good coding practices.

### Answer / Result

The complete full-stack Car Dealership Inventory System was implemented with:

- FastAPI backend
- React + TypeScript frontend
- SQLite database
- JWT authentication
- Password hashing
- ADMIN and USER roles
- Vehicle CRUD APIs
- Vehicle search and filtering
- Purchase and restock operations
- Responsive dashboard
- Vehicle catalog
- API integration
- Backend and frontend tests

The project was structured into separate backend and frontend modules for maintainability.

---

## Prompt 2 — Implement Authentication and Security

### Prompt

> Implement secure authentication and authorization for the Car Dealership Inventory System.
>
> Add user registration and login using JWT tokens.
>
> Passwords must be securely hashed.
>
> Add ADMIN and USER roles and protect administrator-only operations.
>
> Store sensitive values such as the JWT secret and database configuration using environment variables.
>
> Make sure `.env` files and database files are not committed to GitHub.

### Answer / Result

Authentication and security were implemented successfully.

The backend includes:

- User registration
- User login
- JWT access tokens
- Secure password hashing
- Current-user authentication
- ADMIN and USER role checking
- Protected vehicle operations
- Environment-based configuration

The `.gitignore` file was configured to exclude:

- `.env`
- `.venv`
- `__pycache__`
- `.pytest_cache`
- Database files
- Node modules
- Build files

The JWT secret is stored locally in `backend/.env` and is not uploaded to GitHub.

---

## Prompt 3 — Implement Vehicle Inventory and Search

### Prompt

> Implement the vehicle inventory functionality.
>
> Create APIs and frontend components for adding, viewing, updating, and deleting vehicles.
>
> Each vehicle should contain details such as make, model, year, price, mileage, fuel type, transmission, color, stock quantity, and availability.
>
> Add search and filtering functionality.
>
> Display vehicles as professional vehicle cards in the catalog and show inventory information on the dashboard.

### Answer / Result

The vehicle inventory system was implemented successfully.

The system supports:

- Add vehicle
- View vehicles
- Update vehicle
- Delete vehicle
- Vehicle search
- Vehicle filtering
- Stock quantity management
- Availability status
- Vehicle details
- Responsive vehicle cards
- Dashboard inventory statistics

The frontend communicates with the FastAPI backend through REST APIs.

The catalog dynamically loads vehicle information from the database.

---

## Prompt 4 — Implement Purchase and Restock

### Prompt

> Implement vehicle purchase and restock functionality.
>
> When a vehicle is purchased, decrease the available stock quantity.
>
> Prevent purchases when the vehicle is out of stock.
>
> When a vehicle is restocked, increase the available quantity.
>
> Make purchase and restock operations transactional so that inventory remains consistent.
>
> Add proper success and error messages to the frontend.

### Answer / Result

Purchase and restock functionality was implemented.

The system now:

- Decreases stock after a successful purchase
- Prevents purchasing vehicles with zero stock
- Increases stock when vehicles are restocked
- Maintains consistent inventory quantities
- Handles invalid operations with appropriate errors
- Updates the frontend after inventory changes

Transactional database operations were implemented to keep inventory data consistent.

---

## Prompt 5 — Test, Fix and Finalize the Application

### Prompt

> Test the complete Car Dealership Inventory System.
>
> Check the backend APIs, authentication, vehicle CRUD operations, search and filtering, purchase and restock functionality, frontend components, API connection, dashboard, catalog, and overall UI.
>
> Fix any errors found during testing.
>
> Make sure the application builds successfully and runs correctly.
>
> Verify that the project is clean and ready to be pushed to GitHub.

### Answer / Result

The complete application was tested and finalized.

Backend testing successfully covered the major application functionality, including:

- Authentication
- Authorization
- Vehicle CRUD
- Vehicle search
- Purchase
- Restock
- Database operations

Frontend testing covered:

- React components
- Dashboard
- Vehicle catalog
- Authentication-related UI
- API integration
- User interactions

The frontend production build was successfully generated.

The FastAPI backend was successfully started using:

```bash
python -m uvicorn app.main:app --reload --port 8000