# Phase 1 References Directory (Stage A + Stage B)

This directory contains detailed, reusable patterns for Phase 1: Requirements Gathering (Stage A) & Data Discovery (Stage B).

**Main file:** `../requirements-gathering-guide.md` (the entry point — start here)

---

## Reference Files

### Stage A: Requirements Gathering

| File | Purpose |
|---|---|
| **[steps-1pre.md](steps-1pre.md)** | The 4 mandatory session-setup questions (Setup-A through Setup-D): project slug, business goal, target platform, data source type. Includes full AskUserQuestion templates, batch summary table, and Session Setup quality checklist. Ask ALL before any business requirements. |
| **[steps-1a-1o.md](steps-1a-1o.md)** | Detailed WHAT + AskUserQuestion templates for core requirements steps: database selection, table confirmation, metrics/dimensions confirmation, plus steps 1a–1o. Includes iterative/rollback patterns and Stage A→B continuity examples. |
| **[steps-1k-1n-optional.md](steps-1k-1n-optional.md)** | Optional steps: 1k (mobile), 1l (compliance + data sensitivity), 1m (data complexity + canonical ID + ID Unification status), 1n (drill-down depth), 1o-ext (CDP activation intent — pre-aggregated sources only) |
| **[steps-1p-1t.md](steps-1p-1t.md)** | Promotion scoring (0-6), workflow config (gated by `skip_workflow` flag), agent config, Stage A→B bridging, solution-specific requirements. Includes field capture tables for Steps 1q-1s and Stage A Quality Checklist. Rendering is recorded automatically as HTML Client — no question asked. |
| **[step-1u-finalization.md](step-1u-finalization.md)** | User approval on Stage A requirements, quality gates, `state.md` creation (inline template, no external repo dependency), and comprehensive end-of-Stage-A checklist. **Note:** `state.md` is created here (Step 1u), then appended by Stage B and all subsequent phases. |

### Stage B: Data Discovery & Validation

| File | Purpose |
|---|---|
| **[stage-b-database-discovery.md](stage-b-database-discovery.md)** | Core discovery steps: database selection (2a), table discovery + extended search + time column discovery (2b), metric discovery/inference (2c), dimension discovery/inference (2d), filter scope classification (2d-filter), tab grouping proposal (2d-ext), and rendering confirmation (2e — fixed HTML Client, no-op). |
| **[validation-queries.md](validation-queries.md)** | Reusable SQL patterns: metric/dimension validation, exclusion rule checks, join path validation, freshness checks, large table optimization, and the 12-point Data Quality Gate (Go/No-Go template) run before routing to Phase 2 or Phase 3. |
| **[confirmed-values-checkpoint.md](confirmed-values-checkpoint.md)** | Pattern for writing confirmed metric/dimension values to `state.md` once at the end of Stage B, then referencing them in Phases 2/3/4 instead of re-running identical queries. |
| **[workflow-notes.md](workflow-notes.md)** | Stage B edge cases: resume checklist, large table performance handling, conflict resolution (Stage A vs Stage B findings), stale data detection, exclusion rule handling, join validation, and the Stage B deliverables checklist. |
| **[stage-b-path-routing.md](stage-b-path-routing.md)** | Stage B path confirmation: updates `state.md`, applies the `skip_workflow` routing logic, and confirms with the user whether to proceed to Phase 2 (Workflow) or Phase 3 (Build) directly. |
| **[exit-checklist.md](exit-checklist.md)** | Final Stage B exit checklist — gates that must close before routing to Phase 2 or Phase 3. |

---

## How to Use These Files

### I'm starting a new Phase 1 — where do I start?
→ Open `steps-1pre.md` first — run the 4 session-setup questions (Setup-A through Setup-D) before anything else

### I'm implementing Stage A requirements — where do I go after setup?
→ Open `../requirements-gathering-guide.md` (the main file with quick reference)

### I want to know HOW to ask a particular question
→ AskUserQuestion templates are inline in the relevant step file:
- Session setup questions → `steps-1pre.md`
- DB/table/metrics questions → `steps-1a-1o.md`
- Scoring, workflow, agent questions → `steps-1p-1t.md`
- Discovery/time-column/filter-scope questions → `stage-b-database-discovery.md`
- Batching rule + best practices → `../requirements-gathering-guide.md`

### I need detailed guidance for a specific step
→ Use the navigation below:
- **Setup-A to Setup-D (session setup):** See `steps-1pre.md`
- **Steps 1a-1o (core requirements):** See `steps-1a-1o.md`
- **Steps 1k-1n (optional requirements):** See `steps-1k-1n-optional.md`
- **Steps 1p-1t (scoring & config):** See `steps-1p-1t.md`
- **Step 1u (finalization):** See `step-1u-finalization.md`
- **Steps 2a-2e (core discovery):** See `stage-b-database-discovery.md`
- **Step 2f (routing):** See `stage-b-path-routing.md`
- **Stage B exit gate:** See `exit-checklist.md`

### I want to understand Stage A/B workflow and edge cases
→ See `steps-1a-1o.md` (iterative patterns, contradictions, continuity) and `workflow-notes.md` (Stage B edge cases, conflict resolution)

---

## Quick Navigation by Step

| Step | File |
|---|---|
| **Setup-A. Project slug** | `steps-1pre.md` |
| **Setup-B. Business goal** | `steps-1pre.md` |
| **Setup-C. Target platform** | `steps-1pre.md` |
| **Setup-D. Data source type** | `steps-1pre.md` |
| 1a. Purpose + Business Model + Prior Art + Success Metric | `steps-1a-1o.md` |
| 1b. Metrics + Top Questions + Glossary | `steps-1a-1o.md` |
| 1c. Dimensions + Output Preferences | `steps-1a-1o.md` |
| 1d. Filters | `steps-1a-1o.md` |
| 1e. Date Range + Lookback Window + Timezone | `steps-1a-1o.md` |
| 1f. Data Freshness | `steps-1a-1o.md` |
| 1g. Historical Depth | `steps-1a-1o.md` |
| 1h. Sharing + Access + Target Users + Data Sensitivity | `steps-1a-1o.md` |
| 1i. Export/Download + Downstream Consumers | `steps-1a-1o.md` |
| 1j. Alerts/Thresholds | `steps-1a-1o.md` |
| 1k. Mobile (optional) | `steps-1k-1n-optional.md` |
| 1l. Compliance + Data Sensitivity | `steps-1k-1n-optional.md` |
| 1m. Data Complexity + Canonical ID + IDU Status | `steps-1k-1n-optional.md` |
| 1n. Drill-Down (optional) | `steps-1k-1n-optional.md` |
| 1o-ext. CDP Activation Intent (optional, pre-aggregated sources) | `steps-1k-1n-optional.md` |
| 1o. Exclusion Rules | `steps-1a-1o.md` |
| 1p. Promotion Scoring | `steps-1p-1t.md` |
| 1q. Workflow Config (if score 4-6 AND skip_workflow ≠ true) | `steps-1p-1t.md` |
| 1r. Agent Config (optional) | `steps-1p-1t.md` |
| 1r-post. Rendering (fixed — HTML Client, no question) | `steps-1p-1t.md` |
| 1s. Stage A→B Bridging | `steps-1p-1t.md` |
| 1t. Solution-Specific | `steps-1p-1t.md` |
| 1u. Validation & Finalization | `step-1u-finalization.md` |
| 2a. Database Discovery | `stage-b-database-discovery.md` |
| 2b. Table Discovery + Time Column Discovery | `stage-b-database-discovery.md` |
| 2c. Metric Discovery & Inference | `stage-b-database-discovery.md` |
| 2d. Dimension Discovery & Inference | `stage-b-database-discovery.md` |
| 2d-filter. Filter Scope Classification | `stage-b-database-discovery.md` |
| 2d-ext. Tab Grouping Proposal | `stage-b-database-discovery.md` |
| 2e. Rendering Confirmation (fixed — HTML Client, no-op) | `stage-b-database-discovery.md` |
| 2f. Path Routing Decision | `stage-b-path-routing.md` |
| Stage B Exit Checklist | `exit-checklist.md` |

---

## Key Principles

- **Session setup is always first** — run `steps-1pre.md` before any business requirements; those 4 answers gate everything downstream
- **Rendering is fixed** — HTML Client is the only engine in this lite skill; it's recorded automatically, never asked about
- **Pre-aggregated data skips Phase 2** — `skip_workflow = true` from Setup-D overrides promotion score routing
- **AskUserQuestion is mandatory** — never ask questions as plain text lists; templates are inline in each step file (see `steps-1pre.md`, `steps-1a-1o.md`, `steps-1p-1t.md`, `stage-b-database-discovery.md`)
- **Stage A and Stage B are one continuous phase** — Stage A gathers business requirements; Stage B validates against real data, in the same session (see iterative patterns in `steps-1a-1o.md`)
- **Single session, self-serve** — no engineer confirmation gate, no async customer clarification loop; every open question is resolved directly with the user in-session
- **state.md is the single source of truth** — created in Step 1u, appended by Stage B and every subsequent phase; no Confluence, no git commits

---

**Version:** 1.0.0 (Lite)
**Last Updated:** 15 July 2026
**Author:** FDE Team
