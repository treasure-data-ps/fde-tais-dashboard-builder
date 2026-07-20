-- Create unique visitor metrics by date
-- Skill: sql-skills:trino | sql-skills:trino-optimizer
--
-- Written as a plain SELECT — the workflow task uses create_table: (full-refresh).
-- Never use INSERT INTO here.
--
-- Use APPROX_DISTINCT instead of COUNT(DISTINCT) for columns with high
-- cardinality — 2% error margin is acceptable for dashboard display.
-- Remove this file and its task from dashboard-workflow-create-data-model.dig
-- if visitor-level metrics are not in scope for this engagement.

SELECT
  event_date,
  -- APPROX_DISTINCT is 20–50x faster than COUNT(DISTINCT) for large cardinality
  APPROX_DISTINCT(user_id)        AS unique_visitors,
  COUNT(*)                        AS total_events_all_users
FROM
  ${sink_database}.${project_prefix}_events_prep
WHERE
  td_time_range(event_time,
    TD_TIME_ADD(TD_SCHEDULED_TIME(), '-1d', 'UTC'),
    TD_SCHEDULED_TIME(), 'UTC')
GROUP BY
  event_date
ORDER BY
  event_date
