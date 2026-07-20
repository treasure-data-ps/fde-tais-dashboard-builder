# Phase 3: Build Interactive Dashboard — Checklist Only

**Purpose:** Quick decision guide. Read this first; full guide (`build-interactive-dashboard-guide.md`) is fallback when details needed.

---

## Pre-Phase-3 Gate

- [ ] Phase 1 complete: database, tables, metrics, dimensions validated with real sample values
- [ ] Phase 2 skipped OR complete (SINK tables ready if Phase 2 done)
- [ ] `state.md` updated with all findings resolved
- [ ] Rendering engine: HTML Client (only option — nothing to confirm)
- [ ] Path confirmed: Non-Workflow (query source tables) OR Workflow (query SINK tables)

---

## Steps 4a–4l: Dashboard Build

### 4a: No-op
- [ ] Nothing to confirm — rendering engine is always HTML Client

### 4b: Generate Dashboard Query Scaffolding
- [ ] Write SQL for each widget/KPI
- [ ] Validate query performance (< 5s target)
- [ ] Apply ALL filters at SQL `WHERE` clause — never client-side post-filter

### 4c: Build Dashboard Structure (HTML Client)
- [ ] Copy template from `references/rendering/html-client/templates/` (kpi / table / multi-chart)
- [ ] Define layout (filters, widgets, tabs) matching Phase 1 mockup

### 4d: Write `generate-data.js`, Connect Data
- [ ] Copy starter `generate-data.js` and customize queries/columns
- [ ] Wrap every numeric field with `num()` normalization
- [ ] Run it — confirm output size (< 2MB, Pattern A only)

### 4e: Render + Validate
- [ ] Open `dashboard.html` in browser — confirm real data (not blank/dashes)
- [ ] Run jsdom headless validation (`npm install jsdom && node validate.js`)
- [ ] No console errors (F12 → Console)

### 4f–4l: Validate, Test, Approve, Document
- [ ] Validate data accuracy against Phase 1/2 manual spot-checks
- [ ] Test filter interactions: independence, combinations, edge cases
- [ ] Performance check: queries < 5s, load < 5s
- [ ] Get user feedback + approval
- [ ] Document dashboard parameters in `state.md`
- [ ] Test mobile/responsive (only if Phase 1 required it)

---

## Quality Gate

Before approval request:
- [ ] All metrics match Phase 1/2 confirmed values (or documented why they differ)
- [ ] All filters applied at SQL layer, tested independently and in combination
- [ ] Performance acceptable (queries < 5s, load < 5s)
- [ ] Responsive design tested (if required)
- [ ] No console errors (F12 → Console check)

---

## Customer Approval

- [ ] **Approval checkpoint:** Show filled summary code block first
- [ ] **AskUserQuestion:** "Does the dashboard meet your needs?"
  - Approve — looks good
  - Edit — describe changes
  - Blocker — describe issue
- [ ] If Edit → iterate locally, re-test, re-ask
- [ ] If Approve → record sign-off date, proceed to Phase 4 or Phase 5 (both optional)

---

## Post-Approval

- [ ] Update `state.md` status: "Phase 3 — Complete"
- [ ] Record dashboard path, metrics validated ✅
- [ ] Optionally proceed to Phase 4 (Track A skill / Track B agent)
- [ ] Optionally proceed to Phase 5 (handoff docs)
- [ ] Otherwise: close out, share the final `dashboard.html`

---

**Full details:** See `./build-interactive-dashboard-guide.md` and `references/`

**Note:** This CHECKLIST reduces guide reading time — full guide is the fallback for details.

**Efficiency note:** Reuse confirmed values from Phase 1/2 for widget validation (no re-queries needed)
