-- Create user journey path / funnel statistics
-- Skill: sql-skills:trino | sql-skills:trino-optimizer
--
-- Written as a plain SELECT — the workflow task uses create_table: (full-refresh).
-- Never use INSERT INTO here.
--
-- If one of your SINK tables is a snapshot (no time column — e.g. a customer dimension table),
-- do NOT add a td_time_range() filter. Snapshot tables ignore date/channel/category filters
-- on the dashboard — document this in knowledge/data_dictionary.md (Phase 5 Step 5a).
--
-- Remove this file and its task from dashboard-workflow-create-data-model.dig
-- if path/funnel analysis is not in scope for this engagement.

SELECT
  event_date,
  device_type,
  country,
  event_type,
  COUNT(*)                        AS path_count,
  COUNT(DISTINCT user_id)         AS unique_users,
  -- APPROX_PERCENTILE is more memory-efficient than exact PERCENTILE_CONT on large datasets
  APPROX_PERCENTILE(event_value, 0.5) AS median_value
FROM
  ${sink_database}.${project_prefix}_events_prep
WHERE
  td_time_range(event_time,
    TD_TIME_ADD(TD_SCHEDULED_TIME(), '-1d', 'UTC'),
    TD_SCHEDULED_TIME(), 'UTC')
GROUP BY
  event_date,
  device_type,
  country,
  event_type
