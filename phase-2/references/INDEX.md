# Phase 2 References Directory

Detailed, reusable patterns for Phase 2: Deploy Dashboard Workflow.

**Entry point:** `../deploy-workflow-guide.md` — start here for the 7-step overview and starting-point (locally embedded templates).

---

## Reference Files

| File | Purpose |
|---|---|
| **[workflow-setup-configure.md](workflow-setup-configure.md)** | Steps 3a–3d: set up project, configure `input_params.yaml`, customize SQL. Includes SQL aggregation patterns, schedule configuration, datamodel design principles, and cardinality audit checklist |
| **[workflow-deployment-validate.md](workflow-deployment-validate.md)** | Steps 3e–3h: pre-deploy review, deploy with `tdx wf push`, validate SINK tables, incremental strategy. Includes SINK table documentation template and fan-out reference |
| **[td-time-functions.md](td-time-functions.md)** | `td_time_range()`, `TD_SCHEDULED_TIME()`, `TD_TIME_ADD()` patterns; incremental mode decision (append-only / 1-day / 7-day); performance impact |
| **[incremental_update_patterns.md](incremental_update_patterns.md)** | Full `INSERT INTO` examples per incremental mode; upsert and state-managed patterns |
| **[input_params_examples.md](input_params_examples.md)** | `input_params.yaml` worked examples for 5 verticals (e-commerce, SaaS, marketing, retail, content/media) |
| **[pre-deployment-checklist.md](pre-deployment-checklist.md)** | Go/no-go checklist before `tdx wf push` — catches schema, cardinality, and config issues |
| **[testing-troubleshooting.md](testing-troubleshooting.md)** | Testing checklist (schema, data quality, metrics accuracy, workflow execution), troubleshooting guide for common issues, and performance tuning |
| **[workflow-templates/](workflow-templates/)** | The embedded workflow template: `.dig` files, parameterized SQL, `input_params.yaml` — copy this into `./<project_slug>/workflows/` in Step 3a |

---

## Quick Navigation by Step

| Step | File |
|---|---|
| Phase 2 entry requirements (read Stage A/B config) | `workflow-setup-configure.md` (Phase 2 Entry Requirements section) |
| 3a. Set up project (copy embedded template) | `workflow-setup-configure.md` + `workflow-templates/` |
| 3b. Configure `input_params.yaml` | `workflow-setup-configure.md` + `input_params_examples.md` |
| 3c. Customize SQL (aggregation patterns) | `workflow-setup-configure.md` (SQL Aggregation Patterns section) |
| 3c. Configure schedule | `workflow-setup-configure.md` (Schedule Configuration section) |
| 3c. TD time functions | `td-time-functions.md` |
| 3c. Incremental INSERT INTO patterns | `incremental_update_patterns.md` |
| 3d. Configure `config.json` datamodel (optional) | `workflow-setup-configure.md` (Datamodel Design Principles section) |
| 3e. Review configuration | `workflow-deployment-validate.md` + `pre-deployment-checklist.md` |
| 3f. Deploy workflow | `workflow-deployment-validate.md` |
| 3g. Validate SINK tables | `workflow-deployment-validate.md` (SINK Table Documentation Template section) |
| 3h. Incremental strategy + test | `workflow-deployment-validate.md` (Step 3h section) |
| Troubleshooting | `testing-troubleshooting.md` |
| Performance tuning | `testing-troubleshooting.md` (Performance Tuning section) |

---

## Phase 2 Output Summary

At end of Phase 2:
- ✅ Template configured with all Stage B metrics, source tables, and exclusion filters
- ✅ Workflow deployed and first historical run complete
- ✅ Incremental mode chosen (append-only / 1-day / 7-day lookback), if applicable
- ✅ All SINK tables validated (row counts, metric cross-checks, no duplicates)
- ✅ Workflow running on schedule (all sub-workflows SUCCESS)
- ✅ Ready for Phase 3 (dashboard queries SINK tables, not source tables)

---

## Related Skills

- `workflow-skills:digdag` — Digdag `.dig` syntax, operators, session variables
- `sql-skills:trino` — TD Trino SQL patterns and TD-specific functions
- `sql-skills:trino-optimizer` — `APPROX_DISTINCT`, CTAS, performance patterns
- `sql-skills:time-filtering` — `td_time_range()`, `TD_SCHEDULED_TIME()`, `TD_TIME_ADD()` reference
---

**Version:** 1.0.0 (Lite)
**Last Updated:** 15 July 2026
**Author:** FDE Team
