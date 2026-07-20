# Phase 1: Session Setup Questions

> **⛔ GUARDRAILS FIRST — before doing anything else in this file:**
> Read `../../references/guardrails-lite.md` now. Do not ask any question, run any command, or read any reference resource until guardrails-lite.md has been read in full.

Ask ALL 4 questions before collecting business requirements. These decisions gate the rest of Phase 1 and all downstream phases. **All 4 are mandatory — do not skip any.** If the user skips or ignores a question, re-ask before proceeding.

- Project slug names the working directory `./<project-slug>/` where everything this skill produces is written
- Data source type may eliminate Phase 2 (Workflow)
- Platform affects sharing guidance (rendering itself is always HTML Client)

Batch all 4 into a single AskUserQuestion call (max 4 questions per call):
- Setup-A (project slug), Setup-B (business goal), Setup-C (target platform), Setup-D (data source type)

**⚠️ GATE: Do not proceed to Stage A (Steps 1a–1o) until this call is complete and all 4 answers are recorded in session.**

---

## Step Setup-A: Project Slug

**Why first:** Everything this skill produces — `state.md`, workflow files, dashboard HTML, skill/agent artifacts — lives under `./<project-slug>/`. Without it nothing can be written.

**AskUserQuestion:**

```
AskUserQuestion:
  header: "Project slug"
  question: "What short, kebab-case slug should I use for this project? (e.g., 'acme-campaign-perf', 'sales-pipeline')"
  options:
    - label: "Custom slug"
      description: "I'll type the exact slug — becomes the working directory ./<slug>/"
    - label: "Generate from dashboard purpose"
      description: "I'll suggest one once I know what the dashboard is for"
```

**Output:** `project_slug` — the working directory for everything Phase 1-5 produce.

---

## Step Setup-B: Business Goal / Dashboard Purpose

**Why now:** A one-sentence purpose anchors every later decision (metrics, audience, layout).

**AskUserQuestion:**

```
AskUserQuestion:
  header: "Dashboard purpose"
  question: "In one sentence, what decision or question should this dashboard help answer?"
  options:
    - label: "I'll describe it now"
      description: "One sentence — e.g., 'Track weekly campaign spend vs. conversions'"
    - label: "Not sure yet — I'll figure it out as we go"
      description: "We'll refine the purpose together while gathering metrics in Step 1a"
```

**Output:** `business_goal` — stored in `state.md`.

---

## Step Setup-C: Target Platform

**Why it matters:** Platform affects sharing/access guidance. Rendering itself is always HTML Client (a single portable `dashboard.html`) in this lite skill — no engine decision is needed.

**AskUserQuestion:**

```
AskUserQuestion:
  header: "Target platform"
  question: "Where will this dashboard be used?"
  options:
    - label: "Treasure Work (internal)"
      description: "Open the HTML file locally or share it as a file"
    - label: "Treasure AI Studio / shared externally"
      description: "Portable single-file HTML — easy to email or host"
    - label: "Not sure / both"
      description: "HTML Client works either way — decide sharing details later"
```

**Output:** `target_platform` — stored in `state.md`. Informative only; does not change the rendering engine.

---

## Step Setup-D: Data Source Type

**Why it matters:** Understanding the data source type (raw/transactional with high volumes and complex joins vs. pre-aggregated with low-volume pre-calculated KPIs) determines whether Phase 2 (Workflow) is necessary.

**Key distinction:**
- **Raw / Transactional:** High data volumes, complex table joins. A scheduled Phase 2 workflow is recommended for aggregation and performance.
- **Pre-aggregated:** Low volume data, already pre-calculated KPIs, minimal joins. Phase 2 can be skipped entirely — query source tables directly in Phase 3.

**AskUserQuestion:**

```
AskUserQuestion:
  header: "Data source type"
  question: "What is the nature of the data source?"
  options:
    - label: "Raw/Transactional (high volume, complex joins)"
      description: "Event-level data with many joins and high volumes. Workflow recommended."
    - label: "Pre-aggregated (low volume, pre-calc KPIs)"
      description: "RFM output, Parent Segment, SINK tables. Minimal joins. Phase 2 not needed."
    - label: "Mix of raw and aggregated"
      description: "Both types. Phase 2 decision per metric during data discovery."
    - label: "Not sure — check during data discovery"
      description: "I'll recommend a path based on data structure"
```

**Downstream rules:**

| Answer | Phase 2 flag | Recommended Path | Notes |
|--------|-------------|------------------|-------|
| Raw / Transactional | `skip_workflow = false` | Use promotion score normally | Complex joins + volume → Phase 2 usually beneficial |
| Pre-aggregated | `skip_workflow = true` | Skip Phase 2 regardless of score | Data already optimized — no workflow needed |
| Mix | `skip_workflow = partial` | Decide per-metric during data discovery | Some metrics may skip, others may need Phase 2 |
| Not sure | `skip_workflow = tbd` | Resolve during data discovery | Determined by actual table structure |

**Output:** `data_source_type` + `skip_workflow` flag — stored in `state.md`.

---

## Combined AskUserQuestion Call

```
AskUserQuestion:
  questions:
    - header: "Project slug"
      question: "What short, kebab-case slug should I use for this project?"
      options: [see Setup-A above]

    - header: "Dashboard purpose"
      question: "In one sentence, what decision or question should this dashboard help answer?"
      options: [see Setup-B above]

    - header: "Target platform"
      question: "Where will this dashboard be used?"
      options: [see Setup-C above]

    - header: "Data source type"
      question: "What is the nature of your data source?"
      options: [see Setup-D above]
```

---

**⚠️ GATE: Do not proceed to Steps 1a–1o until all of the following are confirmed:**
- `project_slug` recorded
- `business_goal` recorded
- `target_platform` recorded
- `data_source_type` recorded
- `skip_workflow` flag set
- Ready to proceed to Stage A

---

## Output: What Gets Written to `state.md`

After the call completes, this becomes the first block of `./<project-slug>/state.md`:

```markdown
## Phase 1 — Session Setup

- **Project Slug:** <slug>
- **Business Goal:** <one sentence>
- **Target Platform:** <Treasure Work | Treasure AI Studio | Not sure>
- **Data Source Type:** <Raw/Transactional | Pre-aggregated | Mix | TBD>
- **Skip Workflow Flag:** <true | false | partial | tbd>
```

Then proceed to Stage A (Steps 1a–1o).

---

## Quality Checklist: End of Session Setup

Before moving to Stage A (business requirements), verify every item below. **Do not proceed if any item is blank or unanswered.**

- ✅ **`guardrails-lite.md` read** — (`../../references/guardrails-lite.md`) — must be first
- ✅ `project_slug` recorded
- ✅ `business_goal` recorded
- ✅ `target_platform` recorded
- ✅ `data_source_type` recorded
- ✅ `skip_workflow` flag set — one of: true | false | partial | tbd
- ✅ Ready to proceed to Stage A

---

**Version:** 1.0.0 (Lite)
**Last Updated:** 15 July 2026
**Author:** FDE Team
