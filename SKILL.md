---
name: fde-custom-dashboard-agent-lite
description: Build or resume custom dashboards from Treasure Data databases using a self-serve 5-phase pipeline (requirements + data discovery, workflow deployment, interactive build, automation, handoff). Lite version — no Confluence, no git branching, HTML Client rendering only. Use for one-off or scheduled custom dashboards. Also use when continuing a previously started dashboard engagement -- e.g. after reviewing a plan or approving a build. Trigger on: custom dashboard, build dashboard, analytics dashboard, data dashboard, KPI dashboard, metrics dashboard, dashboard agent, visualization, custom reporting, create dashboard, interactive dashboard, resume dashboard, continue dashboard, resume dashboard engagement, approved dashboard plan, proceed to phase 2/3/4/5, resume phase 1/2/3/4.
---

# Custom Dashboard Agent (Lite)

> **GUARDRAILS: Read `./references/guardrails-lite.md` before doing anything else in this session.**

Build custom dashboards from Treasure Data databases using a **self-serve 5-phase pipeline**. Rendering is always **HTML Client** — a single portable `dashboard.html` file with data inlined at build time. No Confluence, no git branching — everything lives in one local project folder.

---

## How to Start

### Step 0: Engagement Type

**INSTRUCTION FOR CLAUDE:** Use the question below to route the engagement. **Wait for the user's response before proceeding to any phase.**

**Ask the user:** "Is this a new dashboard engagement, or are you resuming an existing one?"

- **Option A: New engagement** → Continue to "New Engagement Path" section below
- **Option B: Resuming existing** → Continue to "Existing Engagement Path" section below

---

#### New Engagement Path

Once you confirm this is a **new engagement**, follow these 2 steps:

1. **Say to the user:** "For this project, here are the 5 phases we'll work through step by step."

2. **Display the 5-phase overview:**
   ```
   📊 Custom Dashboard Agent (Lite) — Project Phases

   ✅ Phase 1: Requirements + Data Discovery
      → Stage A: Understand KPIs, dimensions, filters, audience, success metrics
      → Stage B: Validate tables/columns exist in your database, recommend metrics/dimensions
      → Output: Promotion Score (0-6) + path decision (Workflow or Non-Workflow) + state.md created

   ✅ Phase 2: Deploy Dashboard Workflow  [Optional, recommended for Score 4-6]
      → Deploy a scheduled workflow, pre-aggregate metrics into SINK tables
      → Output: Pre-aggregated tables ready for Phase 3

   🎨 Phase 3: Build Interactive Dashboard
      → Query SINK tables (or source tables directly) → render a single dashboard.html
      → Test filters, performance, data accuracy
      → Output: Approved interactive dashboard

   🤖 Phase 4: Automate & Deploy  [Optional]
      → Track A: Extract a reusable skill for faster future builds
      → Track B: Deploy a companion Foundry agent for natural-language access

   📚 Phase 5: Handoff Documentation  [Optional]
      → Create Architecture, Usage Guide, Runbook, Access markdown files locally
   ```

3. **Route to Phase 1:** Read `./phase-1/SKILL.md` — it handles session setup (project slug, business goal, scoring, path decision) for both Stage A (requirements) and Stage B (data discovery). After Phase 1 completes, **route to Phase 2 or Phase 3 per the path decision** (no additional prompt needed).

#### Existing Engagement Path

Once you confirm this is **resuming an existing project**, follow these 3 steps:

1. **Ask for the project slug:**
   - "What's the project slug or folder name you're resuming? (e.g. `./<project-slug>/`)"

2. **Locate the project state:**
   - Ask the user to paste the contents of `./<project-slug>/state.md` — then read it directly to recover project state
   - Display the project state so the user sees:
     ```
     🔄 Resuming: travel-dashboard

     ✅ Completed Phases:
        • Phase 1 (Requirements + Data Discovery): Score 6/6 — Workflow path

     ⏳ Next Actions:
        • Phase 2: Deploy Workflow (SINK database: test_suraj)
        • Then Phase 3: Build Dashboard

     📌 Key Details:
        • Schedule: Weekly
        • Audience: Multiple (executives + analysts)
     ```

3. **Route to the next incomplete phase based on project state:**
   - For example, if Phase 1 is complete and Phase 2 is next → use `./phase-2/SKILL.md`
   - `state.md` clearly indicates which phase to start with (append-only log of every phase's outputs)

---

## Phase Reference Index

| Phase | Read | Key Output | Condition |
|-------|------|-----------|-----------|
| **1: Requirements + Data Discovery** | `./phase-1/requirements-gathering-guide.md` | Promotion Score (0-6) + path decision + **state.md created** | Always |
| **2: Workflow** | `./phase-2/deploy-workflow-guide.md` | Workflow output tables (SINK tables) deployed + validated + **state.md appended** | Optional, recommended Score 4-6 only, user can override |
| **3: Build Dashboard** | `./phase-3/build-interactive-dashboard-guide.md` | User-approved interactive `dashboard.html` + **state.md appended** | Always (after Phase 1 or Phase 2) |
| **4: Automate + Agent** | `./phase-4/automate-deploy-guide.md` | Reusable skill (Track A) + Foundry agent (Track B) | Optional, either/both/neither |
| **5: Handoff Docs** | `./phase-5/handoff-documentation-guide.md` | 4 local markdown files (Architecture, Usage Guide, Runbook, Access & Ownership) | Optional |

**Path decision at end of Phase 1, Stage B:** (user can override the recommendation)
- **Score 0-2 (Non-Workflow):** Phase 1 → Phase 3 — skip Phase 2
- **Score 3 (Optional):** User chooses between Phase 2 (workflow) or Phase 3 (direct build)
- **Score 4-6 (Workflow):** Phase 2 first, then Phase 3

---

## Phase Routing

**Quick routing rules:**
- New engagement → Phase 1 → [Phase 2 if score 4-6] → Phase 3 → [Phase 4 optional] → [Phase 5 optional]
- Resume → read `state.md` → jump to "Next Action"
- Score 3 at end of Phase 1 → ask user: "Quick build or production workflow?"

Five linear phases is small enough to route inline — no separate decision-tree file to load.

---

## Rendering

Rendering is always **HTML Client** — a single portable `dashboard.html` with data inlined at build time. No engine-choice question is ever asked. This works anywhere (no server, no special platform) and is the only rendering pattern supported in the lite skill.

---

## Workflow Creation (Phase 2)

**What is a workflow?** A scheduled job that pre-aggregates metrics into SINK tables once per day, making Phase 3 dashboard queries instant instead of scanning and querying big live/source data.

**When to create a workflow:**
- You access the dashboard multiple times per day
- Need historical trend tracking
- Dashboard is mission-critical
- Phase 1 score is 4-6
- Source tables are too large

**Skip if:** Score 0-2, data queried infrequently or already on a pre-aggregated smaller data source, or you prefer the lightweight non-workflow path.

→ See `./phase-2/deploy-workflow-guide.md` for full steps

---

## Quick Reference

```
I want to...                                          → Go to...
Requirements + data discovery                         ./phase-1/SKILL.md
Build a lightweight dashboard (score 0-2)              ./phase-3/build-interactive-dashboard-guide.md
Deploy a production workflow (score 4-6)               ./phase-2/deploy-workflow-guide.md (then Phase 3)
Validate dashboard data accuracy                       ./phase-3/references/steps.md (Step 4f: Validate Data Accuracy)
Test dashboard comprehensively                         ./phase-3/references/testing-troubleshooting.md
Automate dashboard for future builds                   ./phase-4/automate-deploy-guide.md (Track A)
Deploy an AI agent for conversational access            ./phase-4/automate-deploy-guide.md (Track B)
Create handoff docs                                     ./phase-5/handoff-documentation-guide.md
```

---

## File & Reference Guide

### Phase Workflow Files

| Phase | File | Key Output |
|-------|------|-----------|
| **1** | `./phase-1/requirements-gathering-guide.md` | Promotion Score + path decision + **state.md created** |
| **2** | `./phase-2/deploy-workflow-guide.md` | Workflow deployed + SINK tables validated |
| **3** | `./phase-3/build-interactive-dashboard-guide.md` | User-approved interactive `dashboard.html` |
| **4** | `./phase-4/automate-deploy-guide.md` | Reusable dashboard skill (Track A) + Foundry AI agent (Track B) |
| **5** | `./phase-5/handoff-documentation-guide.md` | 4 local markdown files (Architecture, Usage Guide, Runbook, Access & Ownership) |

### Key Decision References

| Reference | Purpose |
|-----------|---------|
| `./phase-1/references/stage-b-database-discovery.md` | 0-6 scoring rubric: 0-2 = Non-Workflow, 3 = Optional, 4-6 = Workflow |
| `./phase-3/references/steps.md` | Step 4f: Data accuracy validation gate (required for all dashboards) |
| `./phase-3/references/testing-troubleshooting.md` | Comprehensive dashboard testing (tests across dimensions) |
| `./phase-4/references/track-a-automation.md` | Save dashboards as reusable skills (Track A automation) |
| `./phase-4/references/track-b-ai-agent.md` | Deploy a companion Foundry agent (Track B) |

### Reference Libraries

| Folder | Contents |
|--------|----------|
| `./phase-3/references/rendering/html-client/` | HTML Client rendering engine, templates & guides |
| `./phase-4/references/templates/` | Knowledge-base and agent-prompt templates for Track A/B |
| `./references/guardrails-lite.md` | Cross-phase guardrails: data integrity, database & queries, rendering, agent prompts |

---

## Security & Privacy

**STRICT RULE:** All query results must flow through rendering scripts, never into AI context. See `./references/guardrails-lite.md` ("Never read raw query output files into AI context").

---

→ **Full file & folder index:** `./INDEX.md`

---

**Version:** 1.0.0 (Lite)
**Last Updated:** 15 July 2026
**Author:** FDE Team
