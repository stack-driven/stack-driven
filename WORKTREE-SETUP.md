# Parallel Implementation Worktree Setup

Created: 2026-02-02
Tracking Issue: #173

## Worktree Locations

All worktrees created in `/Users/bru/dev/` for parallel development:

```
/Users/bru/dev/
├── 155-enhance-compliance-plan/              (branch: feature/155-enhance-compliance-plan)
├── 154-integration-constraint-propagation/   (branch: feature/154-integration-constraint-propagation)
├── 152-enhance-ai-integration-strategy/      (branch: feature/152-enhance-ai-integration-strategy)
└── 151-enhance-deployment-plan/              (branch: feature/151-enhance-deployment-plan)
```

## Quick Navigation

```bash
# Issue #155: Compliance Plan Enhancement
cd /Users/bru/dev/155-enhance-compliance-plan

# Issue #154: Integration Constraint Propagation
cd /Users/bru/dev/154-integration-constraint-propagation

# Issue #152: AI Integration Strategy Enhancement
cd /Users/bru/dev/152-enhance-ai-integration-strategy

# Issue #151: Deployment Plan Enhancement
cd /Users/bru/dev/151-enhance-deployment-plan
```

## Worktree Commands

```bash
# List all worktrees
git worktree list

# Remove a worktree (when done)
git worktree remove /Users/bru/dev/155-enhance-compliance-plan

# Prune deleted worktrees
git worktree prune
```

## Development Workflow

### 1. Start Work in Worktree

```bash
# Navigate to worktree
cd /Users/bru/dev/155-enhance-compliance-plan

# Verify you're on correct branch
git branch --show-current
# Should output: feature/155-enhance-compliance-plan

# Make changes...
```

### 2. Commit Work

```bash
# Stage changes
git add .

# Commit with issue reference
git commit -m "feat: [description] (#155)"

# Push to remote
git push -u origin feature/155-enhance-compliance-plan
```

### 3. Sync with Main

```bash
# Fetch latest from main
git fetch origin main

# Rebase on main (keep worktree history clean)
git rebase origin/main

# Force push after rebase (if already pushed)
git push --force-with-lease
```

### 4. Create Pull Request

```bash
# From worktree directory
gh pr create --title "[Issue #155] Enhance /create-compliance-plan" \
  --body "Closes #155" \
  --base main \
  --head feature/155-enhance-compliance-plan
```

## Parallel Development Protocol

### Phase 1: Design Alignment (Days 1-2)

Each worktree should:
1. **Read coordination doc**: `/PARALLEL-IMPLEMENTATION-COORDINATION.md`
2. **Check dependencies**: Review which issues you depend on
3. **Create reference material**: If assigned (see coordination doc)
4. **Post design checkpoint**: Comment on issue #173

### Phase 2: Development (Days 3-12)

Daily workflow per worktree:
1. **Pull latest main**: `git fetch origin main`
2. **Check coordination issue**: Read #173 for updates from other branches
3. **Develop**: Make changes per issue requirements
4. **Daily standup**: Post progress to #173
5. **Commit frequently**: Small, atomic commits with issue references

### Phase 3: Pre-Merge (Days 13-23)

Before creating PR:
1. **Rebase on main**: `git rebase origin/main`
2. **Run cascade test**: Full Session 1-14 validation
3. **Template validation**: Ensure templates match command changes
4. **Cross-branch review**: Check recently merged issues for conflicts
5. **Update #173**: Post "Ready for merge" checkpoint

### Phase 4: Post-Merge Cleanup

After your PR merges:
1. **Notify next issue**: Comment on #173 that main is updated
2. **Keep worktree**: Don't delete yet (other branches may need reference)
3. **After all 4 merged**: Clean up all worktrees

## Issue-Specific Notes

### #155: Compliance Plan Enhancement

**Files modified**:
- `.claude/commands/create-compliance-plan.md`
- `/templates/23-compliance-plan-template.md`

**Merge position**: 2nd (after #154)

**Dependencies**:
- Reads Session 2a (enhanced by #154)
- Creates `/reference-material/cost-estimation-2025.md`

### #154: Integration Constraint Propagation

**Files modified**:
- `.claude/commands/document-constraints.md`
- `.claude/commands/choose-tech-stack.md`
- `.claude/commands/generate-api-design.md`
- `.claude/commands/generate-api-contracts.md`

**Merge position**: 1st (sets pattern for Session 14 integration)

**Dependencies**:
- Creates Session 14 integration pattern (others follow)
- Enhances Session 2a (adds Questions 10a/10b)

### #152: AI Integration Strategy Enhancement

**Files modified**:
- `.claude/commands/define-ai-integration-strategy.md`
- `/templates/02c-ai-integration-strategy-template.md`

**Merge position**: 3rd (independent, benefits from #154 pattern)

**Dependencies**:
- Creates `/reference-material/observability-platform-strategy.md`
- Adopts Session 14 integration pattern from #154

### #151: Deployment Plan Enhancement

**Files modified**:
- `.claude/commands/plan-deployment.md`
- `/templates/13-deployment-plan-template.md`

**Merge position**: 4th (largest scope, benefits from all others)

**Dependencies**:
- Reads observability strategy from #152
- Adopts cost estimation from #155
- Adopts Session 14 integration pattern from #154

## Testing from Worktrees

### Run Cascade Commands

```bash
# From any worktree, test the command you're enhancing
cd /Users/bru/dev/155-enhance-compliance-plan

# Test compliance plan command
claude /create-compliance-plan

# Or use the command directly
./.claude/commands/create-compliance-plan.md
```

### Full Cascade Test

```bash
# Create test product-guidelines directory
mkdir -p product-guidelines

# Run through cascade (Session 1-14)
# Document outputs to ensure your enhancement doesn't break downstream sessions
```

## Cleanup After Completion

```bash
# Once all 4 issues merged and validated
cd /Users/bru/dev/162-epic-167-decompose-model-application

# Remove all parallel worktrees
git worktree remove ../155-enhance-compliance-plan
git worktree remove ../154-integration-constraint-propagation
git worktree remove ../152-enhance-ai-integration-strategy
git worktree remove ../151-enhance-deployment-plan

# Prune worktree references
git worktree prune

# Delete remote branches (after PRs merged)
git push origin --delete feature/155-enhance-compliance-plan
git push origin --delete feature/154-integration-constraint-propagation
git push origin --delete feature/152-enhance-ai-integration-strategy
git push origin --delete feature/151-enhance-deployment-plan

# Delete local branches
git branch -d feature/155-enhance-compliance-plan
git branch -d feature/154-integration-constraint-propagation
git branch -d feature/152-enhance-ai-integration-strategy
git branch -d feature/151-enhance-deployment-plan
```

## Troubleshooting

### "Worktree already exists"
```bash
# List existing worktrees
git worktree list

# Remove old worktree
git worktree remove /Users/bru/dev/155-enhance-compliance-plan

# Recreate
git worktree add ../155-enhance-compliance-plan -b feature/155-enhance-compliance-plan
```

### "Branch already exists"
```bash
# Delete existing branch
git branch -D feature/155-enhance-compliance-plan

# Recreate worktree
git worktree add ../155-enhance-compliance-plan -b feature/155-enhance-compliance-plan
```

### "Merge conflict with main"
```bash
# From worktree
cd /Users/bru/dev/155-enhance-compliance-plan

# Rebase interactively
git rebase -i origin/main

# Resolve conflicts manually
# ... edit conflicting files ...

# Continue rebase
git add .
git rebase --continue

# Force push (since history changed)
git push --force-with-lease
```

### "Need to reference another worktree's code"
```bash
# Worktrees are independent directories - just navigate
cd /Users/bru/dev/154-integration-constraint-propagation
cat .claude/commands/document-constraints.md

# Or diff between worktrees
diff /Users/bru/dev/154-integration-constraint-propagation/.claude/commands/document-constraints.md \
     /Users/bru/dev/155-enhance-compliance-plan/.claude/commands/create-compliance-plan.md
```

## Resources

- **Coordination Doc**: `/PARALLEL-IMPLEMENTATION-COORDINATION.md`
- **Tracking Issue**: https://github.com/stack-driven/stack-driven/issues/173
- **Individual Issues**: #155, #154, #152, #151
- **Git Worktree Docs**: https://git-scm.com/docs/git-worktree

---

**Last Updated**: 2026-02-02
**Setup By**: @bru
**Status**: ✅ All worktrees created and ready for parallel development
