# 🧪 Automated Test Execution Report

**Project**: Apex Motors - Car Dealership Inventory System  
**Date**: August 22, 2026  
**Execution Environment**: Python 3.13.2 | Node.js v24.13.1 | Windows 11  
**Total Tests Executed**: 71  
**Total Passed**: 71 (100%)  
**Total Failed**: 0  
**Total Skipped**: 0  

---

## 1. Backend Test Suite (Pytest + Coverage)

### Execution Command
```bash
python -m pytest --cov=app --cov-report=term-missing -v
```

### Results Summary
- **Total Tests**: 44
- **Passed**: 44
- **Failed**: 0
- **Duration**: 15.03 seconds
- **Overall Code Coverage**: **96%**

### Breakdown by Category

#### A. Authentication & User Management (`tests/integration/test_auth.py`)
| Test Name | Status | Description |
| :--- | :---: | :--- |
| `test_register_user_success` | PASSED | Validates user registration with valid name, email, and password |
| `test_register_duplicate_email_fails` | PASSED | Asserts that duplicate email registration returns HTTP 409 Conflict |
| `test_register_invalid_email_fails` | PASSED | Asserts that malformed email format returns HTTP 422 Unprocessable Entity |
| `test_register_short_password_fails` | PASSED | Validates minimum 6-character password constraint |
| `test_register_admin_user_success` | PASSED | Validates administrative user registration |
| `test_login_success` | PASSED | Asserts successful JWT token return on valid credentials |
| `test_login_incorrect_password_fails` | PASSED | Asserts HTTP 401 Unauthorized on invalid password |
| `test_login_nonexistent_user_fails` | PASSED | Asserts HTTP 401 Unauthorized on unknown email |
| `test_get_current_user_me_endpoint` | PASSED | Validates `/api/auth/me` with Bearer token |
| `test_get_current_user_unauthorized_without_token` | PASSED | Asserts HTTP 401 Unauthorized when Bearer token is missing |

#### B. Inventory Management & Purchases (`tests/integration/test_inventory.py`)
| Test Name | Status | Description |
| :--- | :---: | :--- |
| `test_purchase_unauthenticated_rejected` | PASSED | Asserts unauthenticated purchase returns HTTP 401 |
| `test_purchase_vehicle_success_and_decrements_quantity` | PASSED | Asserts quantity decrements by 1 and purchase record is generated |
| `test_purchase_out_of_stock_rejected` | PASSED | Asserts purchasing vehicle with 0 stock returns HTTP 400 |
| `test_purchase_nonexistent_vehicle_fails` | PASSED | Asserts purchasing non-existent vehicle returns HTTP 404 |
| `test_restock_by_admin_succeeds` | PASSED | Validates admin can restock vehicle quantity |
| `test_restock_invalid_quantity_rejected` | PASSED | Asserts restock quantity &le; 0 returns HTTP 422 |
| `test_restock_by_normal_user_fails` | PASSED | Asserts non-admin restock returns HTTP 403 Forbidden |
| `test_restock_nonexistent_vehicle_fails` | PASSED | Asserts restocking non-existent vehicle returns HTTP 404 |

#### C. Vehicle CRUD & Multi-Criteria Search (`tests/integration/test_vehicles.py`)
| Test Name | Status | Description |
| :--- | :---: | :--- |
| `test_unauthenticated_requests_rejected` | PASSED | Asserts protected endpoints reject requests without token |
| `test_create_vehicle_success` | PASSED | Asserts valid vehicle creation with HTTP 201 Created |
| `test_create_vehicle_invalid_price_fails` | PASSED | Rejects price &le; 0 |
| `test_create_vehicle_negative_quantity_fails` | PASSED | Rejects quantity < 0 |
| `test_create_vehicle_missing_fields_fails` | PASSED | Rejects missing required make/model |
| `test_list_vehicles` | PASSED | Validates list endpoint and pagination |
| `test_search_by_make` | PASSED | Case-insensitive make search |
| `test_search_by_model` | PASSED | Case-insensitive model search |
| `test_search_by_category` | PASSED | Category filtering (Sedan, SUV, Electric, etc.) |
| `test_search_by_price_range` | PASSED | Minimum and maximum price boundaries |
| `test_search_combined_filters` | PASSED | Multi-parameter search query combinations |
| `test_update_vehicle_success` | PASSED | Updates vehicle details with HTTP 200 OK |
| `test_update_nonexistent_vehicle_fails` | PASSED | Asserts HTTP 404 for unknown vehicle ID |
| `test_delete_vehicle_by_admin_succeeds` | PASSED | Admin user successfully deletes vehicle |
| `test_delete_vehicle_by_normal_user_fails` | PASSED | Normal user delete attempt returns HTTP 403 Forbidden |

#### D. Concurrency & Unit Safety Tests (`tests/unit/`)
| Test Name | Status | Description |
| :--- | :---: | :--- |
| `test_purchase_race_condition_does_not_oversell` | PASSED | Simulates parallel purchases on quantity=1; ensures exact 1 success and 0 negative inventory |
| `test_purchase_audit_trail_created` | PASSED | Validates purchase audit record foreign key relationships |
| `test_purchase_repository_crud` | PASSED | Direct CRUD testing on PurchaseRepository |
| `test_user_repository_get_by_id` | PASSED | Direct testing on UserRepository |
| `test_seed_database_function` | PASSED | Verifies seeder idempotency |
| `test_health_check_endpoint` | PASSED | Validates `/health` check |
| `test_settings_cors_parsing` | PASSED | Validates Pydantic settings parsing |
| `test_password_hashing_and_verification` | PASSED | Validates Bcrypt salt hashing and verification |
| `test_jwt_token_creation_and_decoding` | PASSED | Validates JWT token generation and claims decoding |
| `test_jwt_token_expired` | PASSED | Asserts expired token raises 401 Unauthorized |
| `test_invalid_jwt_token` | PASSED | Asserts tampered token raises 401 Unauthorized |

---

## 2. Frontend Test Suite (Vitest + React Testing Library)

### Execution Command
```bash
npm test
```

### Results Summary
- **Test Files**: 7 passed (7 total)
- **Tests**: 27 passed (27 total)
- **Duration**: 11.84 seconds

### Breakdown by Component

#### 1. `tests/LoginForm.test.tsx` (5 tests)
- `renders login form elements properly` (PASSED)
- `shows error if submitted with empty fields` (PASSED)
- `successfully logs in with valid credentials and invokes onSuccess callback` (PASSED)
- `displays an error alert when login fails` (PASSED)
- `populates demo credentials and logs in when Demo Buyer button is clicked` (PASSED)

#### 2. `tests/RegisterForm.test.tsx` (4 tests)
- `renders all registration inputs and role choices` (PASSED)
- `shows error if password is too short` (PASSED)
- `shows error if passwords do not match` (PASSED)
- `successfully registers a user with selected role and calls onSuccess` (PASSED)

#### 3. `tests/VehicleCard.test.tsx` (5 tests)
- `renders vehicle details correctly (make, model, price, stock status)` (PASSED)
- `allows purchase when vehicle is in stock and invokes onPurchase callback` (PASSED)
- `disables purchase button and displays Out of Stock when quantity is 0` (PASSED)
- `shows admin action buttons (Restock, Edit, Delete) when authenticated as ADMIN` (PASSED)
- `hides admin action buttons for regular buyers/unauthenticated users` (PASSED)

#### 4. `tests/FilterBar.test.tsx` (5 tests)
- `renders search input, price filters, category pills, and in-stock toggle` (PASSED)
- `triggers onFilterChange when search query is typed` (PASSED)
- `triggers onFilterChange when a category pill is selected` (PASSED)
- `triggers onFilterChange when In Stock Only toggle is clicked` (PASSED)
- `resets filters when Reset button is clicked` (PASSED)

#### 5. `tests/VehicleGrid.test.tsx` (3 tests)
- `renders loading skeleton elements when loading with empty vehicles array` (PASSED)
- `renders empty state message when no vehicles are found` (PASSED)
- `renders list of vehicle cards when vehicles are provided` (PASSED)

#### 6. `tests/AdminPage.test.tsx` (3 tests)
- `renders unauthorized notice if user is not logged in as ADMIN` (PASSED)
- `renders admin inventory console and table when user is authenticated as ADMIN` (PASSED)
- `deletes a vehicle after confirmation dialog is confirmed` (PASSED)

#### 7. `tests/DashboardPage.test.tsx` (2 tests)
- `fetches and renders vehicles list, metrics, and filter bar` (PASSED)
- `performs purchase and updates stock when authenticated` (PASSED)

---

## 3. Code Coverage Report

```
Name                                      Stmts   Miss  Cover   Missing
-----------------------------------------------------------------------
app/core/config.py                           22      0   100%
app/core/database.py                         14      4    71%   19-23
app/core/security.py                         27      2    93%   14-15
app/dependencies/auth.py                     27      3    89%   24, 31, 39
app/main.py                                  14      0   100%
app/models/purchase.py                       17      1    94%   21
app/models/user.py                           18      1    94%   22
app/models/vehicle.py                        16      1    94%   23
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
app/services/inventory_service.py            41      1    98%   72
app/services/vehicle_service.py              32      1    97%   44
app/utils/seed.py                            33      5    85%   93-95, 125, 128
-----------------------------------------------------------------------
TOTAL                                       497     19    96%
============================= 44 passed in 15.03s =============================
```

---

## 4. Quality & Concurrency Verification Notes

1. **Inventory Boundary Testing**: Verified that attempting to purchase an item with `quantity = 0` is strictly rejected and never results in negative stock numbers.
2. **Race Condition Prevention**: Verified that atomic database-level SQL updates guarantee consistency under concurrent simulated requests.
3. **Role Authorization**: Verified that non-admin requests attempting DELETE or RESTOCK endpoints return `HTTP 403 Forbidden`.
