# API Contracts Template (Session 8b) - Technical Implementation

> **Note**: This template focuses on technical implementation (OpenAPI/Protobuf schemas, endpoints, request/response examples). For high-level API design decisions (paradigm, serialization format, auth strategy), see `08-api-design.md` (Session 8).

Use this template as a reference for creating complete OpenAPI specifications or Protocol Buffer definitions. Adapt to your specific project needs and implement the decisions from Session 8 (API Design).

## Complete OpenAPI Structure

```yaml
openapi: 3.0.3

info:
  title: [Project Name] API
  description: |
    [Brief project description from user journey]

    ## Authentication
    [How to authenticate - include token format, where to send, how to obtain]

    ## Rate Limiting
    [Rate limit policy - limits per tier, headers returned]

    ## Error Handling
    [Standard error format and common error codes]

    ## Pagination
    [Pagination approach - cursor vs offset, parameters, response format]

  version: 1.0.0
  contact:
    name: [Team/Company Name]
    email: [support email]
    url: [support URL]
  license:
    name: [License]
    url: [License URL]

servers:
  - url: https://api.[domain].com
    description: Production
  - url: https://staging-api.[domain].com
    description: Staging
  - url: http://localhost:[port]
    description: Local development

tags:
  - name: [Resource1]
    description: [Resource description]
  - name: [Resource2]
    description: [Resource description]

paths:
  /api/[resources]:
    get:
      summary: List [resources]
      description: Get paginated list of [resources] for the authenticated user
      operationId: list[Resources]
      tags: [[Resource1]]
      security:
        - bearerAuth: []
      parameters:
        - name: cursor
          in: query
          description: Pagination cursor from previous response
          required: false
          schema:
            type: string
        - name: limit
          in: query
          description: Number of items to return (1-100)
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: status
          in: query
          description: Filter by status
          required: false
          schema:
            type: string
            enum: [active, inactive, pending]
        - name: sort
          in: query
          description: Sort field (prefix with - for descending)
          required: false
          schema:
            type: string
            example: -created_at
      responses:
        '200':
          description: Successful response
          headers:
            X-RateLimit-Limit:
              description: Request limit per window
              schema:
                type: integer
            X-RateLimit-Remaining:
              description: Requests remaining in current window
              schema:
                type: integer
            X-RateLimit-Reset:
              description: Unix timestamp when limit resets
              schema:
                type: integer
          content:
            application/json:
              schema:
                type: object
                required:
                  - data
                  - pagination
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/[Resource]'
                  pagination:
                    $ref: '#/components/schemas/CursorPagination'
              examples:
                success:
                  summary: Successful list response
                  value:
                    data:
                      - id: res_abc123
                        name: Example Resource
                        status: active
                        created_at: '2025-11-11T10:00:00Z'
                    pagination:
                      next_cursor: def456
                      prev_cursor: null
                      has_more: true
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '429':
          $ref: '#/components/responses/RateLimitError'

    post:
      summary: Create [resource]
      description: Create a new [resource]
      operationId: create[Resource]
      tags: [[Resource1]]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/[Resource]Create'
            examples:
              example1:
                summary: Basic creation
                value:
                  name: New Resource
                  description: Resource description
                  status: active
      responses:
        '201':
          description: Resource created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/[Resource]'
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '422':
          $ref: '#/components/responses/BusinessLogicError'

  /api/[resources]/{id}:
    parameters:
      - name: id
        in: path
        description: Resource ID
        required: true
        schema:
          type: string
          pattern: '^[a-z]+_[a-zA-Z0-9]+$'
          example: res_abc123

    get:
      summary: Get [resource] by ID
      description: Retrieve a single [resource] by ID
      operationId: get[Resource]
      tags: [[Resource1]]
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/[Resource]'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '403':
          $ref: '#/components/responses/ForbiddenError'
        '404':
          $ref: '#/components/responses/NotFoundError'

    patch:
      summary: Update [resource]
      description: Partially update a [resource]
      operationId: update[Resource]
      tags: [[Resource1]]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/[Resource]Update'
      responses:
        '200':
          description: Resource updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/[Resource]'
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '403':
          $ref: '#/components/responses/ForbiddenError'
        '404':
          $ref: '#/components/responses/NotFoundError'

    delete:
      summary: Delete [resource]
      description: Delete a [resource] by ID
      operationId: delete[Resource]
      tags: [[Resource1]]
      security:
        - bearerAuth: []
      responses:
        '204':
          description: Resource deleted successfully
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '403':
          $ref: '#/components/responses/ForbiddenError'
        '404':
          $ref: '#/components/responses/NotFoundError'

  /api/[resources]/{id}/[action]:
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string

    post:
      summary: [Action] on [resource]
      description: Perform custom action on resource
      operationId: [action][Resource]
      tags: [[Resource1]]
      security:
        - bearerAuth: []
      requestBody:
        required: false
        content:
          application/json:
            schema:
              type: object
              properties:
                [action-specific-params]:
                  type: string
      responses:
        '200':
          description: Action completed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/[Resource]'
        '202':
          description: Action accepted (async processing)
          content:
            application/json:
              schema:
                type: object
                properties:
                  job_id:
                    type: string
                  status:
                    type: string
                    enum: [pending, processing]

  # File Upload Example
  /api/documents:
    post:
      summary: Upload document
      tags: [Documents]
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required:
                - file
              properties:
                file:
                  type: string
                  format: binary
                  description: File to upload (PDF, DOCX, max 50MB)
                name:
                  type: string
                  description: Custom document name
                metadata:
                  type: object
                  description: Additional metadata as JSON
      responses:
        '201':
          description: Document uploaded successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Document'
        '413':
          $ref: '#/components/responses/PayloadTooLarge'

  # Public Endpoint Example (no auth)
  /public/reports/{token}:
    parameters:
      - name: token
        in: path
        required: true
        schema:
          type: string
    get:
      summary: View public report
      tags: [Public]
      security: []  # No authentication required
      responses:
        '200':
          description: Report data
          content:
            application/json:
              schema:
                type: object
        '404':
          $ref: '#/components/responses/NotFoundError'

  # GDPR Data Export Endpoint (Phase 1 Compliance Example)
  /api/users/{user_id}/export:
    parameters:
      - name: user_id
        in: path
        required: true
        schema:
          type: string
          format: uuid
        description: User ID to export data for
    get:
      summary: Export all user data (GDPR Article 20 compliance)
      description: |
        Returns all personal data in machine-readable JSON format.
        Required by GDPR Article 20 (Right to Data Portability).

        **Access Control**: Only the user themselves can export their data.
        **Data Included**: All PII fields across all tables.
        **Format**: JSON (machine-readable, structured)
      tags: [Users, GDPR]
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User data export
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserDataExport'
              examples:
                success:
                  summary: Complete user data export
                  value:
                    user:
                      id: "123e4567-e89b-12d3-a456-426614174000"
                      email: "user@example.com"
                      name: "Jane Smith"
                      role: "user"
                      created_at: "2024-01-01T00:00:00Z"
                    documents:
                      - id: "doc_abc123"
                        name: "Privacy Policy.pdf"
                        uploaded_at: "2024-06-15T10:00:00Z"
                    activity_log:
                      - action: "login"
                        timestamp: "2025-01-15T14:30:00Z"
                        ip_address: "192.0.2.1"
                    exported_at: "2025-01-15T14:35:00Z"
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '403':
          $ref: '#/components/responses/ForbiddenError'
          description: User can only export their own data

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT token from [auth provider].

        To obtain token:
        1. [Authentication flow steps]
        2. Include in Authorization header

        Example: `Authorization: Bearer eyJhbGc...`

  schemas:
    # Main Resource Schema
    [Resource]:
      type: object
      required:
        - id
        - name
        - status
        - created_at
        - updated_at
      properties:
        id:
          type: string
          description: Unique resource identifier
          pattern: '^[a-z]+_[a-zA-Z0-9]+$'
          example: res_abc123
        name:
          type: string
          description: Resource name
          minLength: 1
          maxLength: 255
          example: Example Resource
        description:
          type: string
          description: Resource description
          maxLength: 1000
          nullable: true
        status:
          type: string
          description: Current status
          enum: [active, inactive, pending, error]
          example: active
        metadata:
          type: object
          description: Additional metadata
          additionalProperties: true
        user_id:
          type: string
          description: Owner user ID
          example: user_xyz789
        team_id:
          type: string
          description: Owner team ID
          example: team_def456
        created_at:
          type: string
          format: date-time
          description: Creation timestamp
          example: '2025-11-11T10:00:00Z'
        updated_at:
          type: string
          format: date-time
          description: Last update timestamp
          example: '2025-11-11T10:30:00Z'

    # Create Schema (subset of fields)
    [Resource]Create:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 255
        description:
          type: string
          maxLength: 1000
        status:
          type: string
          enum: [active, inactive, pending]
          default: active
        metadata:
          type: object

    # Update Schema (all fields optional)
    [Resource]Update:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 255
        description:
          type: string
          maxLength: 1000
          nullable: true
        status:
          type: string
          enum: [active, inactive, pending, error]
        metadata:
          type: object

    # Document Schema (file upload example)
    Document:
      type: object
      required:
        - id
        - name
        - file_size
        - status
        - uploaded_at
      properties:
        id:
          type: string
          example: doc_abc123
        name:
          type: string
          example: Privacy Policy.pdf
        file_size:
          type: integer
          description: File size in bytes
          example: 2456789
        mime_type:
          type: string
          example: application/pdf
        status:
          type: string
          enum: [processing, ready, error]
        upload_url:
          type: string
          format: uri
          description: Download URL
        user_id:
          type: string
        uploaded_at:
          type: string
          format: date-time

    # User Schema with PII Marking and Comprehensive Validation (Phase 1 Example)
    User:
      type: object
      required:
        - id
        - email
        - name
        - role
        - created_at
      properties:
        id:
          type: string
          format: uuid
          description: Unique user identifier
          example: "123e4567-e89b-12d3-a456-426614174000"
        email:
          type: string
          format: email
          minLength: 5
          maxLength: 255
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
          x-pii: true
          x-gdpr-category: "direct-identifier"
          description: User email address (PII - handle with care)
          example: "user@example.com"
        name:
          type: string
          minLength: 1
          maxLength: 100
          pattern: '^[a-zA-Z\s\-'']+$'
          x-pii: true
          x-gdpr-category: "direct-identifier"
          description: User full name (PII)
          example: "Jane O'Connor-Smith"
        phone:
          type: string
          pattern: '^\+[1-9]\d{1,14}$'
          minLength: 10
          maxLength: 20
          x-pii: true
          x-gdpr-category: "direct-identifier"
          description: Phone number in E.164 format (PII)
          example: "+12025551234"
          nullable: true
        age:
          type: integer
          minimum: 0
          maximum: 150
          description: User age in years
          example: 35
          nullable: true
        role:
          type: string
          enum: [admin, user, guest]
          description: User role for authorization
          example: "user"
        website:
          type: string
          format: uri
          maxLength: 2048
          pattern: '^https?://'
          description: User website URL (only http/https schemes allowed)
          example: "https://example.com"
          nullable: true
        preferences:
          type: object
          description: User preferences (dynamic structure, max 10 levels deep)
          additionalProperties: true
          example:
            theme: "dark"
            language: "en"
            notifications: true
        balance:
          type: string
          pattern: '^\d+\.\d{2}$'
          description: Account balance in decimal format (string to preserve precision)
          example: "1234.56"
        created_at:
          type: string
          format: date-time
          description: Account creation timestamp (ISO 8601 with timezone)
          example: "2025-01-15T14:30:00Z"
        updated_at:
          type: string
          format: date-time
          description: Last update timestamp (ISO 8601 with timezone)
          example: "2025-01-15T14:35:00Z"

    # GDPR Data Export Response (Phase 1 Compliance Example)
    UserDataExport:
      type: object
      description: Complete user data export per GDPR Article 20 (Right to Data Portability)
      properties:
        user:
          $ref: '#/components/schemas/User'
        documents:
          type: array
          items:
            $ref: '#/components/schemas/Document'
          description: All documents owned by the user
        activity_log:
          type: array
          items:
            type: object
            properties:
              action:
                type: string
              timestamp:
                type: string
                format: date-time
              ip_address:
                type: string
                x-pii: true
          description: User activity history (includes PII)
        exported_at:
          type: string
          format: date-time
          description: Export generation timestamp

    # Pagination Schemas
    CursorPagination:
      type: object
      required:
        - has_more
      properties:
        next_cursor:
          type: string
          description: Cursor for next page
          nullable: true
          example: def456
        prev_cursor:
          type: string
          description: Cursor for previous page
          nullable: true
          example: abc123
        has_more:
          type: boolean
          description: Whether more results exist
          example: true
        total:
          type: integer
          description: Total count (expensive, optional)
          nullable: true

    OffsetPagination:
      type: object
      required:
        - page
        - limit
        - total
        - total_pages
      properties:
        page:
          type: integer
          minimum: 1
          example: 1
        limit:
          type: integer
          minimum: 1
          maximum: 100
          example: 20
        total:
          type: integer
          description: Total number of items
          example: 47
        total_pages:
          type: integer
          description: Total number of pages
          example: 3

    # Error Schema
    Error:
      type: object
      required:
        - error
      properties:
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
              description: Machine-readable error code
              example: VALIDATION_ERROR
            message:
              type: string
              description: Human-readable error message
              example: Request validation failed
            details:
              type: object
              description: Additional error details
              additionalProperties: true
            field:
              type: string
              description: Field that caused the error
              example: email
            request_id:
              type: string
              description: Request ID for debugging
              example: req_abc123

  responses:
    # Success Responses
    NoContent:
      description: Operation successful, no content returned

    # Error Responses
    BadRequestError:
      description: Invalid request (400)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: BAD_REQUEST
              message: Invalid request format

    ValidationError:
      description: Request validation failed (400)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: VALIDATION_ERROR
              message: Request validation failed
              details:
                name: Name is required
                email: Invalid email format

    UnauthorizedError:
      description: Authentication required or failed (401)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: INVALID_TOKEN
              message: Authentication token is invalid or expired

    ForbiddenError:
      description: Insufficient permissions (403)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: FORBIDDEN
              message: You do not have permission to access this resource

    NotFoundError:
      description: Resource not found (404)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: NOT_FOUND
              message: Resource not found

    ConflictError:
      description: Resource conflict (409)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: ALREADY_EXISTS
              message: Resource with this identifier already exists

    PayloadTooLarge:
      description: Request payload too large (413)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: PAYLOAD_TOO_LARGE
              message: Request payload exceeds size limit
              details:
                max_size: 52428800
                received_size: 62914560

    BusinessLogicError:
      description: Business logic validation failed (422)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: INSUFFICIENT_CREDITS
              message: Insufficient credits for this operation
              details:
                required: 10
                available: 3

    RateLimitError:
      description: Rate limit exceeded (429)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: RATE_LIMIT_EXCEEDED
              message: Rate limit exceeded
              details:
                limit: 100
                remaining: 0
                reset_at: '2025-11-11T11:00:00Z'

    InternalServerError:
      description: Internal server error (500)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: INTERNAL_ERROR
              message: An unexpected error occurred
              request_id: req_abc123

    ServiceUnavailableError:
      description: Service temporarily unavailable (503)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: SERVICE_UNAVAILABLE
              message: Service is temporarily unavailable

  parameters:
    # Reusable Path Parameters
    ResourceId:
      name: id
      in: path
      description: Resource identifier
      required: true
      schema:
        type: string
        pattern: '^[a-z]+_[a-zA-Z0-9]+$'

    # Reusable Query Parameters
    CursorParam:
      name: cursor
      in: query
      description: Pagination cursor
      required: false
      schema:
        type: string

    LimitParam:
      name: limit
      in: query
      description: Number of items to return
      required: false
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

    PageParam:
      name: page
      in: query
      description: Page number
      required: false
      schema:
        type: integer
        minimum: 1
        default: 1

    SortParam:
      name: sort
      in: query
      description: Sort field (prefix - for descending)
      required: false
      schema:
        type: string
        example: -created_at
```

## Webhook Endpoints (Inbound)

[If third-party integrations send webhooks (from Session 2a):]

### POST /webhooks/{provider}

For each provider that sends webhooks:
- **Endpoint pattern**: `/webhooks/[provider-name]`
- **Request body schema**: Provider-specific event structure
- **Signature verification**: HMAC/JWT verification method (if supported)
- **Idempotency strategy**: Check `event_id` in `webhook_events` table before processing
- **Processing model**: Async (enqueue and return 200 immediately)
- **Success response**: `200 OK` with `{received: true}`
- **Error responses**:
  - `400 Bad Request`: Invalid signature
  - `422 Unprocessable Entity`: Invalid payload structure

**Example (Stripe)**:
```yaml
/webhooks/stripe:
  post:
    summary: Stripe webhook handler
    security: []  # No bearer auth, uses signature verification
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              id: {type: string, description: Event ID for idempotency}
              type: {type: string, example: payment_intent.succeeded}
              data: {type: object}
    responses:
      '200':
        description: Webhook received
        content:
          application/json:
            schema:
              type: object
              properties:
                received: {type: boolean, example: true}
      '400':
        $ref: '#/components/responses/ValidationError'
```

---

## API Versioning & Evolution (Phase 2)

### Versioning Strategy

**Chosen Strategy**: [URL Versioning / Header Versioning / Query Param / Content Negotiation]

**Rationale**: [Why this strategy fits the project - consider: public vs internal API, client coordination, testing complexity]

**Example**:
```yaml
# URL Versioning Example
servers:
  - url: https://api.example.com/v2
    description: Current version (v2)
  - url: https://api.example.com/v1
    description: Deprecated (sunset: 2026-06-01)

info:
  version: 2.0.0
  description: |
    ## Version History
    - **v2.0** (current, released: 2026-01-15): [Major changes - e.g., User schema restructured]
    - **v1.0** (deprecated, sunset: 2026-06-01): Legacy schema
```

### Deprecation Examples

**Deprecated Endpoint Example**:
```yaml
paths:
  /api/v1/users:
    get:
      deprecated: true
      summary: List users (DEPRECATED)
      description: |
        **DEPRECATED:** This endpoint will be removed on 2026-06-01.
        Use `/api/v2/users` instead.

        **Migration Guide**:
        - v2 uses `id` instead of `user_id`
        - v2 nests profile data under `profile` object
        - v2 returns ISO 8601 timestamps (v1 used Unix timestamps)
      x-sunset-date: "2026-06-01"
      x-replacement-endpoint: "/api/v2/users"
      tags: [Users, Deprecated]
```

**Deprecated Field Example**:
```yaml
components:
  schemas:
    User:
      properties:
        user_id:
          type: string
          description: |
            **DEPRECATED:** User identifier (use 'id' instead).
            Will be removed on 2026-06-01.
          deprecated: true
          x-sunset-date: "2026-06-01"
          x-replacement-field: "id"
          example: "user_abc123"
        id:
          type: string
          description: User identifier (replaces deprecated user_id)
          example: "user_abc123"
```

### Protobuf Reserved Fields (if using gRPC)

**Example of safe Protobuf evolution**:
```protobuf
// Version 1 (initial release)
message User {
  string name = 1;
  string email = 2;
  string status = 3;  // Simple string status
}

// Version 2 (evolved - field 3 replaced with enum)
message User {
  string name = 1;
  string email = 2;

  reserved 3;  // CRITICAL: Reserve field number 3 (never reuse!)
  reserved "status";  // Also reserve field name

  UserStatus status_v2 = 4;  // Replacement field gets NEW number
  string middle_name = 5;  // New optional field
  google.protobuf.Timestamp created_at = 6;  // New field
}

enum UserStatus {
  USER_STATUS_UNSPECIFIED = 0;  // Always include zero value
  USER_STATUS_ACTIVE = 1;
  USER_STATUS_INACTIVE = 2;
  USER_STATUS_SUSPENDED = 3;
}
```

**Why reserved fields matter**:
- Prevents field number reuse (causes data corruption)
- Prevents field name reuse (causes confusion)
- Documents evolution history (shows what was removed)

### Breaking Change Log

Document all breaking changes between versions:

| Version | Release Date | Breaking Changes | Migration Path |
|---------|--------------|------------------|----------------|
| **v2.0** | 2026-01-15 | - Renamed `user_id` → `id`<br>- Changed timestamp format (Unix → ISO 8601)<br>- Nested profile data | See migration guide below |
| **v1.0** | 2025-06-01 | Initial release | N/A |

### Migration Guide (v1 → v2)

**Field Mapping**:
```javascript
// v1 response
{
  "user_id": "user_abc123",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "created_at": 1704124800  // Unix timestamp
}

// v2 response (equivalent)
{
  "id": "user_abc123",
  "profile": {
    "name": "Alice Smith",
    "email": "alice@example.com"
  },
  "created_at": "2025-01-01T12:00:00Z"  // ISO 8601
}
```

**Client Migration Steps**:
1. Update API base URL: `https://api.example.com/v1` → `https://api.example.com/v2`
2. Replace `user_id` references with `id`
3. Update timestamp parsing (Unix → ISO 8601)
4. Access profile fields via `profile.name` instead of `name`
5. Test against v2 staging environment
6. Deploy updated client code

**Timeline**:
- **2026-01-15**: v2 released, v1 marked deprecated
- **2026-03-01**: v1 deprecation warnings in response headers
- **2026-06-01**: v1 sunset (removed, returns 410 Gone)

### Backward Compatibility Rules

**OpenAPI/REST Rules**:
- ✅ **Safe**: Add optional fields, add new endpoints, make required fields optional
- ❌ **Breaking**: Remove fields, rename fields, change types, add required fields

**Protobuf Rules**:
- ✅ **Safe**: Add optional fields with new numbers, mark fields as deprecated
- ❌ **Breaking**: Change field numbers, change types, remove fields without reserved, reuse field numbers

### Version Compatibility Testing

**Contract Tests**:
```yaml
# Ensure v2 API maintains backward compatibility with v1 clients
tests:
  - name: v1_client_reads_v2_response
    description: v2 API returns v1-compatible data when requested
    request:
      url: /api/v2/users
      headers:
        Accept: application/vnd.company.v1+json
    expect:
      - status: 200
      - response contains: user_id  # v1 field name
      - response contains: created_at as integer  # v1 format

  - name: v2_client_reads_v1_response
    description: v2 client handles v1 responses gracefully
    request:
      url: /api/v1/users
    expect:
      - status: 200
      - client parses user_id as id
      - client converts Unix timestamp to ISO 8601
```

---

## Notes

- Replace all `[Resource]`, `[Project Name]`, `[domain]`, etc. with actual values
- Add all your project-specific endpoints and schemas
- Use `$ref` to reuse schemas and avoid duplication
- Include examples for better documentation
- Mark required fields explicitly
- Use appropriate HTTP status codes
- Document all error cases
- Include rate limit headers in responses
- Use consistent naming (camelCase or snake_case, pick one)
- Validate with OpenAPI validator before finalizing
