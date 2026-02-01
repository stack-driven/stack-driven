# REST API Design Patterns Reference

This reference provides comprehensive REST API design patterns and conventions for Session 8 (`/generate-api-design`). Use these patterns when API paradigm = REST.

**When to use this reference:**
- Session 8 (Step 2a) when API paradigm chosen = REST
- Designing RESTful endpoints and resource structures
- Establishing API naming conventions and query parameter standards

---

## Resource Naming Conventions

### Collections (Plural Nouns)

**Pattern**: Use plural nouns for collections of resources

```
GET /users              # List all users
GET /documents          # List all documents
GET /teams              # List all teams
GET /orders             # List all orders
```

**Why**: Consistency (always plural, whether singular or collection)

**Anti-patterns**:
- ❌ `/user` - Singular (ambiguous)
- ❌ `/getAllUsers` - Verb in URL
- ❌ `/user-list` - Inconsistent naming

---

### Single Resources (ID in Path)

**Pattern**: Use `/{collection}/{id}` for single resource access

```
GET /users/123          # Get user with ID 123
GET /documents/456      # Get document with ID 456
PUT /teams/789          # Replace team 789
PATCH /orders/abc       # Update order abc
DELETE /products/xyz    # Delete product xyz
```

**ID Format**:
- **Integer IDs**: `/users/123`
- **UUID IDs**: `/users/550e8400-e29b-41d4-a716-446655440000`
- **Slug IDs**: `/articles/how-to-build-rest-apis`

---

### Nested Resources (Parent-Child Relationships)

**Pattern**: Use `/{parent}/{parentId}/{child}` for nested resources

```
GET /teams/5/members                    # List members of team 5
POST /teams/5/members                   # Add member to team 5
GET /teams/5/members/123                # Get specific member 123 of team 5
DELETE /teams/5/members/123             # Remove member 123 from team 5

GET /orders/456/items                   # List items in order 456
GET /users/123/documents                # List documents owned by user 123
GET /projects/789/tasks                 # List tasks in project 789
```

**When to nest**:
- Child resources ALWAYS belong to parent (members belong to team)
- Parent ID required to access child (can't get member without team context)
- Relationship is clear and semantic (orders have items, users own documents)

**When NOT to nest**:
- Child can exist independently (don't nest `/users/123/profile` - use `/profiles/123`)
- Nesting depth >2 levels (avoid `/teams/5/projects/10/tasks/20/comments/30`)
- Filtering is sufficient (`/documents?user_id=123` simpler than `/users/123/documents`)

**Alternative - Query Parameters**:
```
# Instead of: GET /users/123/documents
GET /documents?user_id=123

# Advantages: Supports multiple filters, shallower URLs
GET /documents?user_id=123&status=approved&sort=-created_at
```

---

### Avoid Verbs in URLs

**Pattern**: Use HTTP verbs (GET, POST, PUT, PATCH, DELETE), not URL verbs

**Good Examples**:
```
POST /users             # Create user (not POST /createUser)
GET /users              # List users (not GET /getUsers)
DELETE /users/123       # Delete user (not POST /deleteUser/123)
PUT /users/123          # Replace user (not POST /updateUser/123)
PATCH /users/123        # Update user (not POST /editUser/123)
```

**Anti-patterns**:
- ❌ `POST /createOrder` → ✅ `POST /orders`
- ❌ `GET /fetchDocuments` → ✅ `GET /documents`
- ❌ `POST /deleteUser/123` → ✅ `DELETE /users/123`
- ❌ `POST /sendEmail` → ✅ `POST /emails` (email as resource)

**Exceptions (Non-CRUD Actions)**:
```
# Complex actions that don't fit CRUD
POST /orders/123/cancel         # Cancel order
POST /documents/456/publish     # Publish document
POST /users/789/password-reset  # Reset password
POST /payments/abc/refund       # Refund payment

# Use verbs ONLY when action doesn't map to resource creation
```

---

## HTTP Verb Usage and Idempotency

### GET - Retrieve Resource

**Characteristics**:
- **Idempotent**: YES (multiple identical requests produce same result)
- **Safe**: YES (no side effects, read-only)
- **Cacheable**: YES (responses can be cached)

**Usage**:
```
GET /users              # List all users (200 OK)
GET /users/123          # Get user 123 (200 OK or 404 Not Found)
GET /users?role=admin   # List admin users (200 OK)
```

**Status Codes**:
- `200 OK` - Resource found and returned
- `404 Not Found` - Resource doesn't exist
- `304 Not Modified` - Resource unchanged (ETag match)

**Anti-patterns**:
- ❌ GET request that modifies data (use POST/PUT/PATCH/DELETE)
- ❌ GET request with request body (use query parameters)

---

### POST - Create Resource

**Characteristics**:
- **Idempotent**: NO (without Idempotency-Key header)
- **Safe**: NO (creates new resource, has side effects)
- **Cacheable**: NO (by default)

**Usage**:
```
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

# Response:
HTTP/1.1 201 Created
Location: /users/124
Content-Type: application/json

{
  "id": 124,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2025-02-01T10:30:00Z"
}
```

**Status Codes**:
- `201 Created` - Resource created successfully (include `Location` header)
- `400 Bad Request` - Validation failed
- `409 Conflict` - Resource already exists (duplicate)

**Idempotency-Key Pattern** (for critical operations):
```
POST /payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "amount": 99.99,
  "currency": "USD"
}

# Server checks: Does this Idempotency-Key exist?
# - YES → Return cached response (200 OK, not 201)
# - NO → Process request, cache response with key (201 Created)
```

**Use Idempotency-Key for**:
- Payments (prevent duplicate charges)
- Orders (prevent duplicate orders)
- Emails/notifications (prevent duplicate sends)
- Any operation where retries are dangerous

---

### PUT - Replace Entire Resource

**Characteristics**:
- **Idempotent**: YES (multiple identical PUT requests produce same result)
- **Safe**: NO (modifies resource)
- **Cacheable**: NO

**Usage**:
```
PUT /users/123
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin"
}

# Response:
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin",
  "updated_at": "2025-02-01T10:35:00Z"
}
```

**Requirements**:
- Client must send ALL fields (full replacement)
- Missing fields are set to null or default values
- Idempotent (same PUT request twice = same result)

**Status Codes**:
- `200 OK` - Resource replaced, return updated resource
- `204 No Content` - Resource replaced, no body returned
- `404 Not Found` - Resource doesn't exist (create with PUT not recommended)

**When to use**:
- Rare in modern APIs (prefer PATCH for updates)
- Client wants to replace entire resource
- No partial updates needed

---

### PATCH - Partial Update

**Characteristics**:
- **Idempotent**: YES (with Idempotency-Key for critical updates)
- **Safe**: NO (modifies resource)
- **Cacheable**: NO

**Usage**:
```
PATCH /users/123
Content-Type: application/json

{
  "email": "newemail@example.com"
}

# Response:
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "Jane Doe",
  "email": "newemail@example.com",
  "role": "admin",
  "updated_at": "2025-02-01T10:40:00Z"
}
```

**Requirements**:
- Client sends ONLY changed fields
- Unchanged fields remain as-is
- Can use Idempotency-Key for critical updates

**Status Codes**:
- `200 OK` - Resource updated, return updated resource
- `400 Bad Request` - Validation failed
- `404 Not Found` - Resource doesn't exist

**When to use** (preferred over PUT):
- Update specific fields (change email, update status)
- Partial updates are common (most real-world scenarios)
- Reduce bandwidth (send only changes)

---

### DELETE - Remove Resource

**Characteristics**:
- **Idempotent**: YES (multiple DELETE requests produce same result)
- **Safe**: NO (removes resource)
- **Cacheable**: NO

**Usage**:
```
DELETE /users/123

# Response:
HTTP/1.1 204 No Content
```

**Status Codes**:
- `204 No Content` - Resource deleted, no body (preferred)
- `200 OK` - Resource deleted, return deleted resource (optional)
- `404 Not Found` - Resource doesn't exist (acceptable for idempotency)

**Idempotency**:
```
DELETE /users/123  # First request → 204 No Content
DELETE /users/123  # Second request → 404 Not Found (or 204 if treating as success)
```

**Soft Delete vs Hard Delete**:
```
# Hard delete (remove from database)
DELETE /users/123 → Permanent deletion

# Soft delete (mark as deleted, keep in database)
PATCH /users/123
{"status": "deleted"}
```

---

## Query Parameter Standards

### Filtering

**Pattern**: Use field names as query parameter keys

```
GET /documents?status=approved
GET /documents?status=approved&category=compliance
GET /users?role=admin&active=true
GET /orders?min_amount=100&max_amount=500
```

**Multiple Values (OR logic)**:
```
# Comma-separated
GET /documents?tag=security,compliance

# Repeated keys
GET /documents?tag=security&tag=compliance
```

**Complex Filters (bracket notation)**:
```
GET /documents?filter[status]=approved&filter[created_at][gte]=2025-01-01
GET /products?filter[price][gte]=10&filter[price][lte]=100
```

---

### Sorting

**Pattern**: `?sort={field}` (ascending) or `?sort=-{field}` (descending)

```
GET /documents?sort=created_at        # Oldest first
GET /documents?sort=-created_at       # Newest first (descending)
GET /users?sort=name,-created_at      # Name A-Z, then newest
```

**Multi-field sorting**:
```
# Comma-separated: primary sort, then secondary
GET /documents?sort=status,-updated_at
# 1. Sort by status (ascending: approved, draft, pending)
# 2. Within same status, sort by updated_at (descending: newest first)
```

---

### Field Selection (Sparse Fieldsets)

**Pattern**: `?fields={field1},{field2},{field3}`

```
GET /documents?fields=id,title,status
# Returns only specified fields (reduces bandwidth)

{
  "id": 123,
  "title": "Document Title",
  "status": "approved"
}
# Omits: content, created_at, updated_at, user_id, etc.
```

**Use cases**:
- Mobile apps (reduce bandwidth)
- List views (only need ID, title, status - not full content)
- Performance optimization (avoid fetching large fields)

**Anti-patterns**:
- ❌ Exposing sensitive fields (use field-level authorization instead)
- ❌ Over-complicating with nested field selection (`?fields=user.name,user.email`)

---

### Search (Full-Text)

**Pattern**: `?q={search_term}` OR `?search={query}`

```
GET /documents?q=compliance+framework
GET /users?search=john+doe
GET /articles?q=rest+api+design&category=engineering
```

**Search behavior**:
- Searches across multiple fields (title, content, description)
- Use `+` for spaces or URL encoding (`%20`)
- Combine with filters for scoped search

---

### Pagination

**Pattern**: Covered in Session 8 Step 5 (Pagination Strategy)

```
# Offset-based
GET /documents?page=1&limit=20

# Cursor-based
GET /documents?cursor=abc123&limit=20
```

---

## Response Envelope Consistency

### Single Resource Response

**Pattern**: Return resource object directly (no envelope)

```json
GET /users/123

{
  "id": 123,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-02-01T10:40:00Z"
}
```

---

### Collection Response

**Pattern**: Return data array + pagination metadata

```json
GET /users?page=1&limit=20

{
  "data": [
    {"id": 123, "name": "Jane Doe", "email": "jane@example.com"},
    {"id": 124, "name": "John Smith", "email": "john@example.com"}
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "total_pages": 3
  }
}
```

**Why envelope for collections?**
- Separate data from metadata (pagination, filters)
- Extensible (can add `meta`, `links` later)
- Consistent structure across all collection endpoints

---

### Error Response

**Pattern**: Consistent error format (see Session 8 Step 6)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "field": "email",
    "request_id": "req_abc123"
  }
}
```

---

## API Documentation Standards

### Resource Naming Convention

**camelCase** (for JSON APIs, JavaScript clients):
```json
{
  "userId": 123,
  "firstName": "Jane",
  "createdAt": "2025-02-01T10:30:00Z"
}
```

**snake_case** (for Python/Ruby backends):
```json
{
  "user_id": 123,
  "first_name": "Jane",
  "created_at": "2025-02-01T10:30:00Z"
}
```

**Consistency**: Choose one convention and apply it everywhere (field names, query params, error codes)

---

### Timestamp Format

**ISO 8601 / RFC 3339**: `YYYY-MM-DDTHH:MM:SSZ` (UTC)

```json
{
  "created_at": "2025-02-01T10:30:00Z",
  "updated_at": "2025-02-01T14:45:30Z"
}
```

**Always UTC**: Store and return timestamps in UTC, let clients convert to local timezone

---

### UUID Format

**UUIDv4** (random):
```
550e8400-e29b-41d4-a716-446655440000
```

**UUIDv7** (time-ordered, better database performance):
```
018e1e3e-5e2a-7c3b-9f1d-2a3b4c5d6e7f
```

---

### Null Handling

**Option 1: Return null** (explicit absence):
```json
{
  "id": 123,
  "name": "Jane Doe",
  "middle_name": null
}
```

**Option 2: Omit field** (implicit absence):
```json
{
  "id": 123,
  "name": "Jane Doe"
}
```

**Consistency**: Choose one approach and document it in API design

---

### Pagination Link Headers

**Link Header** (RFC 5988):
```http
Link: <https://api.example.com/documents?page=2>; rel="next",
      <https://api.example.com/documents?page=1>; rel="prev",
      <https://api.example.com/documents?page=1>; rel="first",
      <https://api.example.com/documents?page=10>; rel="last"
```

**Benefits**:
- Self-documenting API (client discovers pagination links)
- HATEOAS-friendly (hypermedia as the engine of application state)
- Consistent with HTTP standards

---

## REST Maturity Model (Richardson)

### Level 0: The Swamp of POX (Plain Old XML)
- Single endpoint
- All operations via POST
- Example: `POST /api` with SOAP envelope

**Don't use Level 0 for REST APIs**

---

### Level 1: Resources
- Multiple endpoints (resources)
- Still uses POST for everything
- Example: `POST /users`, `POST /documents`

**Not REST** (missing HTTP verbs)

---

### Level 2: HTTP Verbs
- Resources + correct HTTP verbs
- GET for retrieval, POST for creation, PUT/PATCH for updates, DELETE for removal
- Standard HTTP status codes

**This is REST** (most REST APIs stop here)

---

### Level 3: Hypermedia Controls (HATEOAS)
- Resources + HTTP verbs + hypermedia links
- API responses include links to related resources
- Self-documenting, discoverable API

**Example**:
```json
{
  "id": 123,
  "name": "Jane Doe",
  "links": {
    "self": "/users/123",
    "documents": "/users/123/documents",
    "teams": "/users/123/teams"
  }
}
```

**When to use Level 3**:
- Building public APIs with third-party developers
- Marketplace/platform APIs (discoverability critical)
- Long-term API versioning strategy

**When NOT needed**:
- Internal APIs (clients know structure)
- Simple CRUD APIs (overhead not worth it)
- First MVP iteration (add later if needed)

---

## Common REST Anti-Patterns

### 1. Verbs in URLs
❌ `POST /createUser`, `GET /getUsers`
✅ `POST /users`, `GET /users`

### 2. Non-Standard Status Codes
❌ Always returning `200 OK` with `{"success": false, "error": "..."}`
✅ Use proper HTTP status codes (`400`, `404`, `500`)

### 3. Ignoring HTTP Verbs
❌ `POST /users/delete/123`
✅ `DELETE /users/123`

### 4. Over-Nesting Resources
❌ `/teams/5/projects/10/tasks/20/comments/30/replies/40`
✅ `/comments/30/replies` OR `/replies?comment_id=30`

### 5. Returning Arrays at Top Level
❌ `GET /users` → `[{"id": 1}, {"id": 2}]` (no pagination metadata)
✅ `{"data": [...], "pagination": {...}}`

### 6. Inconsistent Naming
❌ `/users`, `/document`, `/team-members` (plural/singular/kebab mix)
✅ `/users`, `/documents`, `/team-members` (consistent plural)

### 7. Ignoring Idempotency
❌ `POST /payments` without Idempotency-Key (duplicate charges on retry)
✅ `POST /payments` with `Idempotency-Key` header

### 8. Breaking Changes Without Versioning
❌ Changing field names, removing fields without notice
✅ Use API versioning (`/v1/`, `/v2/`) for breaking changes

---

## References

- **Roy Fielding's REST Dissertation**: https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
- **HTTP Status Codes (RFC 7231)**: https://tools.ietf.org/html/rfc7231
- **Link Header (RFC 5988)**: https://tools.ietf.org/html/rfc5988
- **JSON:API Specification**: https://jsonapi.org/ (opinionated REST conventions)
- **RFC 7807 Problem Details**: https://tools.ietf.org/html/rfc7807 (standard error format)

---

## Session 8 Integration

This reference is used in:
- **Step 2a**: Define REST Design Patterns (conditional - only if paradigm = REST)
- **Step 5**: Pagination Strategy (REST pagination patterns)
- **Step 6**: Error Handling (REST response envelopes)

**When to reference**:
- During `/generate-api-design` execution
- When documenting RESTful endpoint structure in Session 8b (`/generate-api-contracts`)
- When validating API design quality (`/validate-outputs`)
