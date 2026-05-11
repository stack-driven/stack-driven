import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as fs from "node:fs";
import * as path from "node:path";

type RequiredMode = "required" | "recommended" | "conditional" | "optional" | "support" | string;
type Lifecycle = "active" | "deferred" | "skipped" | "superseded" | "deprecated" | string;
type ReviewStatus = "ai_drafted" | "human_reviewed" | "authoritative" | string;
type ProductRunStatus = "created" | "reviewed" | "authoritative" | "skipped" | "deferred" | string;

type Spec = {
	id: string;
	title: string;
	session: string;
	command: string;
	group: string;
	kind: string;
	requiredMode: RequiredMode;
	lifecycle: Lifecycle;
	defaultReviewStatus: ReviewStatus;
	requiredDeps: string[];
	outputPaths: string[];
	ctxPaths: string[];
	templatePaths: string[];
};

type ProductSpecState = {
	status?: ProductRunStatus;
	reviewStatus?: ReviewStatus;
	skipReason?: string;
	revisitWhen?: string;
	revisitOwner?: string;
	updatedAt?: string;
};

type CockpitState = {
	root: string | null;
	manifestPath: string | null;
	productStatusPath: string | null;
	productStates: Record<string, ProductSpecState>;
	specs: Spec[];
	completed: Spec[];
	skippedOrDeferred: Spec[];
	reviewNeeded: Spec[];
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
const PRODUCT_STATUS_RELATIVE_PATH = path.join("product-guidelines", "spec-status.yaml");

function cleanScalar(value: string): string {
	const trimmed = value.trim();
	if (trimmed === "null") return "";
	if (trimmed === "[]") return "";
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
	let blockScope: "dependencies" | "outputs" | "templates" | null = null;
	let listScope: "requiredDeps" | "outputPaths" | "ctxPaths" | "templatePaths" | null = null;

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
				defaultReviewStatus: "",
				requiredDeps: [],
				outputPaths: [],
				ctxPaths: [],
				templatePaths: [],
			};
			specs.push(current);
			blockScope = null;
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
				case "dependencies":
					blockScope = "dependencies";
					break;
				case "outputs":
					blockScope = "outputs";
					break;
				case "templates":
					blockScope = "templates";
					break;
				case "title":
					blockScope = null;
					current.title = value;
					break;
				case "session":
					blockScope = null;
					current.session = value;
					break;
				case "command":
					blockScope = null;
					current.command = value;
					break;
				case "group":
					blockScope = null;
					current.group = value;
					break;
				case "kind":
					blockScope = null;
					current.kind = value;
					break;
				case "required_mode":
					blockScope = null;
					current.requiredMode = value;
					break;
				case "lifecycle":
					blockScope = null;
					current.lifecycle = value;
					break;
				case "default_review_status":
					blockScope = null;
					current.defaultReviewStatus = value;
					break;
				default:
					blockScope = null;
			}
			continue;
		}

		if (line.match(/^      required:\s*$/) && blockScope === "dependencies") {
			listScope = "requiredDeps";
			continue;
		}

		if (line.match(/^      optional:\s*$/) && blockScope === "dependencies") {
			listScope = null;
			continue;
		}

		if (line.match(/^      paths:\s*$/)) {
			if (blockScope === "outputs") listScope = "outputPaths";
			else if (blockScope === "templates") listScope = "templatePaths";
			else listScope = null;
			continue;
		}

		if (line.match(/^      ctx_paths:\s*$/) && blockScope === "outputs") {
			listScope = "ctxPaths";
			continue;
		}

		if (line.match(/^      (role|notes):/)) {
			listScope = null;
			continue;
		}

		const listItemMatch = line.match(/^        -\s*(.+)$/);
		if (!listItemMatch) continue;

		const item = cleanScalar(listItemMatch[1]);
		if (listScope === "requiredDeps") current.requiredDeps.push(item);
		if (listScope === "outputPaths") current.outputPaths.push(item);
		if (listScope === "ctxPaths") current.ctxPaths.push(item);
		if (listScope === "templatePaths") current.templatePaths.push(item);
	}

	return specs.filter((spec) => spec.id.length > 0);
}

function parseProductStates(statusPath: string): Record<string, ProductSpecState> {
	const states: Record<string, ProductSpecState> = {};
	if (!fs.existsSync(statusPath)) return states;

	const lines = fs.readFileSync(statusPath, "utf8").split(/\r?\n/);
	let inSpecs = false;
	let currentId: string | null = null;

	for (const line of lines) {
		if (line.match(/^specs:\s*$/)) {
			inSpecs = true;
			currentId = null;
			continue;
		}

		if (!inSpecs) continue;

		const specMatch = line.match(/^  ([A-Za-z0-9_.-]+):\s*$/);
		const matchedSpecId = specMatch?.[1];
		if (matchedSpecId) {
			currentId = matchedSpecId;
			states[matchedSpecId] = {};
			continue;
		}

		if (!currentId) continue;

		const valueMatch = line.match(/^    ([a-z_]+):\s*(.*)$/);
		if (!valueMatch) continue;

		const currentState = states[currentId];
		if (!currentState) continue;

		const [, key, rawValue] = valueMatch;
		const value = cleanScalar(rawValue);
		switch (key) {
			case "status":
				currentState.status = value;
				break;
			case "review_status":
				currentState.reviewStatus = value;
				break;
			case "skip_reason":
				currentState.skipReason = value;
				break;
			case "revisit_when":
				currentState.revisitWhen = value;
				break;
			case "revisit_owner":
				currentState.revisitOwner = value;
				break;
			case "updated_at":
				currentState.updatedAt = value;
				break;
		}
	}

	return states;
}

function outputExists(root: string, spec: Spec): boolean {
	return spec.outputPaths.some((outputPath) => fs.existsSync(path.join(root, outputPath)));
}

function stateFor(states: Record<string, ProductSpecState>, spec: Spec): ProductSpecState | undefined {
	return states[spec.id];
}

function isCreatedStatus(status: string | undefined): boolean {
	return status === "created" || status === "reviewed" || status === "authoritative";
}

function isSkippedOrDeferred(spec: Spec, state?: ProductSpecState): boolean {
	return state?.status === "skipped" || state?.status === "deferred" || spec.lifecycle === "skipped" || spec.lifecycle === "deferred";
}

function isDone(root: string, spec: Spec, state?: ProductSpecState): boolean {
	return outputExists(root, spec) || isCreatedStatus(state?.status) || spec.lifecycle === "superseded" || spec.lifecycle === "deprecated";
}

function requiresReview(root: string, spec: Spec, state?: ProductSpecState): boolean {
	if (isSkippedOrDeferred(spec, state) || !isDone(root, spec, state)) return false;
	if (state?.reviewStatus === "human_reviewed" || state?.reviewStatus === "authoritative") return false;
	return state?.reviewStatus === "ai_drafted" || state?.status === "created" || (outputExists(root, spec) && spec.defaultReviewStatus === "ai_drafted");
}

function summarize(root: string | null): CockpitState {
	if (!root) {
		return {
			root: null,
			manifestPath: null,
			productStatusPath: null,
			productStates: {},
			specs: [],
			completed: [],
			skippedOrDeferred: [],
			reviewNeeded: [],
			available: [],
			blocked: [],
			next: null,
		};
	}

	const manifestPath = path.join(root, MANIFEST_RELATIVE_PATH);
	const productStatusPath = path.join(root, PRODUCT_STATUS_RELATIVE_PATH);
	const specs = parseManifest(manifestPath);
	const productStates = parseProductStates(productStatusPath);
	const completed = specs.filter((spec) => isDone(root, spec, stateFor(productStates, spec)));
	const skippedOrDeferred = specs.filter((spec) => isSkippedOrDeferred(spec, stateFor(productStates, spec)));
	const reviewNeeded = specs.filter((spec) => requiresReview(root, spec, stateFor(productStates, spec)));
	const satisfied = new Set([...completed, ...skippedOrDeferred].map((spec) => spec.id));
	const pending = specs.filter((spec) => spec.lifecycle === "active" && !satisfied.has(spec.id));
	const available = pending.filter((spec) => spec.requiredDeps.every((dep) => satisfied.has(dep)));
	const blocked = pending.filter((spec) => spec.requiredDeps.some((dep) => !satisfied.has(dep)));

	return {
		root,
		manifestPath,
		productStatusPath,
		productStates,
		specs,
		completed,
		skippedOrDeferred,
		reviewNeeded,
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

function skippedDetails(items: Spec[], states: Record<string, ProductSpecState>, count = 2): string {
	if (items.length === 0) return "none";
	const details = items.slice(0, count).map((spec) => {
		const runState = states[spec.id];
		const reason = runState?.skipReason ? `reason: ${runState.skipReason}` : "reason not recorded";
		const revisit = runState?.revisitWhen ? `revisit: ${runState.revisitWhen}` : "revisit not recorded";
		return `${spec.id} (${reason}; ${revisit})`;
	});
	const remaining = items.length - count;
	return remaining > 0 ? `${details.join(" | ")} | +${remaining} more` : details.join(" | ");
}

function blockedDetails(items: Spec[], satisfiedIds: Set<string>, count = 2): string {
	if (items.length === 0) return "none";
	const details = items.slice(0, count).map((spec) => {
		const missing = spec.requiredDeps.filter((dep) => !satisfiedIds.has(dep));
		return `${spec.id} missing ${missing.join(", ") || "unknown"}`;
	});
	const remaining = items.length - count;
	return remaining > 0 ? `${details.join(" | ")} | +${remaining} more` : details.join(" | ");
}

function cockpitLines(state: CockpitState): string[] {
	if (!state.root) {
		return [
			"Stack-Driven cockpit",
			"No specs/manifest.yaml found for this workspace.",
			"Setup: add the Stack-Driven spec manifest, then run /stack-start.",
		];
	}

	const trackedSpecs = state.specs.filter((spec) => spec.requiredMode !== "support");
	const completedTracked = state.completed.filter((spec) => spec.requiredMode !== "support");
	const skippedTracked = state.skippedOrDeferred.filter((spec) => spec.requiredMode !== "support");
	const blockedTracked = state.blocked.filter((spec) => spec.requiredMode !== "support");
	const reviewTracked = state.reviewNeeded.filter((spec) => spec.requiredMode !== "support");
	const satisfiedIds = new Set([...state.completed, ...state.skippedOrDeferred].map((spec) => spec.id));
	const phase = state.next ? `Session ${state.next.session}: ${state.next.title}` : "Complete";
	const suggestedAction = state.next ? `/stack-create-spec ${state.next.id}` : "/stack-status";
	const statusFile = state.productStatusPath && fs.existsSync(state.productStatusPath) ? "present" : "not created";

	return [
		"Stack-Driven cockpit",
		`Phase: ${phase}`,
		`Completed specs: ${completedTracked.length}/${trackedSpecs.length}`,
		`Skipped/deferred: ${skippedTracked.length} (${visibleSlice(skippedTracked)})`,
		`Skipped details: ${skippedDetails(skippedTracked, state.productStates)}`,
		`Review needed: ${reviewTracked.length} (${visibleSlice(reviewTracked)})`,
		`Next available: ${formatSpec(state.next)}`,
		`Blocked specs: ${blockedTracked.length} (${visibleSlice(blockedTracked)})`,
		`Blocked details: ${blockedDetails(blockedTracked, satisfiedIds)}`,
		`Product status: ${statusFile} (${PRODUCT_STATUS_RELATIVE_PATH})`,
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
		handler: async (_args: unknown, ctx: UiContext) => {
			const state = showCockpit(ctx);
			if (!state.root) {
				notify(ctx, "No manifest found. Add specs/manifest.yaml, then run /stack-start.", "warning");
				return;
			}
			notify(ctx, state.next ? `Next: ${formatSpec(state.next)}. Run /stack-create-spec ${state.next.id}.` : "All active specs are complete or blocked.");
		},
	});
}

function registerActionCommands(pi: ExtensionAPI): void {
	pi.registerCommand("stack:start", {
		description: "Ask the agent to start or resume guided Stack-Driven spec creation",
		handler: async (args: unknown, ctx: UiContext) => {
			showCockpit(ctx);
			const instructions = inputText(args);
			pi.sendUserMessage(`Start or resume the Stack-Driven guided spec workflow. Use the spec-authority and guided-spec-creation skills. User input: ${instructions || "none"}`);
		},
	});

	pi.registerCommand("stack:create", {
		description: "Ask the agent to create or update the next/specified Stack-Driven spec",
		handler: async (args: unknown, ctx: UiContext) => {
			const state = showCockpit(ctx);
			const requested = inputText(args);
			const target = requested ? findSpec(state, requested) : state.next;

			if (!state.root) {
				pi.sendUserMessage("Initialize this repository with the Stack-Driven spec authority manifest and human-readable spec index, then start the guided spec workflow.");
				return;
			}

			if (!target) {
				notify(ctx, requested ? `Unknown spec: ${requested}` : "No available spec to create.", "warning");
				return;
			}

			pi.sendUserMessage(`Use the guided-spec-creation skill to create or update Stack-Driven spec ${target.id} (${target.title}). Resolve dependencies with spec-authority, load only relevant context, write configured outputs and .ctx.md summaries, and mark AI drafts as requiring review in ${PRODUCT_STATUS_RELATIVE_PATH}.`);
		},
	});

	pi.registerCommand("stack:skip", {
		description: "Ask the agent to record a skip/defer decision for a spec",
		handler: async (args: unknown, ctx: UiContext) => {
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
			pi.sendUserMessage(`Use the guided-spec-creation skill to record a Stack-Driven skip/defer decision for ${target.id} (${target.title}). Reason: ${reason}. Enforce the manifest skip_policy, do not skip required specs, and write the product-run state to ${PRODUCT_STATUS_RELATIVE_PATH} with revisit guidance.`);
		},
	});

	pi.registerCommand("stack:plan-issue", {
		description: "Ask the agent to plan a GitHub issue using Stack-Driven spec authority",
		handler: async (args: unknown, ctx: UiContext) => {
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
	pi.on("session_start", (_event: unknown, ctx: UiContext) => {
		showCockpit(ctx);
	});

	registerStatusCommands(pi);
	registerActionCommands(pi);
}
