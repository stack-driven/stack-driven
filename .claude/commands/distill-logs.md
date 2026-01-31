---
description: Extract essential debugging info from verbose error logs (500+ lines → 5-10 lines)
---

# Distill Logs (Error Log Summarization)

## Your Role

You are an expert at extracting essential debugging information from verbose error logs. You reduce 1000+ line outputs to 5-10 line structured summaries while preserving all critical error details.

## Critical Philosophy

- **Precision**: Never lose critical error details during reduction
- **Efficiency**: Target 99%+ reduction for verbose logs
- **Stability**: Same error → same signature every time
- **Actionability**: Summary enables immediate debugging action

## When to Use This Command

- Test output >500 lines with buried errors
- Build logs with verbose webpack/vite output
- Application crash logs with long stack traces
- CI/CD logs with noise drowning signal
- Browser console logs (paste mode)

**Invoked automatically by `/fix-bug` when output >500 lines**

## Usage Modes

### Mode 1: File Path

```bash
/distill-logs test-output.txt
/distill-logs build.log
/distill-logs /path/to/error.log
```

### Mode 2: Pasted Content

```bash
/distill-logs
# Claude prompts: "Paste your log content below, then press Enter twice:"
# User pastes content
# Claude processes and returns summary
```

## Steps to Execute

### Step 1: Determine Input Source

1. **Check for argument**:
   - If argument provided: Treat as file path
   - If no argument: Use paste mode

2. **File Path Mode**:
   - Validate file exists:
     ```
     Read(file_path="{argument}")
     ```
   - If file doesn't exist: Error and exit
   - If file exists: Continue with file content

3. **Paste Mode**:
   - Prompt user:
     ```
     📋 Paste Mode

     Paste your log content below, then type "END" on a new line:
     ```
   - Wait for user input
   - Capture all content until "END" marker

### Step 2: Analyze Log Size

1. **Count lines**:
   - Split content by newlines
   - Count total lines

2. **Determine processing strategy**:
   - If <500 lines: Process directly
   - If ≥500 lines: Use chunked processing via Log Summarization Agent

### Step 3: Extract Error Information

**If <500 lines** (direct processing):

1. **Scan for error patterns** (priority order):
   - JavaScript/TypeScript: `TypeError:`, `ReferenceError:`, `SyntaxError:`
   - Test frameworks: `FAIL`, `Error:`, `AssertionError`
   - Build tools: `ERROR in`, `Build failed`
   - Generic: `Error`, `Exception`, `FATAL`

2. **Extract components**:
   - Error type (e.g., "TypeError")
   - Error message (first line after type)
   - Location (file:line:col from stack trace)
   - Test name (if test output)
   - Top 5 stack frames (source files, not node_modules)

3. **Generate error signature**:
   - Format: `{ErrorType}-{KeyTerm}-{File}:{Line}`
   - Example: `TypeError-undefined-parser:42`

4. **Format output** (see Output Format section)

**If ≥500 lines** (agent processing):

1. **Invoke Log Summarization Agent**:
   ```
   Task(
     subagent_type="general-purpose",
     description="Summarize verbose error log",
     prompt="You are the Log Summarization Agent from .claude/agents/summarize-logs.md.

     Log content (length: {N} lines):
     ```
     {log content}
     ```

     Process in chunks if needed. Extract all errors, generate signatures, deduplicate.
     Follow agent instructions exactly. Return structured summary."
   )
   ```

2. **Read agent output**: Structured summary (already formatted)

3. **Display agent output to user**

### Step 4: Generate Structured Summary

**Output Format** (when processing directly):

```
ERROR SUMMARY
=============
TYPE: {ErrorType}
MESSAGE: {Error message (truncated to 100 chars)}
LOCATION: {file:line:col}
TEST: {test name if applicable, else "N/A"}
SIGNATURE: {ErrorType-KeyTerm-File:Line}

STACK TRACE (Top 5)
===================
  at {Function.method} ({file:line:col})
  at {Function.method} ({file:line:col})
  at {Function.method} ({file:line:col})
  at {Function.method} ({file:line:col})
  at {Function.method} ({file:line:col})

CONTEXT
=======
Original log size: {N} lines
Distilled to: {M} lines
Reduction: {percentage}%
Unique errors found: {count}
```

**Multiple Errors Format**:

```
ERROR SUMMARY (3 errors found)
==============================

[1/3] TypeError-undefined-parser:42
TYPE: TypeError
MESSAGE: Cannot read property 'x' of undefined
LOCATION: src/parser.js:42:15
TEST: Parser validation > should handle null input

[2/3] ReferenceError-notDefined-utils:15
TYPE: ReferenceError
MESSAGE: validateUser is not defined
LOCATION: src/utils.js:15:3
TEST: User validation > should validate email format

[3/3] AssertionError-equal-validator:89
TYPE: AssertionError
MESSAGE: Expected 5 to equal 10
LOCATION: src/validator.js:89:5
TEST: Score calculation > should sum correctly

AGGREGATE STATS
===============
Original log size: 5429 lines
Distilled to: 24 lines
Reduction: 99.6%
Unique errors: 3
Most frequent: TypeError-undefined-parser:42 (occurred 5x)
```

### Step 5: Report Results to User

Display summary and offer next steps:

```
✅ Log distilled successfully!

{display formatted summary above}

📊 Efficiency: Reduced from {N} lines to {M} lines ({X}% reduction)

🔍 Next steps:
- Copy error signature for tracking: {ErrorType-KeyTerm-File:Line}
- Investigate location: {file:line}
- Review stack trace for call path

{If used in /fix-bug workflow:}
This summary has been recorded in debugging tracker.
```

## Error Pattern Recognition

### JavaScript/TypeScript
```
Input:
TypeError: Cannot read property 'x' of undefined
    at Parser.parse (src/parser.js:42:15)
    at processData (src/processor.js:128:23)

Output:
TYPE: TypeError
MESSAGE: Cannot read property 'x' of undefined
LOCATION: src/parser.js:42:15
SIGNATURE: TypeError-undefined-parser:42
```

### Test Frameworks (Jest/Mocha)
```
Input:
FAIL tests/parser.test.js
  ● Parser validation › should handle null input
    expect(received).toBe(expected)
    Expected: 5
    Received: undefined
      at Object.<anonymous> (tests/parser.test.js:67:23)

Output:
TYPE: AssertionError
MESSAGE: Expected 5, Received undefined
LOCATION: tests/parser.test.js:67:23
TEST: Parser validation > should handle null input
SIGNATURE: AssertionError-expected-parser.test:67
```

### Build Errors
```
Input:
ERROR in ./src/parser.js
Module not found: Error: Can't resolve '@/utils'
 @ ./src/parser.js 3:0-25
 @ ./src/index.js

Output:
TYPE: ModuleNotFoundError
MESSAGE: Can't resolve '@/utils'
LOCATION: src/parser.js:3:0
SIGNATURE: ModuleNotFoundError-resolve-parser:3
```

## Edge Cases

### No Clear Error Found

```
⚠️ No recognizable error patterns found

Log analyzed: {N} lines

Possible reasons:
- Log contains only warnings or info messages
- Successful output (no errors)
- Error format not recognized

Original log preserved for manual review.
```

### Multiple Instances of Same Error

```
SIGNATURE: TypeError-undefined-parser:42
OCCURRENCES: 5 times across different tests

LOCATIONS:
  - tests/parser.test.js:67 (3 occurrences)
  - tests/validator.test.js:89 (2 occurrences)

Note: Same root cause likely affecting multiple tests.
Focus debugging on src/parser.js:42 (error origin).
```

### Truncated Stack Trace

```
STACK TRACE (Top 2 - incomplete)
=================================
  at Parser.parse (src/parser.js:42:15)
  at processData (src/processor.js:128:23)
  ... (remaining frames truncated in original log)

Note: Full stack trace unavailable. Top frames preserved.
```

## Integration with /fix-bug

When `/fix-bug` invokes this command automatically:

1. **Trigger condition**: Test output >500 lines
2. **Invocation**: Via Task tool to Log Summarization Agent
3. **Input**: Full test output (stdout + stderr)
4. **Output**: Structured summary for tracking
5. **Usage**: Error signature recorded in failure tracking

User can also invoke manually for any verbose logs.

## Quality Checks

Before returning summary, verify:

1. ✅ Error signature is valid format: `{Type}-{Term}-{File}:{Line}`
2. ✅ Location is specific (not "unknown" unless truly unknown)
3. ✅ Message is concise (<100 chars) but complete
4. ✅ Stack trace includes source files (not just node_modules)
5. ✅ Reduction stats are accurate
6. ✅ Multiple errors deduplicated and counted

## Important Notes

- **Lossless extraction**: All critical error info preserved
- **Stable signatures**: Same error → same hash (enables duplicate detection)
- **Context efficiency**: 99%+ reduction for verbose logs
- **Dual mode**: File path OR paste (maximum flexibility)
- **Reusable**: Works standalone OR as sub-task in /fix-bug
- **Agent delegation**: Logs >500 lines processed by specialized agent

## Example Usage

### Standalone File Mode
```bash
/distill-logs test-output.txt

# Output:
✅ Log distilled successfully!

ERROR SUMMARY
=============
TYPE: TypeError
MESSAGE: Cannot read property 'x' of undefined
LOCATION: src/parser.js:42:15
SIGNATURE: TypeError-undefined-parser:42
...
```

### Standalone Paste Mode
```bash
/distill-logs

# Claude prompts for content
# User pastes 2000-line log
# Claude processes and returns summary
```

### Automatic Invocation (within /fix-bug)
```bash
/fix-bug 123

# During execution:
# - Tests run, output is 1500 lines
# - /fix-bug detects length >500
# - Automatically invokes /distill-logs
# - Receives summary for tracking
# - Continues with failure tracking
```
