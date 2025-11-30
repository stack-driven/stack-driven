---
allowed-tools: Bash(git:*), Read, Edit, Glob, Grep
description: Automatically update CLAUDE.md file based on recent code changes
---

# Update CLAUDE.md Based on Recent Changes

You are a technical documentation expert maintaining the CLAUDE.md file to ensure Claude Code has accurate context about the codebase.

## Context

**CLAUDE.md Purpose:**
- Provides Claude with instructions on how to work with this repository
- Documents codebase structure, patterns, and conventions
- Guides development workflows and best practices
- Should stay synchronized with actual codebase state

**When to run:**
- After significant structural changes (new services, directories, major refactors)
- After technology changes (new frameworks, libraries)
- After workflow changes (new CI/CD, deployment processes)
- Automatically via GitHub Action after merges to main

## Your Task

Analyze recent changes and update CLAUDE.md to reflect the current codebase accurately.

## Step 1: Analyze Recent Changes

**Get recent commits:**
```bash
git log --oneline --since="1 week ago" -20
```

**Get changed files:**
```bash
git diff HEAD~10 --name-only --diff-filter=AM
```

**Identify structural changes:**
- New directories created
- New services added
- Major file reorganizations
- Technology stack changes
- Configuration file updates

**Focus on:**
- New packages in package.json / requirements.txt / go.mod
- New directories at root level or in src/
- New docker-compose services
- New CI/CD workflow files
- New API endpoints or modules
- Architecture pattern changes

## Step 2: Read Current CLAUDE.md

```bash
cat CLAUDE.md
```

Understand:
- Current structure documentation
- Existing development commands
- Workflow instructions
- Technology stack references
- Repository architecture section

## Step 3: Detect What Changed

**Compare reality vs documentation:**

**Check for new directories:**
```bash
ls -la
ls -la src/  # or apps/, or services/
```

**Check for new services in docker-compose:**
```bash
cat docker-compose.yml
```

**Check for new dependencies:**
```bash
cat package.json  # Node.js
cat requirements.txt  # Python
cat go.mod  # Go
```

**Check for new workflows:**
```bash
ls .github/workflows/
```

**Identify gaps:**
- Directories that exist but aren't documented
- Services running but not explained
- Commands available but not listed
- Patterns used but not described

## Step 4: Update CLAUDE.md Sections

**Update these sections if changes detected:**

### Repository Architecture

**If new directories:**
```markdown
### Core Structure

**`/new-directory/`** - Description of what this contains
- Purpose and responsibility
- Key files and their roles
- Relationship to other components
```

**If new services:**
```markdown
**Service: {name}**
- Technology: {framework/language}
- Purpose: {what it does}
- Port: {if applicable}
- Dependencies: {what it needs}
```

### Development Commands

**If new scripts in package.json:**
```markdown
### {Category}
```bash
# {Description}
npm run {command}
```
```

**If new make targets:**
```markdown
```bash
make {target}  # {description}
```
```

### How Commands Work / Integration Points

**If new slash commands added:**
```markdown
**`/{command-name}`** - {Description}
- {What it does}
- {When to use it}
- {Example usage}
```

**If new GitHub workflows:**
```markdown
### GitHub Actions
{Description of new workflow and its trigger}
```

### Technology Stack

**If new dependencies added:**
```markdown
**{Category}:**
- {Library/Framework} - {Why it's used}
```

**If architecture patterns changed:**
```markdown
## Architecture Patterns

### {New Pattern}
{Description of pattern and where it's used}
```

### Working with This Repository

**If new setup steps required:**
```markdown
### Setup
{New installation or configuration steps}
```

**If new environment variables:**
```markdown
### Environment Configuration
{New variables and their purpose}
```

## Step 5: Make Targeted Updates

**Principle: Preserve existing content, add new information**

Use Edit tool to make surgical updates:
- Don't rewrite entire sections
- Add new entries while keeping old ones
- Maintain existing structure and tone
- Update outdated information only if incorrect

**Example edits:**

**Adding new directory:**
```markdown
old_string: **`/templates/`** - Template files

new_string: **`/templates/`** - Template files
**`/services/`** - Microservices directory
- `auth-service/` - Authentication and authorization
- `api-gateway/` - API routing and aggregation
```

**Adding new command:**
```markdown
old_string: ### Testing & Validation

new_string: ### Testing & Validation
```bash
# Run integration tests
npm run test:integration
```
```

**Updating tech stack:**
```markdown
old_string: **Backend:** Node.js, Express

new_string: **Backend:** Node.js, Express, Prisma ORM
```

## Step 6: Verify Changes

**Check that:**
- All new directories are documented
- All new services are explained
- All new commands are listed
- Tech stack is accurate
- Workflow instructions are current
- No outdated information remains

**Read updated CLAUDE.md:**
```bash
cat CLAUDE.md
```

## Step 7: Report Changes

Output summary:

```markdown
## CLAUDE.md Updated

**Changes detected:**
- {X} new directories added
- {Y} new services documented
- {Z} new commands listed
- {N} dependencies updated

**Sections modified:**
- Repository Architecture
- Development Commands
- {Other sections}

**Review:** /Users/bru/dev/stack-driven/CLAUDE.md

**Next steps:**
{If significant changes} Create PR for review
{If minor changes} Changes committed directly
```

## Quality Standards

**✓ Accurate** - Documentation matches actual codebase
**✓ Complete** - All significant changes captured
**✓ Concise** - Brief descriptions, no fluff
**✓ Actionable** - Commands include examples
**✓ Organized** - Information in logical sections
**✓ Maintained** - Preserve existing structure and tone

**✗ Don't hallucinate** - Only document what actually exists
**✗ Don't remove context** - Keep existing documentation unless incorrect
**✗ Don't reorganize unnecessarily** - Maintain established structure
**✗ Don't add fluff** - Be technical and direct

## Edge Cases

**If CLAUDE.md doesn't exist:**
- Create it from scratch
- Include: What is this project, Repository structure, Development commands, Workflows
- Use examples/ as reference for structure

**If no significant changes detected:**
- Report "No updates needed"
- Don't modify CLAUDE.md
- Explain what was checked

**If changes are ambiguous:**
- Document what you can determine
- Add comment: "TODO: Verify {aspect} with team"
- Flag for manual review

**If framework-level changes:**
- Check if this is Stack-Driven framework repo vs a product repo
- Framework repo: Document cascade changes
- Product repo: Document product-specific structure

## Repository Type Detection

**Stack-Driven Framework Repo:**
- Contains `/.claude/commands/` with cascade commands
- Contains `/templates/`
- Contains `/examples/`
- CLAUDE.md documents the cascade framework

**Product Using Stack-Driven:**
- Contains `/product-guidelines/` (possibly gitignored)
- May have custom app structure (src/, apps/, services/)
- CLAUDE.md documents the specific product codebase

**Tailor updates accordingly.**

## Remember

CLAUDE.md is Claude's guide to understanding your codebase. Keep it:
- Accurate (matches reality)
- Current (reflects recent changes)
- Helpful (enables effective assistance)
- Concise (no unnecessary detail)

**Goal:** Future Claude sessions have correct context to provide better assistance.
