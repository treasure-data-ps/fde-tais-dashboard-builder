# Stage A: Optional Steps (1k-1n)

## Step 1k: Mobile/Responsive Design (Optional)

**What to do:**
- Determine if dashboard needs to work on mobile devices
- Assess device types and usage patterns

**Key actions:**
- Ask: "Will this be viewed on mobile?" (desktop-only, occasional mobile, equally, mobile-first?)
- If mobile needed: "Which devices?" (iPhone, iPad, Android phones, tablets?)
- Ask: "What's the primary use case on mobile?" (quick status checks vs full analysis?)
- Ask: "Should all features work on mobile, or simplified view?"

**Output:** Mobile requirement + target devices + feature set for mobile

**Note:** The HTML Client template uses responsive CSS by default — most mobile requirements are satisfied without extra work. Only escalate if the customer needs a materially different mobile layout.

---

## Step 1l: Compliance, Governance & Data Sensitivity (Optional)

**What to do:**
- Identify regulatory or governance requirements
- Assess data sensitivity and classification (even without formal compliance frameworks)

**Key actions:**
- Ask: "Any compliance frameworks?" (GDPR, HIPAA, SOC2, PCI-DSS, FedRAMP?)
- Ask: **"Does this data contain revenue figures, PII, salary data, or competitive information that should not be visible to all viewers?"** — even without a formal compliance framework, sensitive values may need masking (show ranges instead of exact numbers) or column suppression. Capture this even if formal compliance is not required
- Ask about data handling: "Data classification levels? Retention/deletion policies? Mask sensitive values in exports?"
- Document impact (sensitive data → consider value masking in Phase 3 build)

**Output:** Compliance frameworks + data sensitivity classification + masking/suppression needs + retention/deletion policies

---

## Step 1m: Data Source Complexity, Canonical ID & Unification Status (Optional)

**What to do:**
- Assess complexity of data sources
- Identify if multiple databases or complex joins are needed
- Capture the **canonical ID** and ID Unification status — critical for any dashboard that joins across tables (events + customers + orders). A missing or multi-value canonical_id silently breaks joins in Stage B

**Key actions:**
- Ask: "Where does data come from?" (single table/database, multiple tables/databases, APIs, streaming?)
- If multiple sources: "How are these tables related?" (1-to-1, 1-to-many, many-to-many?)
- Ask: **"What is the canonical user/customer ID that ties records across tables?"** — e.g., `customer_id`, `canonical_id`, `td_client_id`. Ask: "Is it guaranteed unique per person, or can one person have multiple values?" — if non-unique, flag for Stage B join validation
- Ask: **"Has ID Unification been completed on this data?"** — if yes, ask: "What is the output database and canonical_id column?" — a completed IDU means joins will be clean; incomplete IDU means Stage B must validate join cardinality carefully
- Ask: "Complex transformations?" (pivots, unpivots, CTEs?)
- Ask: "Data consistency issues?" (duplicates, mismatches, late-arriving dimensions?)
- Document impact (non-unique ID or incomplete IDU → flag for Stage B join validation; complex joins → Phase 2 workflow pre-aggregation recommended)

**Output:** Data source structure + join complexity + canonical ID column + ID Unification status + estimated data volume + data quality notes + transformation requirements

```
AskUserQuestion:
  questions:
    - header: "Canonical ID"
      question: "What is the canonical user/customer ID that ties records across tables?"
      multiSelect: false
      options:
        - label: "I'll specify the column name"
          description: "e.g. customer_id, canonical_id, td_client_id. Also tell me: is it unique per person, or can one person have multiple values?"
        - label: "Single table — no joins needed"
          description: "No cross-table ID needed. Skip this."
        - label: "Not sure"
          description: "Stage B will identify the join key from the schema."

    - header: "ID Unification"
      question: "Has ID Unification (IDU) been completed on this data?"
      multiSelect: false
      options:
        - label: "Yes — IDU complete"
          description: "Joins will be clean. I'll provide the IDU output database and canonical_id column."
        - label: "No — IDU not done"
          description: "Stage B must validate join cardinality carefully. May require workaround."
        - label: "Not sure"
          description: "Stage B will check join cardinality and flag any issues."
```

---

## Step 1n: Drill-Down Depth (Optional)

**What to do:**
- Determine how deep users need to drill into data
- Assess interactivity requirements

**Key actions:**
- Ask: "How deep should users drill?" (summary only, 1 level, multiple levels, individual records, raw data?)
- If drill-down needed: "What info at detail level?" (transactions, customer records, line items?)
- Ask: "Can they export detailed records?"
- Ask: "How many records at deepest level?" (hundreds, millions, billions?)
- Ask: "Acceptable query time for drill-down?" (10-30 seconds okay?)

**Output:** Drill-down depth + detail fields at each level + performance expectations + export requirements

**Note:** The HTML Client dashboard inlines data at build time (Pattern A). Very deep drill-down over millions of records is a poor fit for a single portable file — if the customer needs that, flag it and consider pre-aggregating harder in Phase 2 (Workflow) rather than shipping raw record-level detail.

---

## When to Reference These Steps

- **Step 1k:** If user mentions mobile, responsive, or device requirements
- **Step 1l:** If user mentions compliance, audit, data security, governance, OR if Step 1h flagged sensitive data — run 1l even without formal compliance frameworks
- **Step 1m:** If user asks about data source, mentions multiple databases, complex joins, OR if any dashboard metric requires joining more than one table — always ask about canonical ID in that case
- **Step 1n:** If user mentions drill-down, interactive exploration, or detailed analysis

---

## Step 1o-ext: CDP Activation Intent (Optional — run if data source is a CDP output or Parent Segment)

**What to do:**
- Determine if this dashboard is meant to feed into a CDP activation — a segment, a journey, or an A/B test
- If yes, output tables need CDP-compatible schemas (specific columns, timestamps, segment membership flags) that change Phase 2 SINK table design and Phase 3 layout

**When to ask:** Only if Setup-D identified the data source as a Parent Segment, CDP output, or RFM/NBA/NBP workflow output.

**Key actions:**
- Ask: **"Is this dashboard meant to feed into a CDP activation — a segment, a journey, or an A/B test?"**
  - Yes → ask: "Which activation? What columns does the downstream segment or journey expect?"
  - No → proceed normally
- If yes: document required output schema (column names, types, timestamp format) — these become SINK table design constraints in Phase 2 and column naming constraints in Phase 3
- Ask: "Should the dashboard surface segment membership flags (e.g., 'in high-value segment: yes/no') as a visible dimension?"

**Output:** CDP activation intent (yes/no) + downstream schema requirements (if yes) + segment membership flag requirement

---

**Version:** 1.0.0 (Lite)
**Last Updated:** 15 July 2026
**Author:** FDE Team
