#!/usr/bin/env node

/**
 * generate-data-unified.js
 *
 * Generates data.json for the unified Treasure Data dashboard template.
 *
 * Usage:
 *   SOURCE_DB=your_db node generate-data-unified.js
 *   OR
 *   SINK_DB=your_sink_db node generate-data-unified.js
 *
 * The script queries TD, transforms data into the required format, and either:
 * - Inlines data into unified-dashboard.html (< 2MB)
 * - Creates separate data.json (> 2MB)
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const SOURCE_DB = process.env.SOURCE_DB || process.env.SINK_DB || 'default';
const OUTPUT_DIR = process.env.OUTPUT_DIR || './';
const LIMIT = parseInt(process.env.LIMIT || '10000');
const INLINE_THRESHOLD = 2 * 1024 * 1024; // 2 MB

console.log(`[INFO] Generating unified dashboard data from database: ${SOURCE_DB}`);

// ============================================================================
// QUERIES - Customize these for your data
// ============================================================================

const queries = {
  // KPI Metrics Query
  metrics: `
    SELECT
      SUM(amount) AS "Total Revenue",
      COUNT(*) AS "Order Count",
      COUNT(DISTINCT customer_id) AS "Active Customers",
      AVG(amount) AS "Avg Order Value"
    FROM ${SOURCE_DB}.orders
    WHERE date >= CURRENT_DATE - INTERVAL 90 DAY
    LIMIT 1
  `,

  // Chart Data Query (trends + categories)
  chartData: `
    SELECT
      DATE_FORMAT(order_date, '%b') AS label,
      order_date AS date,
      SUM(amount) AS value,
      region AS category,
      SUM(amount) AS amount
    FROM ${SOURCE_DB}.orders
    WHERE date >= CURRENT_DATE - INTERVAL 90 DAY
    GROUP BY DATE_FORMAT(order_date, '%b'), order_date, region
    ORDER BY order_date
    LIMIT ${LIMIT}
  `,

  // Detailed Rows Query (for table)
  rows: `
    SELECT
      order_id AS id,
      order_date,
      customer_name,
      region,
      order_status AS status,
      amount AS revenue,
      item_count AS items,
      rating
    FROM ${SOURCE_DB}.orders
    WHERE date >= CURRENT_DATE - INTERVAL 90 DAY
    ORDER BY order_date DESC
    LIMIT ${LIMIT}
  `
};

// ============================================================================
// Helper: Execute tdx query
// ============================================================================

async function runQuery(sql) {
  try {
    const command = `tdx query --output json --limit ${LIMIT} << 'EOF'\n${sql}\nEOF`;
    console.log(`[QUERY] Executing...`);

    const { stdout } = await execAsync(command, { timeout: 60000 });
    const rows = JSON.parse(stdout);

    console.log(`[SUCCESS] Query returned ${rows.length} rows`);
    return rows;
  } catch (error) {
    console.error(`[ERROR] Query failed:`, error.message);
    throw error;
  }
}

// ============================================================================
// Transform data into dashboard format
// ============================================================================

function transformMetrics(rows) {
  if (rows.length === 0) return {};

  const row = rows[0];
  const metrics = {};

  // Convert numeric strings to numbers
  Object.entries(row).forEach(([key, value]) => {
    if (typeof value === 'string' && !isNaN(value)) {
      metrics[key] = parseFloat(value);
    } else {
      metrics[key] = value;
    }
  });

  return metrics;
}

function transformChartData(rows) {
  return rows.map(row => ({
    label: row.label || row.date,
    date: row.date || row.label,
    value: parseFloat(row.value),
    category: row.category || row.region,
    amount: parseFloat(row.amount)
  }));
}

function transformRows(rows) {
  return rows.map(row => {
    const transformed = {};
    Object.entries(row).forEach(([key, value]) => {
      if (typeof value === 'string' && !isNaN(value) && value !== '') {
        transformed[key] = parseFloat(value);
      } else {
        transformed[key] = value;
      }
    });
    return transformed;
  });
}

// ============================================================================
// Build dashboard data object
// ============================================================================

async function buildDashboardData() {
  console.log('\n=== Building Dashboard Data ===\n');

  try {
    // Execute queries in parallel
    console.log('[FETCHING] Running queries...');
    const [metricsRows, chartDataRows, dataRows] = await Promise.all([
      runQuery(queries.metrics),
      runQuery(queries.chartData),
      runQuery(queries.rows)
    ]);

    // Transform data
    console.log('[TRANSFORMING] Converting to dashboard format...');
    const dashboardData = {
      metrics: transformMetrics(metricsRows),
      chartData: transformChartData(chartDataRows),
      rows: transformRows(dataRows)
    };

    return dashboardData;
  } catch (error) {
    console.error('\n[FATAL] Failed to build dashboard data:', error);
    process.exit(1);
  }
}

// ============================================================================
// Write output
// ============================================================================

async function writeOutput(dashboardData) {
  const dataStr = JSON.stringify(dashboardData, null, 2);
  const dataSize = Buffer.byteLength(dataStr, 'utf8');

  console.log(`\n=== Output ===\n`);
  console.log(`Data size: ${(dataSize / 1024 / 1024).toFixed(2)} MB`);

  if (dataSize < INLINE_THRESHOLD) {
    console.log('[INLINE] Data is small, embedding in HTML...');
    await writeInlineHTML(dashboardData);
  } else {
    console.log('[SEPARATE] Data is large, creating separate data.json...');
    await writeDataJSON(dashboardData);
  }
}

async function writeInlineHTML(dashboardData) {
  const templatePath = path.join(OUTPUT_DIR, 'unified-dashboard.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  // Inject data before closing body tag
  const dataScript = `<script>var RAW = ${JSON.stringify(dashboardData)};</script>\n`;
  html = html.replace('</body>', `  ${dataScript}</body>`);

  const outputPath = path.join(OUTPUT_DIR, 'dashboard.html');
  fs.writeFileSync(outputPath, html);
  console.log(`\n✅ Created: ${outputPath}`);
  console.log(`   File size: ${(Buffer.byteLength(html, 'utf8') / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\n📊 Open in browser: file://${path.resolve(outputPath)}`);
}

async function writeDataJSON(dashboardData) {
  const jsonPath = path.join(OUTPUT_DIR, 'data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(dashboardData, null, 2));
  console.log(`\n✅ Created: ${jsonPath}`);

  // Note: For large dashboards, also need to update unified-dashboard.html to fetch data.json
  console.log(`\n📝 Important: For large dashboards, you need to:`);
  console.log(`   1. Copy unified-dashboard.html to dashboard.html`);
  console.log(`   2. Modify it to: fetch('data.json').then(r => r.json()).then(d => { window.RAW = d; init(); })`);
  console.log(`   3. Run with local server: npx serve .`);
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('Treasure Data Unified Dashboard Generator\n');

  const dashboardData = await buildDashboardData();
  await writeOutput(dashboardData);

  console.log('\n✨ Dashboard generation complete!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
