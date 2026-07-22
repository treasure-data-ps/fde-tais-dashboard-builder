---
name: dashboarding-guardrails-lite
description: |
  Mandatory guardrails for the custom-dashboard-agent-lite skill. Load this file FIRST at the start of every session. Enforces strict rules on data integrity, queries, and HTML Client rendering. Violations cause rework — these are non-negotiable.
load_order: 0
---

# Custom Dashboard Agent (Lite) — Guardrails

**Read this before doing anything else in a dashboarding session.**

**⚠️ CRITICAL — RE-READ THIS AFTER CONTEXT COMPACTION:** If context gets compressed/summarized, or when moving between phases, **STOP and re-read this entire file** before proceeding. Guardrails must not be lost or forgotten due to context boundaries.

These rules are derived from production incidents and real re-work on the full dashboarding-skills solution. Every rule has a reason. Violating any of them has caused rebuilds, wrong customer data, or lost trust in past engagements.

---

## 1. Data Integrity

### NEVER use synthetic, mock, or hardcoded data
Every number in a dashboard must come from a live SQL query result. No estimated values, no "probably around this much", no hardcoded sample arrays. If you don't have a query result yet, don't start building.

**Why:** Customers spot-check dashboards. Wrong numbers destroy trust and require complete rebuilds. Past incident: dashboard showed "New York is #1 destination" — actual top destination was Tokyo with 2× revenue.

### NEVER read raw query output files into AI context
Query results in `/tmp/` contain customer emails, IDs, counts, and financial data. Always pipe through node scripts (e.g., `render.js`) so data flows through the script only, never through AI context.

### ALWAYS verify column names against the actual table schema before writing any query or inject script
Run `tdx describe <db>.<table>` first. Copy exact column names (case-sensitive). Past incident: dashboard showed all zeros because `customers` ≠ `total_customers` in the SINK schema.

### ALWAYS spot-check dashboard numbers against the database
After rendering, pick at least 3 KPIs and verify them with a direct SQL query. Numbers must match to the exact value — not "approximately". If 1% off, something is wrong.

### ALWAYS check for join fan-out before writing aggregation queries
If joining 1-to-many tables, count rows before and after. If `after_join > 2 × before_join`, you have fan-out.

**Fix = pre-aggregate the many-side table into a subquery keyed on the join key BEFORE joining. Never aggregate after a fan-out join.**

```sql
-- WRONG: aggregate after join → inflated totals
SELECT SUM(o.amount) FROM customers c JOIN orders o ON c.id = o.customer_id

-- RIGHT: pre-aggregate orders, then join
SELECT SUM(agg.total) FROM customers c
JOIN (
  SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY customer_id
) agg ON c.id = agg.customer_id
```

Past incident: revenue inflated from $4.32M to $6.86M due to undetected fan-out on a 1-to-many orders join.

### ALWAYS use GROUP BY on only the dimensions the dashboard actually filters on
Source tables are often built at a finer grain than the dashboard needs. Identify which dimensions the filters use, then GROUP BY only those. Past incident: 7-dimension table caused 60% row inflation when only 4 dimensions were filtered.

---

## 2. Database & Queries

### NEVER assume a database name — always AskUserQuestion
Use `tdx databases` to discover available databases, then present them as options. Never guess or infer the database name.

### ALWAYS run queries in parallel
Every data-generation script must use `Promise.all()` for all queries. Sequential queries multiply latency. Past incident: 5 sequential queries took 5s total; switching to `Promise.all()` brought it to 1.5s.

```javascript
// Always
const [a, b, c] = await Promise.all([queryA(), queryB(), queryC()]);
```

### ALWAYS add --limit xxxx for tables that may return more than 40 rows
`tdx query` defaults to 40 rows. Dimension tables and histogram buckets regularly have 60+ rows. Missing rows cause silent gaps in charts.

### SELECT only the columns the template actually reads
Before writing any query, map what the template displays, then fetch only those columns. Past incident: unused columns added 445 KB to every response.

---

## 3. Rendering (HTML Client only)

This skill produces a single portable `dashboard.html` file with data inlined at build time (Pattern A) — no server, no separate API calls at runtime. This is the only rendering pattern in scope.

### NEVER use Python for file I/O in dashboard rendering — always use Node.js
`python3` is not the standard for this pipeline. All file reading, template injection, and output writing must use `node` (`generate-data.js` / `render.js`).

### NEVER let the AI read raw query results directly — always pipe through a script
Same rule as Data Integrity above: query results flow `tdx query → node script → dashboard.html`, never through AI context.

### Know the rendering floor before optimizing queries
- `tdx query` per query → ~0.5s floor
- `node` script startup → ~0.3s floor

If queries are already faster than this floor, stop optimizing SQL — you're limited by script startup, not the queries.

### ALWAYS confirm the final HTML file opens standalone
Since the whole point of HTML Client is portability, open `dashboard.html` directly in a browser (no dev server) before calling it done. If it needs a running server to render, the build is wrong.

---

## 4. Requirements

### ALWAYS resolve metric definition ambiguity explicitly — offer "show both"
When two valid definitions exist (e.g., unique openers vs total opens), don't force a binary choice. Propose showing both. Past incident: email open rate was 30.5% (unique) vs 87.4% (total) — showing both resolved the ambiguity and gave more insight.

---

## 5. Agent Prompts (Phase 4 Track B)

### ALWAYS put "Execute queries, don't describe them" as the FIRST rule in every agent system prompt
LLM attention weights early instructions highest. If this rule is buried, agents describe what they would do instead of doing it. It must be line 1.

### ALWAYS embed confirmed values in knowledge bases
Schema alone is not enough. KBs must include spot-checked values (e.g., "Total customers (confirmed): 1,000") as ground truth anchors. Without them, agents compute totals from fan-out data and return wrong numbers.

### ALWAYS audit existing Foundry projects for stale schema before deploying
Check whether a project already exists. If yes, pull it and diff the KB table names against the current schema. Past incident: stale KBs referenced a deprecated table name instead of the current one.

### ALWAYS use `--reeval` when iterating on prompt fixes
Re-run only the failing test with `tdx agent test --reeval --name <test_id>`. Don't re-run all tests on every prompt tweak. Past incident: running all 5 tests on every fix wasted 80% of iteration time.

---

## Quick Pre-Flight Checklist

Before starting any dashboarding session, verify:

- [ ] I will ask for the DB name — never assume
- [ ] I will run queries in parallel (`Promise.all`)
- [ ] I will verify column names before writing inject scripts
- [ ] I will spot-check 3+ KPIs against the database after rendering
- [ ] I will confirm the final `dashboard.html` opens standalone in a browser
