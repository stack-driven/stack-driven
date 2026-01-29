# Coding Standards Essentials (For Backlog Generation)

> This is a condensed version for Sessions 9b, 10, and 12.
> See `02b-coding-standards.md` for complete framework-specific patterns, error handling details,
> testing patterns, security patterns, and AI implementation guidelines.

---

## Journey Context

[1-2 sentence summary of how journey requirements drive these standards]

_Example: "4-hour document review → 60-second AI assessment requires async processing patterns, real-time progress updates, and robust error handling for compliance-critical operations."_

---

## Framework Configuration

**Frontend**: [Framework from Session 3]
**Backend**: [Framework from Session 3]
**State Management**: [Approach]
**Database ORM**: [ORM from Session 3]

---

## 1. Directory Structure

### Frontend

```
/src or /lib
  /features
    /[journey-step-1]/
      /components or /widgets/
      /hooks or /blocs/
    /[journey-step-2]/
      ...
  /shared/
    /components/
    /utils/
```

### Backend

```
/api or /routers
  /[domain-1]/
  /[domain-2]/
/services/
/repositories/
```

**Organization**: [Feature-based / Layer-based / Domain-driven]

---

## 2. Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| Frontend Components | [PascalCase/other] | `DocumentUpload.tsx` |
| Backend Services | [convention] | `document_service.py` |
| Database Models | [convention] | `document.model.ts` |
| Tests | [convention] | `document.test.js` |
| API Routes | [convention] | `/api/documents` |

---

## 3. Cross-Stack Field Naming

| Layer | Convention | Example |
|-------|------------|---------|
| Database | [snake_case/other] | `created_at`, `user_id` |
| Backend API | [convention] | `created_at` or `createdAt` |
| Frontend | [camelCase/other] | `createdAt`, `userId` |

**Timestamp Format**: [ISO 8601 / Unix / Other]
**ID Type**: [UUID / ULID / Auto-increment]

---

## 4. State Management Pattern

**Approach**: [Specific pattern from Session 3]

**When to Use**:
- [Specific scenario from journey]
- [Another specific scenario]

_Example: "React Query for server state, useState for UI state"_

---

## 5. Error Handling Pattern

### Error Response Structure

```json
{
  "error": {
    "code": "[ERROR_CODE_FORMAT]",
    "message": "Human-readable message",
    "details": {},
    "timestamp": "2024-01-15T14:30:00Z"
  }
}
```

**Error Code Format**: [SCREAMING_SNAKE_CASE/other]

**Categories**:
- `AUTH_*` - Authentication errors
- `VALIDATION_*` - Input validation errors
- `[DOMAIN]_*` - Domain-specific errors
- `SYSTEM_*` - System-level errors

---

## 6. API Patterns

**Route Organization**: [RESTful/GraphQL/other]

**Service Layer**: [Where business logic lives]

**Database Interaction**: [Repository/Active Record/other]

---

## 7. Testing Conventions

**Test Location**: [Co-located / Separate directory]

**Naming Pattern**:
```[language]
describe('[Component/Service Name]', () => {
  it('should [expected behavior]', () => {
    // Test implementation
  });
});
```

**Mock Strategy**: [Specific approach from Session 3]

---

## 8. Security Patterns

**Authentication**: [JWT/Session/OAuth/other from Session 3]

**Authorization**: [RBAC/ABAC/other]

**Input Validation**: [Where and how validation occurs]

---

## 9. Performance Patterns

**Caching**: [What is cached and where]

**Query Optimization**: [Approach - e.g., "N+1 prevention via eager loading"]

**Frontend**: [Code splitting/lazy loading approach if applicable]

---

## Notes for Backlog Generation

### Story Scoping Impact

**Simple stories** (follow these patterns):
- Single CRUD operations in one layer
- Example: "Create document" → Service + Repository + Controller

**Medium stories** (require pattern coordination):
- Multi-layer features with state management
- Example: "Document upload with progress" → Async pattern + state updates + API integration

**Complex stories** (need architecture alignment):
- Cross-domain features
- Example: "Real-time collaboration" → WebSocket pattern + state sync + conflict resolution

### Pattern Consistency Checklist

When generating stories, ensure acceptance criteria include:
- [ ] Follows naming conventions (Section 2)
- [ ] Uses state management pattern (Section 4)
- [ ] Implements error handling (Section 5)
- [ ] Includes tests following conventions (Section 7)
- [ ] Applies security patterns (Section 8)

### AI Implementation Notes

Stories should reference:
- Directory structure for file placement
- State management approach for data flow
- Error handling pattern for failure cases
- Testing pattern for acceptance criteria

---

## References

For complete coding standards including:
- Framework-specific implementation patterns with code examples
- Complete error handling strategies
- Detailed testing patterns and mock examples
- Security implementation details
- Performance optimization techniques
- Domain-specific patterns
- AI agent implementation checklist
- Quality metrics and review checklist
- Quick reference for common operations

See: `product-guidelines/02b-coding-standards.md`
