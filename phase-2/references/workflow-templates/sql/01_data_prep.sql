-- Data Preparation: Clean and validate source data into a staging table
-- Skill: sql-skills:trino | sql-skills:time-filtering
--
-- STAGING TABLE — this task uses create_table: at the .dig level (see SLUG_data_prep.dig),
-- not INSERT INTO. events_prep only ever needs to hold the CURRENT run's window (the full
-- historical window on a 'full' run, or just the incremental lookback window on an
-- 'incremental' run) — downstream tasks (10/11/12) consume it within the same run and
-- do not need it to accumulate history itself. Using create_table: here means:
--   - First run ever: no "table doesn't exist" crash (a bare INSERT INTO would fail —
--     TD's engine does not auto-create the target table; verified: throws TABLE_NOT_FOUND).
--   - No duplicate-row risk from re-inserting the same days on every incremental run.
--
-- FULL MODE (refresh_mode='full', session_vars.data_window='full'):
--   Loads the complete start_date → end_date historical window.
--   Run this on first deploy and after schema changes.
--
-- INCREMENTAL MODE (refresh_mode='incremental', session_vars.data_window='incremental'):
--   Loads only the last incremental_look_back_days to cover late-arriving/corrected data.
--
-- td_time_range() prunes partitions at the storage layer — always faster
-- than a WHERE on a cast date column. Never remove it for production runs.

SELECT
  CAST(td_time_string(TD_TIME_PARSE(timestamp, 'UTC'), 'yyyy-MM-dd HH:mm:ss', 'UTC') AS TIMESTAMP) AS event_time,
  td_canonical_id                                                        AS user_id,
  event_type,
  CAST(event_value AS DOUBLE)                                           AS event_value,
  session_id,
  device_type,
  country,
  TD_DATE_TRUNC('day', TD_TIME_PARSE(timestamp, 'UTC'), 'UTC')          AS event_date
FROM
  ${source_database}.${source_table}
WHERE
  -- data_start / data_end are set by the calling workflow branch:
  --   Full mode:        data_start = start_date param, data_end = end_date param
  --   Incremental mode: data_start = now minus incremental_look_back_days, data_end = now
  td_time_range(TD_TIME_PARSE(timestamp, 'UTC'),
    ${data_window == 'full'
      ? "TD_TIME_PARSE('" + start_date + " 00:00:00', 'UTC'), TD_TIME_PARSE('" + end_date + " 23:59:59', 'UTC')"
      : "TD_TIME_ADD(TD_SCHEDULED_TIME(), '-" + incremental_look_back_days + "d', 'UTC'), TD_SCHEDULED_TIME()"},
    'UTC')
  AND td_canonical_id IS NOT NULL
  AND timestamp IS NOT NULL
  ${table_filter != "" ? "AND " + table_filter : ""}
