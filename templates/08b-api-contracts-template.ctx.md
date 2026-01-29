# API Contracts Essentials (For Scaffold Generation - Session 8b)

> **Note**: This is a condensed version for Session 12 (scaffold generation).
> See `08b-api-contracts.md` for complete OpenAPI 3.0 specification with request/response schemas,
> error definitions, authentication flows, pagination examples, and component schemas.
> See `08-api-design.md` (Session 8) for high-level API design decisions (paradigm, serialization, auth strategy).

---

## API Configuration

- **API Style**: [REST/GraphQL/gRPC from tech stack]
- **Authentication**: [JWT/OAuth2/Session/API Key from tech stack]
- **Base URL**: `https://api.[domain].com`
- **Pagination**: [Cursor-based/Offset-based]
- **Rate Limiting**: [Per-user/Per-team - limits from monetization]

---

## Endpoints by Journey Step

### Authentication (Journey Step 0)

- `POST /api/auth/login` - User login with credentials
- `POST /api/auth/signup` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### [Resource 1] Endpoints (Journey Step 1: [Step Name])

- `POST /api/[resource1]` - Create new [resource1]
- `GET /api/[resource1]` - List user's [resource1] (paginated, filterable)
- `GET /api/[resource1]/{id}` - Get single [resource1] by ID
- `PATCH /api/[resource1]/{id}` - Update [resource1]
- `DELETE /api/[resource1]/{id}` - Delete [resource1]

### [Resource 2] Endpoints (Journey Step 2: [Step Name])

- `POST /api/[resource2]` - Create [resource2]
- `GET /api/[resource2]` - List [resource2] (with filters)
- `GET /api/[resource2]/{id}` - Get [resource2] details
- `PATCH /api/[resource2]/{id}` - Update [resource2]
- `POST /api/[resource2]/{id}/[action]` - Perform [action] on [resource2]
- `DELETE /api/[resource2]/{id}` - Delete [resource2]

### [Resource 3] Endpoints (Journey Step 3: [Step Name])

- `POST /api/[resource3]` - Create [resource3]
- `GET /api/[resource3]` - List [resource3]
- `GET /api/[resource3]/{id}` - Get [resource3]
- `PATCH /api/[resource3]/{id}` - Update [resource3]

### File/Document Endpoints (Journey Step X)

- `POST /api/documents` - Upload document/file (multipart/form-data)
- `GET /api/documents/{id}` - Get document metadata
- `GET /api/documents/{id}/download` - Download document file
- `DELETE /api/documents/{id}` - Delete document

### Team/Organization Endpoints (Multi-tenancy)

- `GET /api/teams` - List user's teams
- `POST /api/teams` - Create new team
- `GET /api/teams/{id}` - Get team details
- `PATCH /api/teams/{id}` - Update team
- `POST /api/teams/{id}/members` - Invite team member
- `DELETE /api/teams/{id}/members/{user_id}` - Remove team member

### Analytics & Metrics Endpoints

- `POST /api/events` - Track usage event (for North Star metric)
- `GET /api/metrics/usage` - Get usage metrics (for billing/analytics)
- `GET /api/metrics/[resource1]` - Get [resource1] analytics

### Public/Webhook Endpoints (No Auth)

- `GET /public/[shared-resource]/{token}` - Public access via share token
- `POST /webhooks/[integration]` - Webhook receiver for [integration]

---

## Common Patterns

### Pagination Parameters (List Endpoints)

All `GET /api/[resource]` endpoints support:
- `cursor` or `page` - Pagination cursor/page number
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field (prefix `-` for descending, e.g., `-created_at`)

### Filtering Parameters (List Endpoints)

Resource-specific filters vary, common examples:
- `status` - Filter by status (e.g., `active`, `inactive`)
- `search` - Text search across relevant fields
- `created_after` / `created_before` - Date range filters
- `team_id` - Filter by team (for multi-tenant data)

### Standard Response Codes

- `200 OK` - Successful GET/PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required/failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Notes for Scaffold Generation (Session 12)

### Endpoint Implementation Patterns

**Simple CRUD endpoints**:
- Single resource operations: `POST /api/[resource]`, `GET /api/[resource]/{id}`
- Generate controller/handler stubs for each endpoint
- Include validation middleware from schemas

**List endpoints with pagination**:
- List operations: `GET /api/[resource]`
- Include pagination logic (cursor or offset from 08-api-design.md)
- Include filtering and sorting parameters

**Custom action endpoints**:
- Actions on resources: `POST /api/[resource]/{id}/[action]`
- Generate service methods for business logic
- Include async handling if 202 Accepted pattern used

### Multi-tenancy Implementation

All endpoints (except auth and public) must:
- Include team/user ownership checks
- Filter queries by `team_id` or `user_id`
- Use middleware for authorization

### Authentication Implementation

Implement auth middleware:
- Token validation (JWT/OAuth from 08-api-design.md)
- User/team context injection
- Public endpoint exclusions

---

## References

For complete API technical specification:
- Full OpenAPI 3.0 YAML
- Request/response schemas with validation rules
- Error response definitions
- Component schemas and reusable definitions
- Example requests and responses

See: `product-guidelines/08b-api-contracts.md`

For high-level API design decisions:
- API paradigm (REST/GraphQL/gRPC)
- Serialization format (JSON/Protobuf/MessagePack)
- Authentication strategy
- Rate limiting and pagination approaches

See: `product-guidelines/08-api-design.md`
