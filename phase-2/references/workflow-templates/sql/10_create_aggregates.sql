-- Create aggregated KPI metrics table
-- Skill: sql-skills:trino | sql-skills:trino-optimizer
--
-- Written as a plain SELECT — the workflow task uses create_table: which replaces the
-- SINK table on every run (full-refresh). Never use INSERT INTO here.
--
-- To JOIN a dimension table, add a LEFT JOIN below and COALESCE null dimension values.
-- Example from a validated engagement:
--   LEFT JOIN ${source_database}.master_customers c ON t.${main_id_key} = c.${main_id_key}
--   , COALESCE(c.customer_segment, 'Unknown') AS customer_segment
--
-- Customize the SELECT list to match Phase 2 confirmed metrics (Step 2c).
-- Add/remove metric columns; keep event_date and user_id as grain keys.
--
-- TIME FILTER PATTERNS — choose one:
--
-- Pattern A: Incremental (scheduled workflow, daily/weekly append window)
--   td_time_range(event_time,
--     TD_TIME_ADD(TD_SCHEDULED_TIME(), '-1d', 'UTC'),
--     TD_SCHEDULED_TIME(), 'UTC')
--
-- Pattern B: Full-load (backfill or date-range parameterized run)
--   td_time_range(event_time, '${start_date}', '${end_date}', 'UTC')
--   Requires start_date and end_date in input_params.yaml (ISO 8601 format: YYYY-MM-DDThh:mm:ss)
--   Use this when: first run, full-backfill, ad-hoc range, or debugging a missing time window

SELECT
  event_date,
  user_id,
  COUNT(*)                                                    AS total_events,
  COUNT(DISTINCT session_id)                                  AS sessions,
  COUNT(CASE WHEN event_type = 'conversion' THEN 1 END)       AS conversions,
  COALESCE(SUM(event_value), 0)                               AS total_value,
  -- approx_distinct is 20–50x faster than COUNT(DISTINCT) on large tables
  -- Use for high-cardinality columns (user_id, session_id)
  APPROX_DISTINCT(session_id)                                 AS approx_sessions,
  MAX(device_type)                                            AS last_device
FROM
  ${sink_database}.${project_prefix}_events_prep
WHERE
  -- SWITCH PATTERN HERE: use Pattern A for scheduled runs, Pattern B for full-load / backfill
  td_time_range(event_time,
    TD_TIME_ADD(TD_SCHEDULED_TIME(), '-1d', 'UTC'),
    TD_SCHEDULED_TIME(), 'UTC')
GROUP BY
  event_date,
  user_id
