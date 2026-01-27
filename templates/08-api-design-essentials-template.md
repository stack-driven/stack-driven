# API Design Essentials (For Backlog Generation)

> **Note**: This is a condensed version for Session 10 (backlog generation). See `08-api-design.md` for complete analysis, decision trees, and alternatives.

---

## API Configuration

**Paradigm**: [REST / GraphQL / gRPC / WebSocket / Hybrid]

**Serialization Format**: [JSON / Protobuf / MessagePack / Hybrid]

**Versioning**: [URL versioning (/v1/) / Header versioning / No versioning]

**Base URL**: https://api.[domain].com

---

## Authentication

**Method**: [JWT / OAuth / API Keys / Clerk / Auth0]

**Token Placement**: [Authorization: Bearer <token> / Cookie / Query param]

**Authorization Patterns**:
- User-owned: `WHERE user_id = :current_user_id`
- Team resources: `WHERE team_id = :current_user_team_id`
- Admin-only: Check role or permissions
- Public: No auth required

---

## Rate Limiting

**Limits by Tier**:
- Free: [X req/min, Y req/day]
- Pro: [X req/min, Y req/day]
- Enterprise: [Custom/unlimited]

**Endpoint-Specific**:
- Expensive ops (uploads, AI): [Stricter limits]
- Read ops (GET): [Standard limits]
- Public endpoints: [Strictest limits per-IP]

**Headers**: `X-RateLimit-{Limit,Remaining,Reset}`

---

## Pagination

**Approach**: [Cursor-based / Offset-based / Hybrid]

**Cursor** (for >1K records):
- Request: `GET /api/resources?cursor=abc&limit=20`
- Response: `{data[], pagination: {nextCursor, prevCursor, hasMore}}`

**Offset** (for <1K records):
- Request: `GET /api/resources?page=1&limit=20`
- Response: `{data[], pagination: {page, limit, total, totalPages}}`

---

## Error Handling

**Standard Format**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error",
    "details": {},
    "field": "fieldName",
    "request_id": "req_abc123"
  }
}
```

**Common Status Codes**:
- 200 OK, 201 Created, 202 Accepted, 204 No Content
- 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- 409 Conflict, 413 Payload Too Large, 422 Unprocessable Entity, 429 Too Many Requests
- 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable

---

## Design Decisions Summary

### Paradigm Choice: [Paradigm]

**Reasoning** (2-3 sentences): [Why this paradigm serves the journey - reference specific journey steps or architecture]

**Key Decision Factors**:
- Real-time: [Requirement and decision]
- Data fetching: [Requirement and decision]
- Architecture: [Monolith/microservices alignment]

---

### Serialization Format: [Format]

**Reasoning** (2-3 sentences): [Why this format fits paradigm and journey - reference performance/bandwidth needs]

**Format by Context**:
- External APIs: [Format]
- Internal APIs: [Format]
- Cache/Queue: [Format]

---

## For Backlog Generation

When creating user stories in Session 10:

**API-Driven Stories**:
- Use paradigm choice to determine story patterns (REST CRUD / GraphQL queries / gRPC services)
- Reference auth patterns for ownership and permissions stories
- Apply rate limiting tiers to usage-based features
- Use pagination approach for list/browse stories
- Apply error handling format to all error scenarios

**Story Sizing**:
- Simple CRUD: [S/M] (standard REST patterns)
- Custom actions: [M/L] (business logic + API endpoint)
- Real-time features: [L/XL] (WebSocket/SSE if applicable)
- File uploads: [M/L] (multipart handling, validation)

**Acceptance Criteria**:
- Auth: "Endpoint requires authentication and checks ownership"
- Rate limiting: "Endpoint respects tier limits ([X]/min for free)"
- Pagination: "Returns paginated results with [cursor/offset]"
- Errors: "Returns standard error format with appropriate status codes"

---

## Reference

For complete decision trees, alternatives analysis, and scale-forward strategy, see `08-api-design.md`.
