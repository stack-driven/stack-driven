# Coding Standards & Patterns

_This document defines framework-specific coding standards and patterns for the [Product Name] implementation. Every pattern is derived from the user journey requirements and chosen tech stack._

## Journey Context

> Reference the specific journey requirements that drive these standards

_Example: "The 4-hour document review → 60-second AI assessment journey requires async processing patterns for large files, real-time progress updates, and robust error handling for compliance-critical operations."_

## 1. Framework-Specific Patterns

### Frontend: [Framework Name from Session 3]

#### State Management Pattern

**Chosen Approach**: [Specific pattern with framework]

**Journey Rationale**: [Why this pattern serves the specific journey needs]

**Implementation Pattern**:
```[language]
// Concrete example specific to the journey
// This code should compile and run
```

**When to Use**:
- [Specific scenario from journey]
- [Another specific scenario]

#### Component/Widget Organization

**Structure Decision**: [Specific approach]

**Directory Layout**:
```
/src or /lib
  /features
    /[journey-step-1-name]/
      /components or /widgets/
      /hooks or /blocs/
      /services/
      /tests/
    /[journey-step-2-name]/
      ...
  /shared/
    /components/
    /utils/
```

**Naming Conventions**:
- Components/Widgets: [PascalCase/other]
- Files: [naming-convention]
- Tests: [test.suffix or .test]

#### Async Data Patterns

**Data Fetching**: [Specific pattern]

**Error Handling**: [Specific approach]

**Example Implementation**:
```[language]
// Journey-specific example
```

### Backend: [Framework Name from Session 3]

#### Service Layer Architecture

**Pattern**: [Specific architecture pattern]

**Journey Rationale**: [Why this serves the journey]

**Implementation**:
```[language]
// Service class/function example
// Include dependency injection if applicable
```

#### API Route Organization

**Structure**:
```
/api or /routers
  /[journey-domain-1]/
    - endpoints
  /[journey-domain-2]/
    - endpoints
```

**Naming Convention**: [RESTful/GraphQL/other]

#### Business Logic Location

**Decision**: [Where business logic lives]

**Rationale**: [Why based on journey complexity]

#### Database Interaction Patterns

**Pattern**: [Repository/Active Record/other]

**Example**:
```[language]
// Database interaction example
```

## 2. Code Organization Conventions

### Directory Structure Philosophy

**Decision**: [Feature-based / Layer-based / Domain-driven]

**Journey Mapping**:
- Feature/Module 1 → Journey Step: [step name]
- Feature/Module 2 → Journey Step: [step name]
- Feature/Module 3 → Journey Step: [step name]

### File Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| Frontend Components | [convention] | `DocumentUpload.tsx` |
| Backend Services | [convention] | `document_service.py` |
| Database Models | [convention] | `document.model.ts` |
| Tests | [convention] | `document.test.js` |
| Utilities | [convention] | `date-utils.ts` |

### Module Organization

**Import Order**:
1. [Framework/library imports]
2. [Third-party imports]
3. [Local imports]
4. [Style imports if applicable]

**Export Patterns**: [Named/Default/Barrel]

## 3. Cross-Stack Conventions

### Data Field Naming Bridge

| Layer | Convention | Example |
|-------|------------|---------|
| Database | [snake_case/other] | `created_at`, `user_id` |
| Backend API | [convention] | `created_at` or `createdAt` |
| Frontend | [camelCase/other] | `createdAt`, `userId` |
| GraphQL | [convention] | `createdAt`, `userId` |

### Timestamp Standards

**Storage Format**: [Specific format]
- Example: `2024-01-15T14:30:00Z`

**API Format**: [Specific format]
- Example: ISO 8601 with timezone

**Display Format**: [Approach]
- Example: User's local time with format customization

### ID Standards

**Type**: [UUID/ULID/Auto-increment/other]
**Format**: [Specific format]
**Generation**: [Where IDs are generated]

## 4. Error Handling Patterns

### Error Response Structure

```json
{
  "error": {
    "code": "[ERROR_CODE_FORMAT]",
    "message": "Human-readable message",
    "details": {
      // Additional context
    },
    "timestamp": "2024-01-15T14:30:00Z",
    "traceId": "correlation-id"
  }
}
```

### Error Code Convention

**Format**: [SCREAMING_SNAKE_CASE/other]

**Categories**:
- `AUTH_*` - Authentication errors
- `VALIDATION_*` - Input validation errors
- `[DOMAIN]_*` - Domain-specific errors
- `SYSTEM_*` - System-level errors

### Error Handling Patterns

**Frontend**:
```[language]
// Error boundary or error handling example
```

**Backend**:
```[language]
// Exception handling example
```

## 5. Testing Patterns

### Test Organization

**Structure**: [Co-located/Separate directory]

```
[feature]/
  ComponentName.tsx
  ComponentName.test.tsx  <- Co-located example
```

### Test Naming Convention

```[language]
describe('[Component/Service Name]', () => {
  describe('[Method/Behavior]', () => {
    it('should [specific expected behavior]', () => {
      // Test implementation
    });
  });
});
```

### Mock/Stub Patterns

**Approach**: [Specific mocking strategy]

**Example**:
```[language]
// Mock example for the specific stack
```

## 6. Security Patterns

### Authentication Patterns

**Method**: [JWT/Session/OAuth/other]

**Implementation Location**: [Where auth is handled]

### Authorization Patterns

**Method**: [RBAC/ABAC/other]

**Implementation**: [How permissions are checked]

### Input Validation

**Location**: [Where validation occurs]

**Pattern**: [How validation is implemented]

## 7. Performance Patterns

### Caching Strategy

**Levels**: [What is cached and where]

**Invalidation**: [Cache invalidation approach]

### Database Query Patterns

**Optimization Approach**: [Specific patterns]

**Example**:
```[language]
// Optimized query example
```

### Frontend Performance

**Code Splitting**: [Approach if applicable]

**Lazy Loading**: [Pattern if applicable]

## 8. Domain-Specific Patterns

### [Journey-Specific Domain 1]

**Pattern**: [Specific pattern for this domain]

**Example**: [Code example]

### [Journey-Specific Domain 2]

**Pattern**: [Specific pattern for this domain]

**Example**: [Code example]

## 9. What We DIDN'T Choose

### State Management Alternatives

**[Alternative 1]**: [Why not chosen based on journey]

**[Alternative 2]**: [Why not chosen based on journey]

### Architecture Alternatives

**[Alternative Pattern]**: [Why not chosen]

**[Another Alternative]**: [Why not chosen]

### Code Organization Alternatives

**[Alternative Structure]**: [Why not chosen]

## 10. AI Agent Implementation Checklist

When implementing any feature, AI agents should:

### Pre-Implementation
- [ ] Verify feature maps to specific journey step in `00-user-journey.md`
- [ ] Review relevant section of this standards document
- [ ] Check for existing patterns in codebase to match

### During Implementation
- [ ] Follow directory structure from Section 2
- [ ] Use state management pattern from Section 1
- [ ] Apply naming conventions from Section 3
- [ ] Implement error handling from Section 4
- [ ] Include appropriate testing from Section 5

### Post-Implementation
- [ ] Verify code matches patterns in this document
- [ ] Ensure tests follow testing patterns
- [ ] Check that error handling is consistent
- [ ] Validate naming conventions are followed

## 11. Migration Guidelines

### Adding New Features
1. Identify which journey step the feature serves
2. Follow the established pattern for that domain
3. Use existing examples as templates

### Refactoring Existing Code
1. Gradually migrate to these patterns
2. Prioritize high-impact areas first
3. Maintain backward compatibility during transition

## 12. Quality Metrics

### Code Quality Indicators
- **Pattern Consistency**: [How to measure]
- **Test Coverage**: [Target percentage and scope]
- **Performance**: [Key metrics to track]

### Review Checklist
- [ ] Follows framework-specific patterns
- [ ] Maintains naming conventions
- [ ] Includes proper error handling
- [ ] Has appropriate test coverage
- [ ] Documents deviations with rationale

---

## Appendix: Quick Reference

### Common Operations

**Creating a New Feature**:
1. [Step 1 with specific command/pattern]
2. [Step 2 with specific command/pattern]
3. [Step 3 with specific command/pattern]

**Adding an API Endpoint**:
1. [Step 1 with specific pattern]
2. [Step 2 with specific pattern]

**Creating a New UI Component**:
1. [Step 1 with specific pattern]
2. [Step 2 with specific pattern]

### Framework-Specific Commands

```bash
# Common development commands for this stack
[command 1] - Description
[command 2] - Description
[command 3] - Description
```

---

_Remember: These standards are derived from your specific journey requirements. They should be treated as strong guidelines that ensure consistency while allowing flexibility for journey-specific needs._

## Validation Criteria

**Excellent**:
- Every pattern includes journey-specific rationale
- Code examples are complete and compile without modification
- Framework-specific patterns are clearly distinguished
- Cross-stack conventions are explicitly mapped
- AI guidelines are specific and actionable

**Good**:
- Most patterns include rationale
- Code examples are mostly complete
- Framework patterns are documented
- Some cross-stack mapping exists

**Needs Improvement**:
- Generic patterns without journey connection
- Incomplete or pseudo-code examples
- Missing framework-specific details
- Unclear cross-stack conventions
- Vague AI guidelines