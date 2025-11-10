# Context Files for Agentic Coding Environments

This directory contains machine-readable context files that help AI coding agents make better decisions aligned with your product strategy.

## Purpose

When AI agents generate code, they need to understand:
- **User journey**: What user problem is this code solving?
- **Mission**: What outcome should this code advance?
- **Metrics**: What should this code measure/improve?
- **Tech stack**: What technologies/patterns to use?
- **Priorities**: What matters most right now?

These JSON files provide structured context that agents can programmatically reference.

## Files

### Core Strategy
- `user-journey.json` - Primary user flows, personas, value delivery
- `mission.json` - Mission statement and decision criteria
- `metrics.json` - North Star, input metrics, targets
- `monetization.json` - Business model, pricing, value metrics

### Implementation Guidelines
- `tech-stack.json` - Approved technologies, patterns, conventions
- `architecture.json` - Architecture patterns, principles, decisions
- `integration.json` - API conventions, webhook patterns, auth methods
- `priorities.json` - Current focus areas, quick win criteria

## Usage

### For AI Coding Agents

**Example prompt augmentation:**
```
You are implementing [feature]. Reference the following context:

User Journey Context: {.context/user-journey.json}
Tech Stack: {.context/tech-stack.json}
Architecture Patterns: {.context/architecture.json}

Ensure your implementation:
1. Serves the user journey step defined in context
2. Uses approved technologies from tech stack
3. Follows architectural patterns
4. Includes observability for metrics tracking
```

### For Claude Code / Cursor / GitHub Copilot

Add to your project's instructions:

```markdown
## Project Context

This project follows Stack-Driven development. Before generating code:

1. Check `.context/priorities.json` for current focus areas
2. Reference `.context/tech-stack.json` for technology choices
3. Follow patterns in `.context/architecture.json`
4. Ensure changes advance metrics in `.context/metrics.json`
```

### For Custom AI Tools

Parse JSON directly:

```python
import json

with open('.context/tech-stack.json') as f:
    stack = json.load(f)

# Use approved backend framework
backend = stack['backend']['framework']  # 'fastapi'

# Follow conventions
api_prefix = stack['conventions']['api_versioning']  # '/api/v1/'
```

## Maintenance

**Update these files when:**
- Strategic priorities change (quarterly)
- Tech stack evolves (new major dependencies)
- Architecture patterns are established (ADRs)
- Metrics targets are revised (monthly/quarterly)

**Keep in sync with:**
- Foundation docs (`../foundation/`)
- Stack docs (`../stack/`)
- Actual codebase implementation

## Example: Agent Decision Flow

```
Agent Task: "Add user authentication to document upload endpoint"

1. Check priorities.json
   → Current focus: "improve_activation_rate"
   → Auth is required (table stakes)

2. Check tech-stack.json
   → Auth provider: "clerk"
   → Pattern: "jwt_bearer_token"

3. Check architecture.json
   → Security pattern: "auth_required_by_default"
   → Authorization: "resource_ownership_check"

4. Generate code
   → Use Clerk SDK
   → Verify JWT
   → Check user owns resource
   → Add audit logging
   → Include in metrics tracking
```

## Contributing

When adding new strategic decisions:
1. Update markdown docs first (`foundation/` or `stack/`)
2. Sync machine-readable JSON here
3. Test with AI agent to ensure parseable
4. Commit both together

---

**Remember**: These files help AI agents make decisions aligned with your product strategy. Keep them updated and they'll make your AI development powerhouse even more powerful.
