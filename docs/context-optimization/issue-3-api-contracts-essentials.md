# Create api-contracts-essentials.md template for backlog generation

## Problem

The `api-contracts-template.md` file is **782 lines** with a complete OpenAPI 3.0 specification including request/response schemas, error definitions, authentication flows, pagination examples, and component schemas. When Session 10 (backlog generation) reads this file, it loads **~3,128 tokens** of implementation details.

**Bloat level: 85%** (CRITICAL)

## What Backlog Generation Actually Needs

Backlog generation needs:
- List of API endpoints (method + path)
- Which journey step each endpoint serves
- Brief description of what each endpoint does

Backlog generation does NOT need:
- Complete OpenAPI 3.0 specification
- Request/response schemas
- Error response definitions
- Authentication flow details
- Rate limiting configuration
- Pagination implementation
- Query parameter definitions
- Response header specifications
- Component schemas
- Security scheme definitions
- Example requests/responses

## Solution

Create `templates/18-api-contracts-essentials-template.md` that contains only the endpoint list needed for backlog generation.

**Target size: 60-80 lines (~240-320 tokens)**
**Reduction: 90% (782 → 70 lines)**

## Essential Template Structure

```markdown
# API Contracts Essentials (For Backlog Generation)

> This is a condensed version for Session 10 (backlog generation).
> See `08-api-contracts.md` for complete OpenAPI 3.0 specification.

## Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

## [Resource 1] Endpoints (Journey Step X)

- `POST /api/[resource1]` - Create [resource1]
- `GET /api/[resource1]` - List [resource1] (paginated)
- `GET /api/[resource1]/{id}` - Get single [resource1]
- `PATCH /api/[resource1]/{id}` - Update [resource1]
- `DELETE /api/[resource1]/{id}` - Delete [resource1]

## [Resource 2] Endpoints (Journey Step Y)

- `POST /api/[resource2]` - Create [resource2]
- `GET /api/[resource2]/{id}` - Get [resource2]
- `POST /api/[resource2]/{id}/[action]` - [Action description]

## [Resource 3] Endpoints (Journey Step Z)

- `GET /api/[resource3]` - List [resource3]
- `GET /api/[resource3]/{id}` - Get single [resource3]

## Analytics & Metrics Endpoints

- `POST /api/events` - Track usage event
- `GET /api/metrics/usage` - Get usage metrics

## Tech Choices

- **API Style**: RESTful
- **Authentication**: [JWT/OAuth/etc. from tech stack]
- **Pagination**: [Cursor/Offset]
- **Rate Limiting**: [Per-user/Per-team]
```

## Implementation Checklist

- [ ] Create `templates/18-api-contracts-essentials-template.md`
- [ ] Update `.claude/commands/generate-api-contracts.md` to generate BOTH versions
- [ ] Update `.claude/commands/generate-backlog.md` to read essentials instead of full file
- [ ] Test with example project
- [ ] Verify endpoint list is sufficient for story creation

## Success Criteria

- Essentials file is 60-80 lines
- Contains all endpoints with brief descriptions
- Stories can reference endpoints like "POST /api/documents" without full schemas
- Context usage reduced by ~2,800 tokens

## Impact

- **Lines reduced**: 782 → 70 (91% reduction)
- **Token reduction**: ~3,128 → ~280 tokens
- **Context savings**: ~2,848 tokens per backlog generation

## Labels

`enhancement`, `context-optimization`, `templates`, `high-impact`
