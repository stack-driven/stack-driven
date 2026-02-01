# Stack-Driven Framework Validation Checklist

## Philosophy: What Makes a Good Validation Rule?

**Good rule:** "Session 10 must read .ctx.md files for sessions 1-9b" → Binary, checkable, objective

**Bad rule:** "Command explanations should be clear" → Subjective, requires human judgment

**Focus on:** Structure, naming, references, consistency. NOT quality, clarity, or design decisions.

---

## Category 1: File Reference Integrity

### Rule 1.1: File Read References Must Be Creatable
**What:** Every `Read: product-guidelines/XXX.md` must point to a file that gets created by a previous session

**Check:**
- Extract all `Read: product-guidelines/` lines from all command files
- Build dependency graph: "Command A reads file X, which session creates X?"
- Verify: File X is created by a session that runs BEFORE the session doing the reading

**Failure example:**
```
❌ Session 8 (generate-api-design.md:40)
   Reads: product-guidelines/09-test-strategy.ctx.md
   Problem: Session 9 runs AFTER Session 8
   Fix: Session 8 cannot read a file from a future session
```

### Rule 1.2: Context Files Must Be Documented in Source Session
**What:** If session X reads `YY-name.ctx.md`, then the session that creates `YY-name.md` must have instructions to create the .ctx.md version

**Check:**
- List all sessions 1-9b
- For each session, verify command file includes:
  - "After Generating [X] Document" section
  - Distillation agent invocation instructions
  - Output path: `product-guidelines/XX-name.ctx.md`

**Failure example:**
```
❌ Session 5 (create-brand-strategy.md)
   Creates: 05-brand-strategy.md
   Missing: Instructions to create 05-brand-strategy.ctx.md
   Expected: "After Generating Brand Strategy Document" section with distillation agent call
```

### Rule 1.3: Template File Existence
**What:** Every session command that generates output must have a corresponding template file

**Check:**
- Extract "Use `/templates/XX-name-template.md`" from each command
- Verify that template file exists at that path

**Failure example:**
```
❌ Session 7 (design-database-schema.md:1235)
   References: /templates/07-database-schema-template.md
   Problem: File not found
   Fix: Create template OR update command reference
```

### Rule 1.4: Context vs Full File Usage (Decision Matrix Compliance)
**What:** Sessions must read .ctx.md files when available per CLAUDE.md Decision Matrix

**Check:**
- CLAUDE.md documents "Session X reads: [files]" with .ctx.md specified
- Verify command file for Session X actually reads .ctx.md (not full .md)
- Exception: Session 3 reads full `02-tech-stack.md` (no .ctx version per design)

**Failure example:**
```
❌ Session 10 (generate-backlog.md:20)
   Reads: product-guidelines/02-tech-stack.md
   Expected: product-guidelines/02-tech-stack.ctx.md
   Reason: CLAUDE.md Decision Matrix says Session 10 uses .ctx.md
```

---

## Category 2: Session Numbering Consistency

### Rule 2.1: Session Number Format Standardization
**What:** Session references must follow standard format: "Session X" or "Session X (name)" or "Session Xb"

**Valid formats:**
- "Session 1"
- "Session 8 (api-design)"
- "Session 8b (api-contracts)"
- "Session 8b"

**Invalid formats:**
- "Session 8" when context requires disambiguation from 8b
- "Session 8 (api-contracts)" ← should be 8b
- "Session 08" ← no leading zeros

**Check:**
- Grep all documentation for "Session \d+"
- Verify format matches valid patterns
- Check disambiguation: If both Session 8 and 8b exist, references in propagation patterns should clarify which

**Failure example:**
```
❌ CLAUDE.md:133
   Found: "Session 8 designs API endpoints"
   Problem: Ambiguous - Session 8 or 8b?
   Fix: "Session 8 (api-design)" or "Session 8b (api-contracts)"
```

### Rule 2.2: Session Number Sequence Validity
**What:** Valid session numbers are: 1, 2, 2a, 3, 3b, 3c, 4, 5, 6, 7, 8, 8b, 9, 9b, 10-14

**Invalid:** 2b, 3a, 3d, 8a, 8c, 9a, 9c, 15+

**Check:**
- Extract all "Session X" references
- Verify X is in valid set
- Flag any session numbers outside valid range

**Failure example:**
```
❌ Found reference to "Session 3a"
   Problem: No Session 3a exists (valid: 3, 3b, 3c)
   Fix: Likely meant Session 3b or Session 3c
```

### Rule 2.3: Cascade Order Consistency
**What:** CASCADE-DEPENDENCIES.md, CLAUDE.md cascade diagram, and README must show same session order

**Check:**
- Extract session order from all three files
- Compare: Must be identical sequence
- Verify arrow dependencies match (session X → session Y)

**Failure example:**
```
❌ Order mismatch:
   README.md shows: Session 3 → Session 4
   CLAUDE.md shows: Session 3 → Session 3b → Session 4
   Fix: Add Session 3b to README cascade diagram
```

---

## Category 3: Naming Consistency (Tables, Epics, Files)

### Rule 3.1: Database Table Name Consistency
**What:** Table names must be identical across all sessions that reference them

**Tables to track:**
- `integration_credentials`
- `webhook_events`
- `sync_jobs`
- `external_resource_mappings`
- (Plus any core tables like `users`, `documents`, etc.)

**Check:**
- Session 4 (architecture.md) mentions tables → Extract names
- Session 7 (database-schema.md) defines tables → Extract names
- Session 8b (api-contracts.md) references tables → Extract names
- Session 10 (generate-backlog.md) story templates mention tables → Extract names
- Compare: All references to same table must use identical name

**Failure example:**
```
❌ Table name mismatch: "sync_jobs" vs "integration_sync_logs"
   Session 4 (architecture.md:215): sync_jobs
   Session 7 (database-schema.md:329): sync_jobs ✓
   CLAUDE.md:132: integration_sync_logs ✗
   Fix: Update CLAUDE.md:132 to use "sync_jobs"
```

### Rule 3.2: Epic Number Consistency
**What:** Epic numbers mentioned in CLAUDE.md must match generate-backlog.md usage

**Check:**
- CLAUDE.md propagation patterns: "Epic XX" references
- generate-backlog.md: Epic structure definition (lines 56-64)
- generate-backlog.md: Story templates reference "Epic XX"
- Verify: All references to same epic use same number

**Failure example:**
```
❌ Epic number mismatch
   CLAUDE.md:135: "Session 10 generates Epic 05 integration stories"
   generate-backlog.md:56: Epic 04 (Foundation)
   generate-backlog.md:263: Type: Story, Epic: Epic 04 (Foundation)
   Fix: CLAUDE.md should say "Epic 04"
```

### Rule 3.3: Command Name Consistency
**What:** Command names in documentation must match actual command file names

**Check:**
- Extract all `/command-name` references from README, CLAUDE.md
- Verify: `.claude/commands/command-name.md` exists
- Verify: Command description in YAML frontmatter matches documentation

**Failure example:**
```
❌ Command name mismatch
   README.md:150: "/generate-api-design"
   Expected file: .claude/commands/generate-api-design.md ✓
   But CLAUDE.md:86: "/design-api" ✗
   Fix: Update CLAUDE.md to use "/generate-api-design"
```

---

## Category 4: Propagation Pattern Completeness

### Rule 4.1: i18n Propagation Pattern Verification
**What:** If CLAUDE.md documents i18n flowing through Sessions X, Y, Z, verify each session actually implements it

**Check:**
- CLAUDE.md lines 117-125: Documents i18n propagation (Sessions 3, 7, 8, 10, 12)
- For each listed session:
  - Session 3 (choose-tech-stack.md): Search for "i18n" logic → Must exist
  - Session 7 (design-database-schema.md): Search for "Step 2a: Check for Internationalization" → Must exist
  - Session 8 (generate-api-design.md): Search for "Accept-Language" → Must exist
  - Session 10 (generate-backlog.md): Search for "i18n Infrastructure" stories → Must exist
  - Session 12 (scaffold-project.md): Search for "/locales/" generation → Must exist

**Failure example:**
```
❌ i18n propagation incomplete
   CLAUDE.md:120 claims: "Session 8 adds Accept-Language header support"
   But generate-api-design.md has no mention of i18n or Accept-Language
   Fix: Add i18n section to Session 8 command OR remove from CLAUDE.md
```

### Rule 4.2: AI Integration Propagation Pattern Verification
**What:** If Session 3c exists, verify it's referenced in Sessions 4, 10 as documented

**Check:**
- CLAUDE.md lines 84, 104: Documents Session 3c (optional)
- Verify conditional reading in later sessions:
  - Session 4 (generate-strategy.md): Must have conditional read of `02c-ai-integration-strategy.ctx.md`
  - Session 10 (generate-backlog.md): Must have "AI-Specific Stories" section

**Failure example:**
```
❌ AI integration pattern incomplete
   Session 3c exists and creates 02c-ai-integration-strategy.md
   But Session 4 (generate-strategy.md) has no conditional read logic
   Expected: "If product-guidelines/02c-ai-integration-strategy.ctx.md exists: Read"
```

### Rule 4.3: Third-Party Integration Propagation Pattern Verification
**What:** CLAUDE.md lines 127-138 document integration propagation across 8 sessions - verify each

**Check:**
- For each session in propagation pattern (2a, 3, 4, 7, 8, 8b, 10, 12):
  - Extract documented responsibility (e.g., "Session 4: includes integration architecture patterns")
  - Search command file for evidence of that logic
  - Verify section exists (e.g., Session 4 should have "Step 5a: Integration Architecture Patterns")

**Failure example:**
```
❌ Integration propagation missing step
   CLAUDE.md:130: "Session 3 selects SDKs/client libraries for integrations"
   But choose-tech-stack.md has no integration SDK selection logic
   Fix: Add SDK selection to Session 3 command OR update CLAUDE.md
```

---

## Category 5: Template ↔ Command Alignment

### Rule 5.1: Template Sections Match Command Instructions
**What:** If command says "use template section X," verify template has section X

**Check:**
- Command file describes output structure (e.g., "Key Sections: 1. X, 2. Y, 3. Z")
- Template file has those exact section headings
- Order matches

**Failure example:**
```
❌ Template section mismatch
   generate-strategy.md:228: "Key Sections: Mission statement, Vision, Principles"
   But 03a-mission-template.md has sections: Overview, Mission, What We DIDN'T Choose
   Missing: Vision section
   Fix: Add Vision section to template OR update command description
```

### Rule 5.2: Template File References in Commands Are Accurate
**What:** When command says "Use `/templates/XX-name-template.md`", that path must be correct

**Check:**
- Extract all template references from command files
- Verify each path exists
- Verify file name matches (e.g., not `02-techstack-template.md` when it should be `02-tech-stack-template.md`)

---

## Category 6: Documentation Drift Detection

### Rule 6.1: Cascade Diagram Completeness
**What:** CLAUDE.md cascade diagram must list ALL sessions 1-14 with correct output files

**Check:**
- Extract sessions from cascade diagram (CLAUDE.md lines ~47-115)
- Verify presence of: Session 1, 2, 2a, 3, 3b, 3c, 4, 5, 6, 7, 8, 8b, 9, 9b, 10, 11, 12, 13, 14
- Verify each session lists correct output files
- Verify arrows show correct dependencies

**Failure example:**
```
❌ Cascade diagram missing optional session
   Diagram shows: Session 3 → Session 4
   But Session 3c exists (optional AI integration)
   Fix: Add Session 3c to diagram with (optional) notation
```

### Rule 6.2: README Quick Start Matches Actual Commands
**What:** README lists commands to run - verify they exist and are in correct order

**Check:**
- README "Follow the Flow" section lists commands
- Verify each command file exists
- Verify order matches cascade order in CLAUDE.md

**Failure example:**
```
❌ README command order incorrect
   README shows: /choose-tech-stack → /generate-strategy
   But cascade has: /choose-tech-stack → /define-coding-standards → /generate-strategy
   Fix: Add /define-coding-standards to README
```

### Rule 6.3: Decision Matrix Table Accuracy
**What:** CLAUDE.md "Session-by-Session Matrix" table (lines ~353-376) must match actual command behavior

**Check:**
- For each row in table:
  - Session number → Verify exists
  - "Reads From" column → Verify command reads those files
  - "File Versions" column → Verify .ctx.md vs .md matches command
  - "Note" column → Verify note is accurate

**Failure example:**
```
❌ Decision Matrix inaccurate
   Table row for Session 10 says: "Reads: 00-04, 07-09b, File Versions: .ctx.md for ALL"
   But generate-backlog.md:20 reads: 02-tech-stack.md (not .ctx.md)
   Fix: Update command to read .ctx.md OR update table to note exception
```

---

## Category 7: Cross-File Reference Consistency

### Rule 7.1: CLAUDE.md Quick Reference Matches Detailed Sections
**What:** CLAUDE.md has "Quick Reference: Session Dependencies" (lines ~511-541) - must match detailed cascade description

**Check:**
- Quick Reference section lists: Session X [reads: A, B, C] → Generates D + E
- Compare to detailed cascade section for Session X
- Verify: Files read match, files generated match

**Failure example:**
```
❌ Quick Reference out of sync
   Quick Reference (line 521): Session 3c reads [00, 01, 02]
   But detailed section (line 104) says: Session 3c reads [00, 01, 02] ✓
   And actual command reads: [00.ctx.md, 01.ctx.md, 02.ctx.md]
   Fix: Update Quick Reference to specify .ctx.md
```

### Rule 7.2: Context File Token Reduction Claims
**What:** Documentation claims X% token reduction for .ctx.md files - verify this is documented consistently

**Check:**
- CLAUDE.md lists token reduction percentages (e.g., "56% reduction" for database schema)
- Verify same percentage mentioned in:
  - Command file (e.g., design-database-schema.md)
  - CLAUDE.md cascade description
  - generate-backlog.md context optimization section

**Failure example:**
```
❌ Token reduction percentage mismatch
   CLAUDE.md:45: "07-database-schema.ctx.md (~56% smaller)"
   design-database-schema.md:1135: "Achieve 60-70% token reduction"
   Fix: Use consistent percentage (56% is actual measured, keep that)
```

---

## Category 8: Conditional Logic Consistency

### Rule 8.1: Optional Session Handling
**What:** Sessions 2a and 3c are optional - verify commands handle their absence correctly

**Check:**
- Session 3 (choose-tech-stack.md): Must have `If 02a-constraints.ctx.md exists: Read`
- Session 4 (generate-strategy.md): Must have conditional reads for 02a and 3c
- CLAUDE.md: Must document which sessions are optional

**Failure example:**
```
❌ Missing conditional read
   Session 4 (generate-strategy.md:36) reads: 02a-constraints.ctx.md
   But no conditional check (If exists)
   Fix: Add "If product-guidelines/02a-constraints.ctx.md exists: Read"
```

### Rule 8.2: Propagation Pattern Trigger Conditions
**What:** i18n, AI, integration patterns should only trigger when conditions are met

**Check:**
- i18n pattern: Trigger = Session 2a marks i18n as required
- AI pattern: Trigger = Session 2 detects AI in journey
- Integration pattern: Trigger = Session 2a documents integrations

**Verify each later session checks the condition:**
- Session 7: "Step 2a: Check for i18n requirements" → Must check if 02a marks i18n
- Session 10: "AI-Specific Stories (if 02c exists)" → Must be conditional

**Failure example:**
```
❌ Missing conditional trigger
   generate-backlog.md:258: "Internationalization (i18n) Stories"
   But no logic to check IF Session 2a marked i18n as required
   Fix: Add "Check product-guidelines/02a-constraints.ctx.md for i18n requirement"
```

---

## Category 9: Output File Naming Consistency

### Rule 9.1: Output File Name Pattern
**What:** Output files follow pattern: `NN-name.md` and `NN-name.ctx.md` where NN = session number

**Valid:** `07-database-schema.md`, `02a-constraints.ctx.md`, `08b-api-contracts.md`

**Invalid:** `07-database.md`, `database-schema.md`, `7-database-schema.md`

**Check:**
- Extract all output file paths from command files
- Verify naming pattern matches
- Verify session number in filename matches session that creates it

**Failure example:**
```
❌ Output filename pattern violation
   Session 7 command says: "Create: product-guidelines/database-schema.md"
   Expected: product-guidelines/07-database-schema.md
   Fix: Use numbered prefix matching session
```

### Rule 9.2: Context File Suffix Consistency
**What:** All context files must end in `.ctx.md` (not `.context.md`, `.ctx.markdown`, etc.)

**Check:**
- Grep for context file references
- Verify all use `.ctx.md` suffix

---

## Category 10: Distillation Agent Usage

### Rule 10.1: Context File Generation Instructions Completeness
**What:** Sessions 1-9b must include complete distillation agent invocation

**Required elements:**
1. "After Generating [X] Document" section heading
2. Task tool invocation with subagent_type: general-purpose
3. Source file path
4. Output file path with .ctx.md suffix
5. List of what to extract (CRITICAL items)
6. Token reduction target (60-70%)

**Check:**
- Each session 1-9b command file has all 6 elements
- Source path and output path are correct
- Critical items to extract are specific (not generic)

**Failure example:**
```
❌ Incomplete distillation instructions
   Session 5 (create-brand-strategy.md) missing distillation section
   Expected: "After Generating Brand Strategy Document" with full agent invocation
   Fix: Add distillation section to end of command file
```

---

## Category 11: API Security Validation Rules

### Rule 11.1: OWASP Coverage Completeness

**What:** Session 8 API design output must contain sections for all applicable OWASP API Top 10 2023 risks

**Check:**
- Read `product-guidelines/08-api-design.md`
- Verify presence of "Security Protection Patterns (OWASP API Top 10)" section
- For each of 8 applicable risks (API1, 3, 5, 6, 7, 8, 10), verify:
  - Subsection exists (e.g., "### API1:2023 - Broken Object Level Authorization")
  - "Applicability: YES / NO" field present
  - If YES: Journey analysis documented, protection pattern documented
  - If NO: "Reconsider if" conditions documented

**Failure example:**
```
❌ OWASP coverage incomplete
   08-api-design.md has "Security Protection Patterns" section ✓
   But missing subsection for API6:2023 (Unrestricted Access to Sensitive Business Flows)
   Fix: Add API6 subsection with journey analysis
```

**Rationale**: Ensures generated API designs systematically address known API security vulnerabilities instead of ad-hoc security thinking.

---

### Rule 11.2: Security Pattern Journey Traceability

**What:** Each OWASP protection pattern must reference specific journey steps or database tables (Session 7)

**Check:**
- For each applicable OWASP risk in `08-api-design.md`:
  - Extract "Journey Analysis" subsection
  - Verify at least ONE specific reference to:
    - Journey Step X (e.g., "Journey Step 2: document upload")
    - Database table from Session 7 (e.g., "`documents` table with `user_id` column")
    - User role from journey (e.g., "admin role manages users")
- Reject generic reasoning without journey citation

**Failure example:**
```
❌ Security pattern lacks journey traceability
   API1 (BOLA) section says:
   "BOLA protection is important for securing APIs" ✗
   Expected:
   "Journey Step 2 (document upload) creates user-owned documents in `documents` table → BOLA: WHERE user_id = :current_user_id" ✓
```

**Acceptable references:**
- "Journey Step 2 (document upload)" ✓
- "`documents` table has `user_id` ownership column (Session 7)" ✓
- "Admin role manages team members (Journey Step 5)" ✓

**Unacceptable references:**
- "Users need secure access" ✗ (generic, no specific journey step)
- "Best practice for APIs" ✗ (not journey-driven)
- "OWASP recommends this" ✗ (external authority, not journey)

**Rationale**: Maintains Stack-Driven's journey-first philosophy—every security decision must serve specific user needs, not generic "best practices."

---

### Rule 11.3: Input Validation Strategy Presence

**What:** Session 8 API design output must contain complete input validation strategy

**Check:**
- Read `product-guidelines/08-api-design.md`
- Verify presence of "Input Validation Strategy" section
- Check required subsections:
  - Validation Approach (paradigm, library from Session 3)
  - Validation Rules by Input Type (email, URLs, files, strings, numbers, dates, UUIDs)
  - Sanitization Strategy (HTML, SQL injection, command injection, path traversal)
  - Journey-Based Validation Reasoning

**Failure example:**
```
❌ Input validation strategy incomplete
   08-api-design.md has "Input Validation Strategy" section ✓
   But missing "File Upload" validation rules
   Journey Step 2 involves document upload → File validation required
   Fix: Add file upload validation (MIME type, size, virus scanning)
```

**Validation library check:**
- Library documented must match tech stack from Session 3
- Python (FastAPI) → Pydantic ✓
- Node.js (Express) → Joi / Zod / AJV ✓
- Mismatch: Python backend with Joi library ✗

**Rationale**: Input validation is critical for preventing injection attacks, DoS, and data corruption. Must be documented systematically, not left to implementation guesswork.

---

### Rule 11.4: Security Headers Configuration

**What:** Session 8 API design output must document required security headers

**Check:**
- Read `product-guidelines/08-api-design.md`
- Verify API8:2023 (Security Misconfiguration) section includes:
  - `Strict-Transport-Security` header (HSTS)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options` (DENY or SAMEORIGIN with reasoning)
  - `Content-Security-Policy` (journey-specific policy)
  - `X-Request-ID` (request tracing)

**Failure example:**
```
❌ Security headers incomplete
   API8 section exists ✓
   But missing Content-Security-Policy header
   Fix: Add CSP header (e.g., "default-src 'self'" for API-only)
```

**Journey-based CSP check:**
- API-only (no web frontend): `default-src 'self'` ✓
- Web app with CDN: `default-src 'self' https://cdn.example.com` ✓
- Generic CSP with no journey reasoning: ✗

**Rationale**: Security headers prevent entire classes of attacks (XSS, clickjacking, MITM). Must be configured based on journey requirements, not copy-pasted from generic guides.

---

### Rule 11.5: Idempotency and Retry Strategies

**What:** Session 8 API design output must document idempotency protection and retry strategies for resilient operations

**Check:**
- Read `product-guidelines/08-api-design.md`
- Verify presence of "Idempotency and Retry Strategies" section
- Check required subsections:
  - Idempotency-Protected Endpoints (financial operations, resource creation)
  - Retry Strategy (Retry-After header usage, client retry guidance)
  - Circuit Breaker Configuration (third-party API protection)
  - Journey-Based Reasoning

**Idempotency pattern requirements:**
- Financial operations (payments, orders) MUST require Idempotency-Key header
- Resource creation endpoints (POST/PATCH) SHOULD require or recommend Idempotency-Key
- Implementation requirements documented (store, key format, expiry)
- Journey context provided (which steps need idempotency protection)

**Failure example:**
```
❌ Idempotency strategy incomplete
   08-api-design.md has "Idempotency and Retry Strategies" section ✓
   But POST /api/payments endpoint missing from idempotency-protected list
   Journey Step 4 involves payment processing → Idempotency-Key required
   Fix: Add POST /api/payments to Financial Operations section
```

**Retry strategy requirements:**
- 429 (Rate Limit) responses include `Retry-After` header
- 503 (Service Unavailable) responses include `Retry-After` header
- 202 (Accepted - async) responses include `Retry-After` header for polling
- Client retry guidance documented (exponential backoff, max retries, jitter)

**Failure example:**
```
❌ Retry strategy missing Retry-After header
   Error examples show 429 response ✓
   But no Retry-After header in response
   Fix: Add "Retry-After: 60" header to 429 response example
```

**Circuit breaker requirements:**
- All third-party APIs documented (from Session 4 architecture)
- For each third-party API: timeout, circuit states, fallback strategy
- Journey context (which steps depend on third-party APIs)
- Implementation library specified (from tech stack)

**Failure example:**
```
❌ Circuit breaker missing third-party API
   08-api-design.md has Circuit Breaker Configuration section ✓
   Journey Step 3 uses OpenAI API (from Session 4 architecture)
   But no circuit breaker configuration for OpenAI documented
   Fix: Add OpenAI circuit breaker (timeout 30s, fallback: queue for retry)
```

**Journey traceability check:**
- Idempotency endpoints reference specific journey steps
- Retry strategies explain which journey steps tolerate delays
- Circuit breakers trace to third-party dependencies from Session 4
- Reasoning connects to user experience impact

**Acceptable references:**
- "Journey Step 4 (payment processing) creates charges → Network timeout risk → Idempotency-Key prevents duplicate charges" ✓
- "Third-party dependency: OpenAI API (Session 4 architecture) → Circuit breaker prevents cascade failures" ✓

**Unacceptable references:**
- "Idempotency is a best practice" ✗ (generic, no journey context)
- "APIs should be resilient" ✗ (not journey-specific)

**Rationale**: Idempotency and retry strategies prevent critical user-facing failures (duplicate charges, cascade failures, poor UX during network issues). Must be documented based on journey requirements, not generic resilience advice.

---

## Implementation Priority

### Tier 1 (Critical - Implement First):
- Rule 1.4: Context vs Full File Usage
- Rule 2.1: Session Number Format Standardization
- Rule 3.1: Database Table Name Consistency
- Rule 3.2: Epic Number Consistency
- Rule 11.1: OWASP Coverage Completeness (NEW - Session 8 security)
- Rule 11.2: Security Pattern Journey Traceability (NEW - Session 8 security)

### Tier 2 (Important - Implement Soon):
- Rule 1.1: File Read References Must Be Creatable
- Rule 1.2: Context Files Must Be Documented
- Rule 4.1-4.3: Propagation Pattern Completeness
- Rule 6.3: Decision Matrix Table Accuracy
- Rule 11.3: Input Validation Strategy Presence (NEW - Session 8 security)
- Rule 11.4: Security Headers Configuration (NEW - Session 8 security)
- Rule 11.5: Idempotency and Retry Strategies (NEW - Phase 2: Resilience)

### Tier 3 (Nice to Have - Implement Later):
- Rule 5.1: Template Section Alignment
- Rule 7.1: Cross-File Reference Consistency
- Rule 10.1: Distillation Agent Completeness

---

## How to Use This Checklist

**For Manual Review:**
- Print this checklist
- Review PR against each rule
- Check off passing rules
- Document failures with line numbers

**For Automation:**
- Each rule = one validator function
- Run all validators on every commit
- Output: List of failures with file:line references
- Exit code 1 if any rule fails

**For PR Reviews:**
- Run validator before creating PR
- Fix all failures
- Reviewer can focus on design, not consistency

---

## Success Criteria

**Validation layer is successful when:**
1. No consistency bugs reach PR review (caught locally first)
2. PR reviews focus on "Is this the right design?" not "Did you spell this correctly?"
3. Adding new propagation patterns takes 1 commit, not 3-5 fix commits
4. Documentation stays in sync with code automatically (validator enforces it)
5. New contributors can run validator to check their changes

**The goal:** Make consistency bugs impossible to merge.
