# Migration Note: `specs/` and `product-guidelines/`

## What changed

Stack-Driven now has a committed spec authority layer in `specs/`:

- `specs/manifest.yaml` defines the canonical list of framework specs and sessions.
- `specs/index.md` gives humans a readable overview and dependency graph.
- `specs/README.md` documents schema, lifecycle, review, skip/defer, conflict, and loading rules.

This does not migrate or rewrite existing cascade commands. It adds the authority model that future prompts, skills, and UI can read.

## What stays the same

`product-guidelines/` remains the generated, per-product output directory. It is still gitignored because each user generates different journey, strategy, architecture, backlog, and implementation artifacts.

The cascade still writes files such as:

- `product-guidelines/00-user-journey.md`
- `product-guidelines/02-tech-stack.md`
- `product-guidelines/07-database-schema.md`
- `product-guidelines/10-backlog/`

## How authority is interpreted

The manifest is the repository-level registry of expected artifacts. A generated file under `product-guidelines/` is a concrete product-specific artifact.

Generated artifacts default to `ai_drafted`. They become `human_reviewed` or `authoritative` only after an explicit review/checkpoint records that status. This prevents AI-drafted specs from being mistaken for human-reviewed decisions.

## `.ctx.md` files

`.ctx.md` files remain context-optimized loading artifacts. They help agents load less text while preserving key decisions. They are not separate sources of authority.

If a full `.md` file and its `.ctx.md` file disagree, prefer the full `.md` and regenerate or correct the context file.

## Optional and skipped specs

Optional and conditional specs are now explicit in the manifest. If a product skips one, the product run should record:

- the skip reason,
- when to revisit,
- and who owns the revisit when applicable.

Missing required outputs still mean the cascade is incomplete, not skipped.

## Future migration path

Future issues can build on this model by:

1. Teaching commands to read `specs/manifest.yaml` instead of hard-coded session lists.
2. Recording product-specific review status and skip decisions next to generated outputs.
3. Adding validation that checks generated files against manifest dependencies.
4. Adding UI or prompts that use relevance/loading hints to load only the needed specs.

Those changes are intentionally outside issue #218.
