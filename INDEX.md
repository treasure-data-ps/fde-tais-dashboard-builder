# Custom Dashboard Agent (Lite) — File & Folder Index

Directory of every file under `dashboarding-skills/custom-dashboard-agent-lite/`. Load this when navigating the agent, not during phase execution.

Fully self-contained — no runtime dependency on `../shared/` or the private `fde-dashboard-solutions` template repo.

---

## Entry Points

| File | Purpose |
|------|---------|
| `SKILL.md` | Root entry point — engagement routing, 5-phase overview, phase reference index, rendering note, quick reference |
| `INDEX.md` | This file — full directory of all files and folders |
| `README.md` | Human-readable overview of the agent's purpose and structure |
| `references/guardrails-lite.md` | **LOAD FIRST** — mandatory rules for data integrity, database & queries, rendering, and agent prompts |

---

## Phase Workflow Files

| File | Steps | Key Output | Condition |
|------|-------|-----------|-----------|
| `phase-1/requirements-gathering-guide.md` | Stage A: 1-pre through 1u · Stage B: 2a-2e | Promotion Score (0-6) + `state.md` created | Always |
| `phase-2/deploy-workflow-guide.md` | 3a-3g (7 steps) | SINK tables deployed + validated | Score 4-6 only, optional |
| `phase-3/build-interactive-dashboard-guide.md` | 4a-4l (12 steps) | User-approved interactive `dashboard.html` | Both paths |
| `phase-4/automate-deploy-guide.md` | Track A (4a-0-4a-vi) + Track B (4b-i-4b-vi) | Reusable skill + Foundry agent | Optional |
| `phase-5/handoff-documentation-guide.md` | 5b-pre-5d (4 steps) | 4 local markdown files + share step | Optional |

---

## Phase-Specific References

### phase-1/references/ (merged Requirements + Data Discovery)

| File | What It Contains |
|------|-----------------|
| `steps-1pre.md` | Session-setup questions (project slug, business goal, output confirmation), batch summary tables |
| `Note: Steps referenced in `stage-b-database-discovery.md`.md` | Core requirement steps (1a-1j, 1o), iterative/rollback patterns |
| `steps-1k-1n-optional.md` | Optional steps (1k-1n, 1o-ext) |
| `steps-1p-1t.md` | Scoring questions + combined path decision table |
| `step-1u-finalization.md` | Quality gates, user approval, `state.md` write, end-of-Stage-A checklist |
| `stage-b-database-discovery.md` | Database selection through rendering (fixed — HTML Client, no-op step for numbering continuity) |
| `stage-b-path-routing.md` | Path confirmation, `state.md` append, routing logic to Phase 2 or Phase 3 |
| `validation-queries.md` | SQL templates for metric/dimension validation |
| `exit-checklist.md` | Mandatory exit gate before routing to Phase 2/3 |
| `confirmed-values-checkpoint.md` | Snapshot of confirmed metrics/dimensions/exclusions — referenced by Phases 2-4 |
| `workflow-notes.md` | Extended discovery, conflict resolution |
| `INDEX.md` | Phase 1 references navigation index |

### phase-2/references/ (Workflow deployment, optional)

| File | What It Contains |
|------|-----------------|
| `workflow-setup-configure.md` | Setup, configure params, customize SQL |
| `workflow-deployment-validate.md` | Review, deploy, validate SINK tables |
| `td-time-functions.md` | td_scheduled_time, td_time_string, td_time_range patterns |
| `incremental_update_patterns.md` | Append-only, 1-day, 7-day lookback modes |
| `input_params_examples.md` | input_params.yaml worked examples |
| `testing-troubleshooting.md` | Common failures + resolution (column not found, JOIN explosion, etc.) |
| `pre-deployment-checklist.md` | Mandatory pre-push checklist |
| `INDEX.md` | Phase 2 references navigation index |
| `workflow-templates/` | Locally embedded `.dig` templates (`dashboard-workflow-launch.dig`, `dashboard-workflow-data-prep.dig`, `dashboard-workflow-cleaner.dig`, `input_params.yaml`, `sql/*.sql`) — copy into `./<project-slug>/workflows/` |

### phase-3/references/ (Build Dashboard, HTML Client only)

| File | What It Contains |
|------|-----------------|
| `steps.md` | All steps 4b-pre, 4a-4l in one linear file (includes SINK column gate, generate-data.js for HTML Client) |
| `query-patterns-for-dashboards.md` | Parallel queries, column selection, SINK grain optimization |
| `filter-architecture.md` | 5 filter types and wiring patterns |
| `testing-troubleshooting.md` | Testing checklist, troubleshooting guide, anti-patterns, quality gates |
| `INDEX.md` | Phase 3 references navigation index |

#### phase-3/references/rendering/

| Path | What It Contains |
|------|-----------------|
| `SKILL.md` | HTML Client is the only engine in scope — points straight to `html-client/SKILL.md` |
| `html-client/SKILL.md` | HTML Client engine details — Pattern A (inlined data, single portable file) only |
| `html-client/config-schema.md` | Config schema for HTML Client dashboards |
| `html-client/getting-started.md` | Getting-started walkthrough |
| `html-client/html-dashboard-patterns.md` | Common dashboard patterns |
| `html-client/html-deployment-guide.md` | Deployment guidance |
| `html-client/template-customization.md` | How to customize `generate-data.js` and templates |
| `html-client/templates/` | `kpi-dashboard.html`, `multi-chart-dashboard.html`, `table-dashboard.html`, `generate-data.js`, `render.js`, `README.md` — embedded locally, copied into `./<project-slug>/dashboards/` |

### phase-4/references/ (Automate & Deploy)

| File | What It Contains |
|------|-----------------|
| `INDEX.md` | Phase 4 references navigation index |
| `README.md` | Phase 4 quick navigation |
| `track-a-automation.md` | Skill extraction (4a-0-4a-vi): knowledge package, skill definition, query parameterization, config templates, validation, packaging & sharing |
| `track-b-ai-agent.md` | Agent deployment (4b-i-4b-vi): capability choice, pre-flight checks, knowledge bases, Foundry deploy, validation suite |
| `templates/` | Locally embedded knowledge-base and agent-prompt templates: `knowledge-base-business-context-template.md`, `knowledge-base-data-dictionary-template.md`, `knowledge-base-sql-templates-template.md`, `knowledge-base-metrics-dictionary-template.md`, `agent-prompt-template.md` |

### phase-5/ (Handoff Documentation)

Phase 5 has no `references/` subfolder — `phase-5/handoff-documentation-guide.md` is self-contained. Templates for the 4 markdown files (architecture, usage guide, runbook, access & ownership) are embedded directly in the guide.

---

## Root-Level References

| File | What It Contains |
|------|-----------------|
| `references/guardrails-lite.md` | Data Integrity, Database & Queries, Rendering (HTML-Client-only rules), Requirements (ambiguity resolution), Agent Prompts — trimmed from the internal skill's guardrails, no Git/Confluence sections |

---

## Local Working-Directory Convention

Every phase writes into a single flat project folder created during Phase 1 session setup:

```
./<project-slug>/
├── state.md               (single source of truth, append-only)
├── workflows/              (only if Phase 2 run)
├── dashboards/
│   ├── dashboard.html
│   ├── generate-data.js
│   └── render.js
├── skills/                 (only if Phase 4 Track A run)
├── agents/                  (only if Phase 4 Track B run)
└── docs/                    (only if Phase 5 run)
```

---

**Version:** 1.0.0 (Lite)
**Last Updated:** 15 July 2026
**Author:** FDE Team
