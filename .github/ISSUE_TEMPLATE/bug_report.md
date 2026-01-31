---
name: Bug Report
about: Report a bug or issue with Stack-Driven
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description

<!-- A clear and concise description of the bug -->

## Steps to Reproduce

1. Run command: `/...`
2. Complete session with: '...'
3. Then run: `/...`
4. Error appears: '...'

## Expected Behavior

<!-- What you expected to happen -->

## Actual Behavior

<!-- What actually happened -->

## Environment

- **Stack-Driven Version:** [e.g., 2.0.0]
- **AI Assistant:** [e.g., Claude Code, other]
- **Operating System:** [e.g., macOS 14.0, Ubuntu 22.04, Windows 11]
- **GitHub CLI Version** (if using `/create-gh-issues`): [e.g., 2.40.0]

## Relevant Files

<!-- If applicable, include contents of relevant files -->

**Command that failed:**
```bash
/command-name
```

**Error message:**
```
Error message here
```

**Relevant output file (if applicable):**
```bash
# Output from:
cat product-guidelines/XX-file.md
```

## Additional Context

<!-- Add any other context about the problem here -->

**Cascade status:**
```bash
# Output from:
/cascade-status
```

**Files present:**
```bash
# Output from:
ls -la product-guidelines/
```

## Possible Solution

<!-- If you have suggestions on how to fix the bug, share them here -->

## Workaround

<!-- If you found a workaround, share it here to help others -->

---

## For Automated Debugging

**This issue can be debugged using `/fix-bug {issue-number}`**

The debugging tracker will be automatically added as a comment below when `/fix-bug` runs for the first time.

### Debugging Tracker Preview

Once `/fix-bug` is run, a tracking comment will appear below with this structure:

```markdown
## 🔍 Debugging Tracker

⚠️ AUTO-GENERATED - DO NOT EDIT MANUALLY

### Attempt Log
| # | Hypothesis | Local Test | Result | Error Sig |
|---|-----------|------------|---------|----------|
| 1 | [Hypothesis tested] | ❌ Failed / ✅ Passed | [Result] | [Error signature] |

### Status
**Current:** 1 of 5 attempts
**Outcome:** 🔄 IN PROGRESS | ✅ RESOLVED | ⚠️ NEEDS HUMAN

### Next Steps
[Automatic instructions for next action]
```

**How it works:**
1. Run `/fix-bug {issue-number}` to start hypothesis-driven debugging
2. System tests one hypothesis per run (prevents circular loops)
3. Tracking comment updates automatically after each attempt
4. Auto-escalates if stuck (same error 3x or 5 attempts max)
5. Creates PR automatically when tests pass

---

**Troubleshooting checklist:**
- [ ] I've checked [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md)
- [ ] I've checked [FAQ.md](../../FAQ.md)
- [ ] I've searched existing issues
- [ ] I can reproduce this consistently
- [ ] I've tried with the latest version
