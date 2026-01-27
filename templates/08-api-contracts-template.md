# API Contracts Template

> This template guides the structure of `product-guidelines/08-api-contracts.md`

## Required Sections

### API Paradigm Decision

**This section MUST come first**, documenting the systematic analysis from Step 1 of the generate-api-contracts command.

```markdown
## API Paradigm Decision

**Chosen Style**: [REST / REST+HATEOAS / GraphQL / gRPC / WebSocket / Hybrid (specify components)]

**Journey-Based Reasoning**:
- [Reference specific journey steps that drove this decision]
- [Cite concrete requirements: latency needs, client types, scale projections, integration requirements]
- [Example: "Step 3 (AI document assessment) requires 5-10 min processing → REST with async job polling (202 Accepted + status endpoint), not WebSocket (overkill for long-running async jobs)"]
- [Example: "Journey has standard web CRUD patterns → REST sufficient, GraphQL adds complexity without bandwidth benefit"]

**Serialization Format**: [JSON / Protobuf / MessagePack / Hybrid (specify usage)]
- [Explain format choice based on paradigm and performance needs]
- [Reference serialization guide decision tree if relevant]
- [Example: "JSON for external API (universal support, human-readable debugging)"]
- [Example: "Hybrid: JSON for REST endpoints + Protobuf for future internal gRPC services (if microservices migration occurs)"]
- [Example for financial: "JSON with Decimal string representation for monetary amounts (exact precision, no binary float rounding errors)"]

**Scale-Forward Strategy**:
- [How this design supports future growth without breaking external contracts]
- [Migration path if requirements change]
- [Example: "Start with REST+JSON monolith. If microservices later: keep REST external (stable public API), add gRPC between internal services (performance), use API gateway for routing."]
- [Document when to reconsider: "If mobile app added with bandwidth constraints → evaluate GraphQL for field-level selection optimization"]
- [Example: "If real-time collaboration added → add WebSocket for live updates alongside REST for standard operations"]

**Alternatives Explicitly Rejected**:

**GraphQL**:
- What: Query language allowing clients to request exact fields needed, single endpoint for all queries
- Why not chosen: [Journey-specific reasoning]
  - Example: "Simple CRUD patterns with predictable queries → REST sufficient"
  - Example: "No over-fetching problem (mobile bandwidth not constrained)"
  - Example: "Team familiar with REST, GraphQL adds learning curve without clear benefit"
  - Example: "50+ optional fields per resource would justify GraphQL, but our entities are focused (10-15 fields each)"
- Reconsider if: [Specific trigger conditions]
  - Example: "Mobile app added with variable data needs across screens"
  - Example: "Third-party developers need flexible API without versioning"
  - Example: "Over-fetching becomes measurable performance problem"

**gRPC**:
- What: High-performance RPC with Protocol Buffers (binary), bidirectional streaming
- Why not chosen: [Journey-specific reasoning]
  - Example: "Web-based journey → browsers need grpc-web proxy (adds complexity)"
  - Example: "No network bottleneck (<1k req/s) → REST/JSON sufficient and easier to debug"
  - Example: "External API → REST has better tooling (Postman, curl, browser DevTools)"
  - Example: "Performance requirements met by REST (no <10ms latency SLA)"
- Reconsider if: [Specific trigger conditions]
  - Example: "Microservices with high-throughput service-to-service calls (>10k req/s)"
  - Example: "Need bidirectional streaming (not just client→server or server→client)"
  - Example: "Internal-only APIs where debugging complexity acceptable"

**WebSocket (Real-Time)**:
- What: Persistent bidirectional connection for instant updates (<1s latency)
- Why not chosen: [Journey-specific reasoning]
  - Example: "Document processing takes 5-10 min → polling every 5s acceptable, WebSocket overkill"
  - Example: "No collaborative editing → no need for live multi-user sync"
  - Example: "Async operations → REST 202 Accepted + status polling simpler than WebSocket connection management"
  - Example: "WebSocket adds complexity: connection scaling, reconnection logic, fallback strategies"
- Reconsider if: [Specific trigger conditions]
  - Example: "Need <1s updates (live dashboards, trading, gaming)"
  - Example: "Collaborative features added (multiple users editing same resource)"
  - Example: "Mobile app where polling drains battery"

**REST + HATEOAS (Hypermedia)**:
- What: REST with hyperlinks to related resources (self-documenting API)
- Why not chosen: [Journey-specific reasoning]
  - Example: "Single-page app with known backend → no need for API discoverability"
  - Example: "No third-party developers → HATEOAS overhead without benefit"
  - Example: "Standard REST simpler for internal team"
- Reconsider if: [Specific trigger conditions]
  - Example: "Public API for third-party developers (reduces documentation burden)"
  - Example: "Marketplace/partner integrations (API discoverability valuable)"
  - Example: "Client needs vary significantly (HATEOAS enables adaptive clients)"

**[Other paradigms considered]**: [Add any additional paradigms evaluated]
```

**Validation**: Every statement in this section MUST reference specific inputs from:
- Journey steps (00-user-journey.md)
- Tech stack decisions (02-tech-stack.md)
- Architecture requirements (04-architecture.md)
- Product strategy (01-product-strategy.md)
- Scale projections

If you cannot cite a concrete reason from previous sessions, the paradigm choice may be arbitrary and violates framework philosophy.

---

### OpenAPI 3.0 Specification Structure

After the API Paradigm Decision section, include the complete OpenAPI spec. Use the structure below:

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

---

### Additional Required Sections

After the OpenAPI specification, include:

**Overview**:
- API style (from Paradigm Decision)
- Base URLs
- Versioning strategy
- Total endpoint count

**Authentication**:
- Auth method (from tech stack)
- How to obtain tokens
- Token format and placement
- Token lifetime and refresh

**Core Resources** (for each):
- Purpose (journey connection)
- Endpoints table
- Key design decisions

**Patterns**:
- Rate limiting implementation
- Error handling conventions
- Pagination strategy

**Testing Examples**:
- curl/httpie commands for key endpoints
- Example requests and responses

**What We DIDN'T Choose** (beyond paradigm section):
- Header-based API versioning
- Full OAuth 2.0 server
- API Gateway (Kong, AWS)
- Other implementation alternatives

---

## Notes

- Replace all `[Resource]`, `[Project Name]`, `[domain]`, etc. with actual values
- Add all project-specific endpoints and schemas
- Use `$ref` to reuse schemas and avoid duplication
- Include examples for better documentation
- Mark required fields explicitly
- Use appropriate HTTP status codes
- Document all error cases
- Include rate limit headers in responses
- Use consistent naming (camelCase or snake_case, pick one)
- Validate with OpenAPI validator before finalizing
