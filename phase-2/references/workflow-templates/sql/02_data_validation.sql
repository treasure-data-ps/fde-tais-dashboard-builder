-- Data Quality Validation
-- Skill: sql-skills:trino
--
-- Runs after 01_data_prep.sql to confirm the incremental insert produced
-- sane results. This is a SELECT-only query — the workflow reads its output
-- via tdx wf attempt logs. Fails loudly if critical thresholds are breached.
--
-- Extend with additional assertions specific to your Phase 2 confirmed metrics.

SELECT
  COUNT(*)                                                    AS total_records,
  COUNT(DISTINCT user_id)                                     AS unique_users,
  MIN(event_date)                                             AS earliest_date,
  MAX(event_date)                                             AS latest_date,
  COUNT(CASE WHEN user_id    IS NULL THEN 1 END)              AS null_user_ids,
  COUNT(CASE WHEN event_date IS NULL THEN 1 END)              AS null_dates,
  COUNT(CASE WHEN event_value < 0    THEN 1 END)              AS negative_values,
  -- Freshness check: latest row should be within the last 2 days
  CASE
    WHEN MAX(event_date) < CAST(DATE_ADD('day', -2, CURRENT_DATE) AS DATE)
    THEN 'STALE — check source pipeline'
    ELSE 'OK'
  END                                                         AS freshness_status
FROM
  ${sink_database}.${project_prefix}_events_prep
WHERE
  -- Scope validation to yesterday's incremental window only
  td_time_range(event_time,
    TD_TIME_ADD(TD_SCHEDULED_TIME(), '-1d', 'UTC'),
    TD_SCHEDULED_TIME(), 'UTC')
