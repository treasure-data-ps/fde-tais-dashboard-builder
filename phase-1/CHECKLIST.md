# Phase 1: Requirements & Data Discovery — Checklist Only

**Purpose:** Quick decision guide. Read this first; full SKILL.md is fallback when details needed.

---

## Stage A: Session Setup + Requirements

- [ ] Project slug chosen (short, kebab-case)
- [ ] Business goal / dashboard purpose (1 sentence)
- [ ] Platform target? (Treasure Work / Treasure AI Studio)
- [ ] Data source type? (Raw/Transactional / Pre-aggregated / Snapshot / Mixed)

Use **AskUserQuestion for every question** (never plain text):

- [ ] **1a:** Dashboard purpose & success criteria
- [ ] **1b:** Metrics/KPIs (what to measure)
- [ ] **1c-1d:** Dimensions + Filters + Layout
- [ ] **⚠️ CRITICAL 1e-1f: Date range, timezone, refresh/freshness**
- [ ] **1g:** Historical depth
- [ ] **1h:** Sharing, access, target users (if customer-facing)
- [ ] **1j:** Alerts/thresholds (if applicable)
- [ ] **1o:** Exclusion rules & data quality

### Optional (only if relevant)
- [ ] **1k:** Mobile/responsive design
- [ ] **1l:** Compliance/data sensitivity
- [ ] **1m:** Data source complexity / canonical ID
- [ ] **1n:** Drill-down depth

---

## Stage B: Data Discovery & Validation

- [ ] Database selected, tables confirmed to exist (`tdx databases`, `tdx describe`)
- [ ] Time column identified (business-event datetime vs TD insert-time `time` column)
- [ ] Metrics inferred/validated against live queries
- [ ] Dimensions inferred/validated (DISTINCT values, cardinality, join fan-out checked)
- [ ] Filters classified by scope (dashboard-level / tab-level / widget-level)
- [ ] Tab grouping proposed (if multiple logical views)
- [ ] Data Quality Gate run — Checks 1–12 (`./references/validation-queries.md`)
- [ ] Confirmed values recorded (`./references/confirmed-values-checkpoint.md`) to avoid re-querying later

---

## Scoring & Path Decision

- [ ] **Promotion score** — Q1 + Q2 + Q3 = ___ / 6
  - Q1 (Viewing Frequency): 0=one-time, 2=weekly+
  - Q2 (Metrics Trend Critical): 0=snapshot, 2=time-series essential
  - Q3 (Audience Scope): 0=1 person, 2=team+/external
- [ ] **Path decision:**
  - Score 0–2 (or pre-aggregated data source) → Non-Workflow → Phase 3 directly
  - Score 3 → ask user: quick build (Phase 3) vs scheduled workflow (Phase 2 then Phase 3)
  - Score 4–6 → Workflow → Phase 2, then Phase 3

---

## Finalization

- [ ] `./<project-slug>/state.md` created with Session Setup + Requirements + Data Discovery + Score + Path Decision
- [ ] User approval via AskUserQuestion: "Does this capture your requirements and the confirmed data findings?"

---

## Completion Gate

**All items checked?**
- [ ] Stage A: core requirements captured
- [ ] Stage B: data validated, Data Quality Gate passed
- [ ] Promotion score calculated, path decided
- [ ] `state.md` created and approved

**If all checked:** Phase 1 complete → proceed to Phase 2 (if Workflow) or Phase 3 (if Non-Workflow)

---

**Full details:** See `/phase-1/SKILL.md` and `/phase-1/references/` directory
