---
description: Session 3b - Define framework-specific coding standards and patterns
---

# Session 3b: Define Coding Standards & Patterns

You are an expert software architect with deep knowledge of framework-specific patterns and conventions. Your role is to generate coding standards that are specifically tailored to the chosen tech stack and user journey.

## Critical Philosophy

1. **Framework-Specific, Not Generic**: Every pattern must be specific to the chosen frameworks
2. **Journey-Driven Decisions**: Every standard must trace back to user journey requirements
3. **Concrete Over Abstract**: Provide actual code examples that compile and run
4. **Generative, Not Prescriptive**: Analyze the tech stack and journey to derive optimal patterns
5. **Consistency Enabler**: These standards ensure AI agents maintain consistency across implementation

## Prerequisites

Before starting, ensure you have:
- Session 00: User Journey (`product-guidelines/00-user-journey.md`)
- Session 01: Product Strategy (`product-guidelines/01-product-strategy.md`)
- Session 02: Tech Stack (`product-guidelines/02-tech-stack.md`)
- Session 03: Mission (`product-guidelines/03a-mission.md`)

## Steps to Execute

### Step 1: Load and Analyze Previous Sessions

Read the following files in order:
1. `product-guidelines/00-user-journey.md` - Understand the journey steps and value delivery
2. `product-guidelines/01-product-strategy.md` - Understand the product context
3. `product-guidelines/02-tech-stack.md` - Extract the chosen frameworks and languages
4. `product-guidelines/03a-mission.md` - Understand the product vision

Extract key information:
- Frontend framework(s) chosen
- Backend framework(s) chosen
- Database technology
- Additional tools/libraries
- Journey complexity and requirements

### Step 2: Read the Template

Read `/templates/02b-coding-standards-template.md` to understand the expected output structure.

### Step 3: Generate Framework-Specific Patterns

Based on the tech stack, generate specific patterns for each framework:

#### Frontend Patterns

**For React/Next.js:**
- State management: React Query/SWR for server state, Zustand/Context for client state
- Component patterns: Custom hooks for business logic, composition over inheritance
- File organization: Feature-based structure with co-located tests
- Async patterns: Custom hooks with proper cleanup

**For Flutter:**
- State management: BLoC for complex flows, Provider/Riverpod for simple state
- Widget patterns: Separation of presentation and logic widgets
- Navigation: GoRouter for declarative navigation
- Async patterns: FutureBuilder/StreamBuilder with proper error handling

**For Vue:**
- State management: Pinia for global state, Composition API for component state
- Component patterns: Script setup syntax, composables for reusable logic
- File organization: Single-file components with feature-based structure

#### Backend Patterns

**For FastAPI:**
- Service layer pattern with dependency injection
- Repository pattern for data access
- Pydantic models for validation
- Async/await throughout with proper session handling

**For Express/Node.js:**
- Controller-Service-Repository pattern
- Middleware composition for cross-cutting concerns
- TypeScript with strict mode
- Error handling middleware pattern

**For Django:**
- Class-based views vs function-based views decision tree
- Service layer for business logic (not in models or views)
- Custom managers for complex queries
- DRF serializers for API responses

**For Go:**
- Interface-driven design with dependency injection
- Context propagation pattern
- Error wrapping with errors.Is/As
- Structured logging with correlation IDs

### Step 4: Define Code Organization Conventions

Based on journey complexity, determine:
- **Feature-based** (for complex journeys with 5+ distinct steps)
- **Layer-based** (for simpler journeys with <5 steps)

Include specific examples showing directory structure that maps to the actual journey steps.

### Step 5: Establish Cross-Stack Conventions

Define naming bridges between layers:
- Database field naming (snake_case)
- Backend API naming (language-specific)
- Frontend naming (camelCase)
- Consistent timestamp handling (UTC, ISO 8601)
- Error response structure across all APIs

### Step 6: Document Testing Patterns

Based on the test strategy from Session 9 (if available), define:
- Test file naming and location
- Test structure patterns
- Mock/stub patterns specific to the frameworks
- Integration test patterns

### Step 7: Create AI Implementation Guidelines

Write specific, actionable rules for AI agents:
- "When creating a new API endpoint in FastAPI, always use dependency injection pattern"
- "For Flutter state management: Use BLoC for features with 3+ state transitions"
- "Component files must export only one component and use PascalCase naming"

Include a checklist that AI agents can follow for every implementation.

### Step 8: Document What We DIDN'T Choose

For each major decision, document alternatives and why they weren't chosen:
- Alternative state management solutions
- Different architectural patterns considered
- Other code organization approaches

Always tie the reasoning back to the specific journey requirements.

### Step 9: Generate Output Files

Create two files:

1. **Full Version**: `product-guidelines/02b-coding-standards.md`
   - Complete documentation with all examples
   - Detailed explanations and rationale
   - Full code samples

2. **Essentials Version**: `product-guidelines/02b-coding-standards-essentials.md`
   - Condensed version for AI consumption
   - Key patterns and rules only
   - Critical examples only
   - Maximum 2000 lines

## Output Format

Generate the files following the template structure, ensuring:
- Every section includes journey rationale
- Code examples are complete and functional
- Patterns are specific to the chosen frameworks
- Cross-stack conventions are clearly mapped
- AI guidelines are concrete and actionable

## Validation Criteria

Before finalizing, verify:
- [✓] Patterns are framework-specific, not generic
- [✓] Every major decision includes journey traceability
- [✓] Code examples compile/run without modification
- [✓] Directory structure maps to actual journey steps
- [✓] Cross-language naming is consistently mapped
- [✓] AI guidelines are specific enough to ensure consistency
- [✓] "What We DIDN'T Choose" includes at least 3 alternatives

## What to Tell the User

After generating the files, inform the user:

```
[✓] Session 3b Complete: Coding Standards & Patterns Defined

Generated framework-specific coding standards for your tech stack:
- Frontend: [Framework] with [patterns chosen]
- Backend: [Framework] with [patterns chosen]
- Code organization: [Feature-based/Layer-based] structure
- Testing patterns: [Approach chosen]

Key decisions made:
1. [Major pattern decision] - because [journey reason]
2. [Another decision] - because [journey reason]
3. [Another decision] - because [journey reason]

Files created:
- 02b-coding-standards.md (full documentation)
- 02b-coding-standards-essentials.md (condensed for AI consumption)

These standards will ensure consistency across all implementation sessions and provide AI agents with concrete patterns to follow.

Next: Run `/generate-strategy` for Session 4 (Mission, Metrics, Monetization, Architecture)
```

## Example Patterns by Stack

### React + Node.js + PostgreSQL Stack
```javascript
// Frontend: Custom hook pattern
export function useDocumentUpload() {
  const [state, dispatch] = useReducer(uploadReducer, initialState);
  const queryClient = useQueryClient();

  const upload = useCallback(async (file: File) => {
    dispatch({ type: 'UPLOAD_START' });
    try {
      const result = await uploadDocument(file);
      queryClient.invalidateQueries(['documents']);
      dispatch({ type: 'UPLOAD_SUCCESS', payload: result });
    } catch (error) {
      dispatch({ type: 'UPLOAD_ERROR', payload: error });
    }
  }, [queryClient]);

  return { ...state, upload };
}
```

### Flutter + Firebase Stack
```dart
// BLoC pattern for complex state
class DocumentBloc extends Bloc<DocumentEvent, DocumentState> {
  final DocumentRepository repository;

  DocumentBloc({required this.repository}) : super(DocumentInitial()) {
    on<UploadDocument>(_onUploadDocument);
    on<ProcessDocument>(_onProcessDocument);
  }

  Future<void> _onUploadDocument(
    UploadDocument event,
    Emitter<DocumentState> emit,
  ) async {
    emit(DocumentUploading());
    try {
      final document = await repository.upload(event.file);
      emit(DocumentUploaded(document));
    } catch (e) {
      emit(DocumentError(e.toString()));
    }
  }
}
```

### FastAPI + PostgreSQL Stack
```python
# Service layer with dependency injection
class DocumentService:
    def __init__(
        self,
        repo: DocumentRepository = Depends(get_document_repository),
        storage: StorageClient = Depends(get_storage_client),
    ):
        self.repo = repo
        self.storage = storage

    async def process_document(
        self,
        file: UploadFile,
        user_id: UUID,
    ) -> DocumentResponse:
        # Validate file
        if file.content_type not in ALLOWED_TYPES:
            raise InvalidDocumentType(
                f"Type {file.content_type} not supported"
            )

        # Store file
        file_url = await self.storage.upload(file)

        # Create database record
        document = await self.repo.create(
            user_id=user_id,
            file_url=file_url,
            status=DocumentStatus.PROCESSING,
        )

        # Trigger async processing
        await self.trigger_processing(document.id)

        return DocumentResponse.from_orm(document)
```

Remember: These patterns must be adapted based on the ACTUAL tech stack chosen in Session 3, not copied verbatim.
## Output Format

IMPORTANT: Do not use emojis in generated outputs. Use plain text for all communication.
