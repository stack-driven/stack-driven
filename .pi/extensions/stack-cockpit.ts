import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as fs from "node:fs";
import * as path from "node:path";

type RequiredMode = "required" | "recommended" | "conditional" | "optional" | "support" | string;
type Lifecycle = "active" | "deferred" | "skipped" | "superseded" | "deprecated" | string;

type Spec = {
	id: string;
	title: string;
	session: string;
	command: string;
	group: string;
	kind: string;
	requiredMode: RequiredMode;
	lifecycle: Lifecycle;
	requiredDeps: string[];
	outputPaths: string[];
};

type CockpitState = {
	root: string | null;
	manifestPath: string | null;
	specs: Spec[];
	completed: Spec[];
	skippedOrDeferred: Spec[];
	available: Spec[];
	blocked: Spec[];
	next: Spec | null;
};

type UiContext = {
	cwd?: string;
	hasUI?: boolean;
	ui?: {
		notify?(message: string, level?: "info" | "warning" | "error"): void;
		setWidget?(id: string, widget: string[] | undefined, options?: { placement?: "aboveEditor" | "belowEditor" }): void;
	};
};

const WIDGET_ID = "stack-driven-cockpit";
const MANIFEST_RELATIVE_PATH = path.join("specs", "manifest.yaml");

function cleanScalar(value: string): string {
	const trimmed = value.trim();
	if (trimmed === "null") return "";
	if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}

function findProjectRoot(startDir: string): string | null {
	let current = path.resolve(startDir || process.cwd());

	while (true) {
		if (fs.existsSync(path.join(current, MANIFEST_RELATIVE_PATH))) {
			return current;
		}

		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}

function parseManifest(manifestPath: string): Spec[] {
	const specs: Spec[] = [];
	const lines = fs.readFileSync(manifestPath, "utf8").split(/\r?\n/);
	let current: Spec | null = null;
	let listScope: "requiredDeps" | "outputPaths" | null = null;

	for (const line of lines) {
		const idMatch = line.match(/^  - id:\s*(.+)$/);
		if (idMatch) {
			current = {
				id: cleanScalar(idMatch[1]),
				title: "",
				session: "",
				command: "",
				group: "",
				kind: "",
				requiredMode: "",
				lifecycle: "",
				requiredDeps: [],
				outputPaths: [],
			};
			specs.push(current);
			listScope = null;
			continue;
		}

		if (!current) continue;

		const scalarMatch = line.match(/^    ([a-z_]+):\s*(.*)$/);
		if (scalarMatch) {
			listScope = null;
			const [, key, rawValue] = scalarMatch;
			const value = cleanScalar(rawValue);

			switch (key) {
				case "title":
					current.title = value;
					break;
				case "session":
					current.session = value;
					break;
				case "command":
					current.command = value;
					break;
				case "group":
					current.group = value;
					break;
				case "kind":
					current.kind = value;
					break;
				case "required_mode":
					current.requiredMode = value;
					break;
				case "lifecycle":
					current.lifecycle = value;
					break;
			}
			continue;
		}

		if (line.match(/^      required:\s*$/)) {
			listScope = "requiredDeps";
			continue;
		}

		if (line.match(/^      optional:\s*$/) || line.match(/^    outputs:\s*$/) || line.match(/^    relevance:\s*$/) || line.match(/^    skip_policy:\s*$/)) {
			listScope = null;
			continue;
		}

		if (line.match(/^      paths:\s*$/)) {
			listScope = "outputPaths";
			continue;
		}

		if (line.match(/^      ctx_paths:\s*$/)) {
			listScope = null;
			continue;
		}

		const listItemMatch = line.match(/^        -\s*(.+)$/);
		if (listItemMatch && listScope === "requiredDeps") {
			current.requiredDeps.push(cleanScalar(listItemMatch[1]));
			continue;
		}

		if (listItemMatch && listScope === "outputPaths") {
			current.outputPaths.push(cleanScalar(listItemMatch[1]));
		}
	}

	return specs.filter((spec) => spec.id.length > 0);
}

function outputExists(root: string, spec: Spec): boolean {
	return spec.outputPaths.some((outputPath) => fs.existsSync(path.join(root, outputPath)));
}

function isSkippedOrDeferred(spec: Spec): boolean {
	return spec.lifecycle === "skipped" || spec.lifecycle === "deferred";
}

function isDone(root: string, spec: Spec): boolean {
	return outputExists(root, spec) || spec.lifecycle === "superseded" || spec.lifecycle === "deprecated";
}

function summarize(root: string | null): CockpitState {
	if (!root) {
		return {
			root: null,
			manifestPath: null,
			specs: [],
			completed: [],
			skippedOrDeferred: [],
			available: [],
			blocked: [],
			next: null,
		};
	}

	const manifestPath = path.join(root, MANIFEST_RELATIVE_PATH);
	const specs = parseManifest(manifestPath);
	const completed = specs.filter((spec) => isDone(root, spec));
	const skippedOrDeferred = specs.filter(isSkippedOrDeferred);
	const satisfied = new Set([...completed, ...skippedOrDeferred].map((spec) => spec.id));
	const pending = specs.filter((spec) => spec.lifecycle === "active" && !satisfied.has(spec.id));
	const available = pending.filter((spec) => spec.requiredDeps.every((dep) => satisfied.has(dep)));
	const blocked = pending.filter((spec) => spec.requiredDeps.some((dep) => !satisfied.has(dep)));

	return {
		root,
		manifestPath,
		specs,
		completed,
		skippedOrDeferred,
		available,
		blocked,
		next: available[0] ?? null,
	};
}

function formatSpec(spec: Spec | null): string {
	if (!spec) return "none";
	const session = spec.session ? `Session ${spec.session}` : "Session ?";
	const command = spec.command ? ` (${spec.command})` : "";
	return `${spec.id} - ${session}: ${spec.title}${command}`;
}

function visibleSlice(items: Spec[], count = 3): string {
	if (items.length === 0) return "none";
	const ids = items.slice(0, count).map((spec) => spec.id).join(", ");
	const remaining = items.length - count;
	return remaining > 0 ? `${ids}, +${remaining} more` : ids;
}

function cockpitLines(state: CockpitState): string[] {
	if (!state.root) {
		return [
			"Stack-Driven cockpit",
			"No specs/manifest.yaml found for this workspace.",
			"Setup: add the Stack-Driven spec manifest, then run /stack.",
		];
	}

	const trackedSpecs = state.specs.filter((spec) => spec.requiredMode !== "support");
	const completedTracked = state.completed.filter((spec) => spec.requiredMode !== "support");
	const skippedTracked = state.skippedOrDeferred.filter((spec) => spec.requiredMode !== "support");
	const blockedTracked = state.blocked.filter((spec) => spec.requiredMode !== "support");
	const phase = state.next ? `Session ${state.next.session}: ${state.next.title}` : "Complete";
	const suggestedAction = state.next?.command || "/stack:status";

	return [
		"Stack-Driven cockpit",
		`Phase: ${phase}`,
		`Completed specs: ${completedTracked.length}/${trackedSpecs.length}`,
		`Skipped/deferred: ${skippedTracked.length} (${visibleSlice(skippedTracked)})`,
		`Next available: ${formatSpec(state.next)}`,
		`Blocked specs: ${blockedTracked.length} (${visibleSlice(blockedTracked)})`,
		`Suggested action: ${suggestedAction}`,
	];
}

function currentState(ctx: { cwd?: string }): CockpitState {
	const root = findProjectRoot(ctx.cwd || process.cwd());
	return summarize(root);
}

function showCockpit(ctx: UiContext = {}): CockpitState {
	const state = currentState(ctx);
	const lines = cockpitLines(state);

	if (ctx.hasUI === false || !ctx.ui?.setWidget) {
		console.log(lines.join("\n"));
		return state;
	}

	ctx.ui.setWidget(WIDGET_ID, lines, { placement: "aboveEditor" });
	return state;
}

function notify(ctx: UiContext = {}, message: string, level: "info" | "warning" | "error" = "info"): void {
	if (ctx.hasUI === false || !ctx.ui?.notify) {
		console.log(message);
		return;
	}
	ctx.ui.notify(message, level);
}

function inputText(args: unknown): string {
	return typeof args === "string" ? args.trim() : "";
}

function findSpec(state: CockpitState, id: string): Spec | undefined {
	return state.specs.find((spec) => spec.id === id || spec.command === id || spec.command === `/${id}`);
}

function registerStatusCommands(pi: ExtensionAPI): void {
	const show = async (_args: unknown, ctx: UiContext) => {
		const state = showCockpit(ctx);
		notify(ctx, state.root ? "Stack cockpit refreshed." : "No Stack-Driven manifest found.", state.root ? "info" : "warning");
	};

	pi.registerCommand("stack", {
		description: "Show the Stack-Driven cockpit",
		handler: show,
	});

	pi.registerCommand("stack:status", {
		description: "Refresh Stack-Driven spec status",
		handler: show,
	});

	pi.registerCommand("stack:next", {
		description: "Show the next available Stack-Driven spec action",
		handler: async (_args, ctx: UiContext) => {
			const state = showCockpit(ctx);
			if (!state.root) {
				notify(ctx, "No manifest found. Add specs/manifest.yaml, then run /stack.", "warning");
				return;
			}
			notify(ctx, state.next ? `Next: ${formatSpec(state.next)}` : "All active specs are complete or blocked.");
		},
	});
}

function registerActionCommands(pi: ExtensionAPI): void {
	pi.registerCommand("stack:create", {
		description: "Ask the agent to create or update the next/specified Stack-Driven spec",
		handler: async (args, ctx: UiContext) => {
			const state = showCockpit(ctx);
			const requested = inputText(args);
			const target = requested ? findSpec(state, requested) : state.next;

			if (!state.root) {
				pi.sendUserMessage("Initialize this repository with the Stack-Driven spec authority manifest and human-readable spec index.");
				return;
			}

			if (!target) {
				notify(ctx, requested ? `Unknown spec: ${requested}` : "No available spec to create.", "warning");
				return;
			}

			pi.sendUserMessage(`Create or update Stack-Driven spec ${target.id} (${target.title}). Use ${target.command || "the appropriate cascade command"} and preserve journey traceability.`);
		},
	});

	pi.registerCommand("stack:skip", {
		description: "Ask the agent to record a skip/defer decision for a spec",
		handler: async (args, ctx: UiContext) => {
			const state = showCockpit(ctx);
			const [rawId, ...reasonParts] = inputText(args).split(/\s+/);
			if (!state.root) {
				notify(ctx, "No manifest found. Nothing to skip.", "warning");
				return;
			}
			if (!rawId) {
				notify(ctx, "Usage: /stack:skip <spec-id> <reason>", "warning");
				return;
			}

			const target = findSpec(state, rawId);
			if (!target) {
				notify(ctx, `Unknown spec: ${rawId}`, "warning");
				return;
			}

			const reason = reasonParts.join(" ").trim();
			if (!reason) {
				notify(ctx, "Skipping requires a reason so future agents know why this spec is deferred. Usage: /stack:skip <spec-id> <reason>", "warning");
				return;
			}
			pi.sendUserMessage(`Record a Stack-Driven skip/defer decision for ${target.id} (${target.title}). Reason: ${reason}. Update only the appropriate delivery/spec authority record and include revisit guidance.`);
		},
	});

	pi.registerCommand("stack:plan-issue", {
		description: "Ask the agent to plan a GitHub issue using Stack-Driven spec authority",
		handler: async (args, ctx: UiContext) => {
			showCockpit(ctx);
			const issue = inputText(args);
			if (!issue) {
				notify(ctx, "Usage: /stack:plan-issue <issue-number>", "warning");
				return;
			}
			pi.sendUserMessage(`Plan GitHub issue #${issue} using the Stack-Driven spec authority model. Load only the relevant manifest/index metadata and required spec context before proposing implementation steps.`);
		},
	});
}

export default function stackCockpit(pi: ExtensionAPI) {
	pi.on("session_start", (_event, ctx: UiContext) => {
		showCockpit(ctx);
	});

	registerStatusCommands(pi);
	registerActionCommands(pi);
}
