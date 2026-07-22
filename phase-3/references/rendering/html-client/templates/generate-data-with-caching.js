/**
 * generate-data.js — HTML Dashboard Data Generation with Caching
 *
 * REFERENCE IMPLEMENTATION: Phase 4 Track A (Reusable Skill Extraction)
 *
 * ⚠️  BUILD TIME: This script runs on YOUR machine, queries TD, and produces:
 *     • data.json — cached query results (external, portable, versionable)
 *     • dashboard.html — rendered HTML (reads data.json)
 *
 * CACHING STRATEGY:
 * 1. Check if data.json exists and is recent (default: 60 min cache)
 * 2. If yes, skip queries and use cached data
 * 3. If no or --refresh flag, run all queries and write data.json
 * 4. Always build dashboard.html from data.json (or latest RAW)
 * 5. Display data freshness in dashboard UI: "Data as of Jul 23, 1:14 AM (2h ago)"
 *
 * FLAGS:
 *   (none)           → Query + cache + build (normal flow)
 *   --refresh        → Skip cache, re-query everything, rebuild
 *   --html-only      → Skip queries, rebuild HTML from existing data.json
 *   --data-only      → Query + cache, skip HTML build
 *
 * BENEFITS:
 *   • Re-open dashboard: ~0.1s (read JSON) instead of ~60s (query)
 *   • Iterate HTML/CSS: --html-only with no database queries
 *   • Show data age: "Data as of Jul 23, 1:14 AM (2h ago)"
 *   • Portable: data.json + dashboard.html = complete, shareable dashboard
 *
 * Usage:
 *   First run:
 *     SOURCE_DB=your_db node generate-data.js
 *
 *   Subsequent run (cached):
 *     SOURCE_DB=your_db node generate-data.js
 *
 *   Refresh data:
 *     SOURCE_DB=your_db node generate-data.js --refresh
 *
 *   Iterate HTML only (no queries):
 *     node generate-data.js --html-only
 *
 *   Generate data without building HTML:
 *     SOURCE_DB=your_db node generate-data.js --data-only
 *
 * Requirements:
 *   - tdx CLI installed and authenticated
 *   - dashboard.template.html in the same directory
 *   - Node.js (any recent version, no npm install needed)
 */

'use strict';

var execSync = require('child_process').execSync;
var fs = require('fs');
var path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────────
var DB_SOURCE = process.env.SOURCE_DB || 'your_database';
var DB_SINK = process.env.SINK_DB || DB_SOURCE;
var CACHE_MAX_AGE_MINUTES = parseInt(process.env.CACHE_MAX_AGE || '60', 10);

var TEMPLATE_PATH = path.join(__dirname, 'dashboard.template.html');
var DATA_PATH = path.join(__dirname, 'data.json');
var OUTPUT_PATH = path.join(__dirname, 'dashboard.html');

// ─── Parse CLI flags ────────────────────────────────────────────────────────
var args = process.argv.slice(2);
var htmlOnly = args.includes('--html-only');
var dataOnly = args.includes('--data-only');
var refresh = args.includes('--refresh');

// ─── Cache helper ───────────────────────────────────────────────────────────
// Returns cached RAW object if data.json exists and is recent.
// Returns null if missing or stale (or if --refresh flag is set).
function checkCache() {
  if (refresh) {
    console.log('🔄 --refresh flag set, skipping cache.');
    return null;
  }
  if (!fs.existsSync(DATA_PATH)) {
    console.log('📝 data.json not found, will generate.');
    return null;
  }
  var stat = fs.statSync(DATA_PATH);
  var ageMinutes = (Date.now() - stat.mtime) / (1000 * 60);
  if (ageMinutes > CACHE_MAX_AGE_MINUTES) {
    console.log('⏰ data.json is ' + Math.round(ageMinutes) + ' minutes old (cache=' +
                CACHE_MAX_AGE_MINUTES + ' min), regenerating.');
    return null;
  }
  var cached = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  console.log('✅ Cache hit: data.json is ' + Math.round(ageMinutes) + ' minutes old');
  return cached;
}

// ─── Query helper ───────────────────────────────────────────────────────────
// Execute a SQL query against the database.
// RULES:
// 1. All queries MUST include LIMIT (prevents OOM on large tables)
// 2. Default limit: 10,000 rows (override via DASHBOARD_ROW_LIMIT env var)
// 3. Coerce numeric strings to numbers (saves JSON payload size)
function query(sql, limitRows) {
  var limit = parseInt(process.env.DASHBOARD_ROW_LIMIT || '10000', 10);
  if (limitRows !== undefined) {
    limit = limitRows;
  }

  // Add LIMIT if not present (safety)
  if (sql.toUpperCase().indexOf('LIMIT') === -1) {
    sql = sql + ' LIMIT ' + limit;
  }

  try {
    console.log('   Querying ' + DB_SINK + '...');
    var result = execSync(
      'tdx query -d "' + DB_SINK + '" ' +
      '"' + sql.replace(/"/g, '\\"') + '" ' +
      '--format json --limit ' + limit,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 120000 }
    );

    // Parse JSON: tdx prepends status lines, so find first '['
    var match = result.match(/\[\s*\{/);
    if (!match) {
      // Empty result
      return [];
    }
    var jsonStr = result.slice(match.index);
    var rows = JSON.parse(jsonStr);

    // Warn if truncated
    if (rows.length >= limit && limit < 999999) {
      console.warn('   ⚠️  Result truncated to ' + limit + ' rows');
    }

    return rows;
  } catch (err) {
    console.error('ERROR: Query failed');
    console.error(err.message);
    process.exit(1);
  }
}

// ─── Numeric helper ─────────────────────────────────────────────────────────
// Coerce numeric strings to numbers (reduces JSON payload size by ~30%)
function num(v, decimals) {
  if (decimals === undefined) decimals = 2;
  var parsed = parseFloat(v || 0);
  var factor = Math.pow(10, decimals);
  return Math.round(parsed * factor) / factor;
}

// ─── Format helper ──────────────────────────────────────────────────────────
// Timestamp formatter for display (relative age)
function formatAge(isoString) {
  var dt = new Date(isoString);
  var ageMs = Date.now() - dt;
  var ageMin = Math.round(ageMs / (1000 * 60));
  var ageHr = Math.round(ageMs / (1000 * 60 * 60));
  if (ageMin < 60) {
    return ageMin + 'm ago';
  }
  return ageHr + 'h ago';
}

// ─── Fetch data (queries TD) ────────────────────────────────────────────────
// All custom queries go here. Returns RAW object ready to serialize.
function fetchData() {
  console.log('');
  console.log('🔄 Running queries against ' + DB_SINK + '...');

  // CUSTOMIZE: Replace these queries with your actual dashboard queries
  // Keep the same structure:
  //   1. Query rows from database
  //   2. Transform/aggregate as needed
  //   3. Build RAW object with all data

  // Example: KPI totals
  var kpiRows = query(
    'SELECT ' +
    '  SUM(revenue_amount) AS total_revenue, ' +
    '  COUNT(*) AS order_count, ' +
    '  AVG(revenue_amount) AS avg_order_value ' +
    'FROM your_fact_table ' +
    'WHERE td_time_range(time, \'2026-01-01\', \'2026-07-23\', \'UTC\') ' +  // customize date range
    'LIMIT 1'
  );
  var kpi = kpiRows[0] || {};

  // Example: Breakdown by dimension
  var breakdownRows = query(
    'SELECT region, SUM(revenue_amount) AS revenue, COUNT(*) AS cnt ' +
    'FROM your_fact_table ' +
    'WHERE td_time_range(time, \'2026-01-01\', \'2026-07-23\', \'UTC\') ' +
    'GROUP BY 1 ORDER BY revenue DESC LIMIT 20'
  );

  // Example: Time series (month-level)
  var trendRows = query(
    'SELECT SUBSTR(CAST(time AS VARCHAR), 1, 7) AS month, ' +
    '       SUM(revenue_amount) AS revenue ' +
    'FROM your_fact_table ' +
    'WHERE td_time_range(time, \'2026-01-01\', \'2026-07-23\', \'UTC\') ' +
    'GROUP BY 1 ORDER BY 1 DESC LIMIT 24'
  );

  console.log('   ✅ KPI: ' + kpiRows.length + ' row');
  console.log('   ✅ Breakdown: ' + breakdownRows.length + ' rows');
  console.log('   ✅ Trend: ' + trendRows.length + ' rows');

  // Assemble the RAW payload (with _meta for caching)
  var RAW = {
    _meta: {
      generated_at: new Date().toISOString(),
      source_db: DB_SOURCE,
      sink_db: DB_SINK,
      skill: 'dashboard-skill-name',  // customize: match your skill name
      version: '1'
    },
    summary: {
      source: DB_SINK + '.your_fact_table',
      period: 'Last 6 months (2026-01-01 to 2026-07-23)',
      records: num(kpi.order_count, 0),
      updated: new Date().toLocaleString()
    },
    kpis: [
      { label: 'Total Revenue', value: num(kpi.total_revenue, 0), format: 'currency' },
      { label: 'Orders', value: num(kpi.order_count, 0), format: 'number' },
      { label: 'Avg Order Value', value: num(kpi.avg_order_value, 2), format: 'currency' }
    ],
    breakdown: breakdownRows.map(function(r) {
      return {
        label: r.region,
        revenue: num(r.revenue, 0),
        count: num(r.cnt, 0)
      };
    }),
    trend: trendRows.map(function(r) {
      return {
        month: r.month,
        revenue: num(r.revenue, 0)
      };
    })
  };

  return RAW;
}

// ─── Build HTML ────────────────────────────────────────────────────────────
// Copies template to output. Template loads data.json at runtime via <script src>.
function buildDashboard() {
  console.log('');
  console.log('🏗️  Building dashboard.html...');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('ERROR: ' + TEMPLATE_PATH + ' not found');
    console.error('Make sure dashboard.template.html is in the same directory as generate-data.js');
    process.exit(1);
  }

  var template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Template should load data.json at runtime via one of these patterns:
  //
  // Pattern 1 (ES Module):
  //   <script type="module">
  //     import('data.json', { assert: { type: 'json' } })
  //       .then(m => { window.RAW = m.default; init(); });
  //   </script>
  //
  // Pattern 2 (Simple script tag — requires data.json to export RAW):
  //   <script src="data.json"></script>
  //   <script>init();</script>
  //
  // Pattern 3 (Fetch):
  //   <script>
  //     fetch('data.json')
  //       .then(r => r.json())
  //       .then(data => { window.RAW = data; init(); });
  //   </script>

  fs.writeFileSync(OUTPUT_PATH, template, 'utf8');
  var sizeKb = (Buffer.byteLength(template, 'utf8') / 1024).toFixed(1);
  console.log('   ✅ Wrote ' + OUTPUT_PATH + ' (' + sizeKb + ' KB)');

  return OUTPUT_PATH;
}

// ─── Main orchestrator ──────────────────────────────────────────────────────
function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Dashboard Data Generator (with Caching)');
  console.log('═══════════════════════════════════════════════════════════');

  var RAW = null;

  // ─── Handle --html-only: rebuild HTML from existing cache ────────────────
  if (htmlOnly) {
    console.log('');
    console.log('📄 HTML-only mode: rebuilding from existing data.json');
    if (!fs.existsSync(DATA_PATH)) {
      console.error('ERROR: --html-only but data.json not found.');
      console.error('Run without flags first to generate data.');
      process.exit(1);
    }
    RAW = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    console.log('✅ Loaded ' + DATA_PATH);
  }
  // ─── Check cache first (unless --refresh) ──────────────────────────────
  else if (!refresh && !dataOnly) {
    var cached = checkCache();
    if (cached) {
      RAW = cached;
    }
  }

  // ─── If no cache hit, run queries ──────────────────────────────────────
  if (!RAW) {
    RAW = fetchData();
  }

  // ─── Write data.json (unless --html-only) ─────────────────────────────
  // data.json is plain JSON (not wrapped in "var RAW = ...").
  // Template loads it at runtime via fetch('data.json') and assigns to window.RAW
  if (!htmlOnly) {
    console.log('');
    console.log('💾 Writing cache file...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(RAW, null, 2), 'utf8');
    var dataSize = (fs.statSync(DATA_PATH).size / 1024).toFixed(1);
    console.log('   ✅ Wrote ' + DATA_PATH + ' (' + dataSize + ' KB)');
    console.log('   💡 Tip: Template loads this via fetch("data.json")');
  }

  // ─── Exit if --data-only ──────────────────────────────────────────────
  if (dataOnly) {
    console.log('');
    console.log('✅ Data generated (--data-only: skipping HTML build).');
    return;
  }

  // ─── Build dashboard.html (copies template, loads data.json at runtime) ──
  buildDashboard();

  // ─── Print summary ────────────────────────────────────────────────────
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ Complete!');
  console.log('');
  if (RAW._meta && RAW._meta.generated_at) {
    var age = formatAge(RAW._meta.generated_at);
    console.log('📊 Data as of: ' + new Date(RAW._meta.generated_at).toLocaleString() + ' (' + age + ')');
  }
  console.log('');
  console.log('Next: open dashboard.html in your browser');
  console.log('');
  console.log('Commands:');
  console.log('  Refresh data:      node generate-data.js --refresh');
  console.log('  Iterate HTML only: node generate-data.js --html-only');
  console.log('  Data only:         node generate-data.js --data-only');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
}

main();
