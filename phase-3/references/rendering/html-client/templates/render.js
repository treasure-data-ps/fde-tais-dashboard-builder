/**
 * render.js — Dashboard rendering logic
 *
 * ⚠️ RUNTIME: This script executes in the CUSTOMER's browser. It has NO DATABASE ACCESS.
 * It only reads the RAW data object already embedded in the page (from generate-data.js).
 *
 * This script is responsible for:
 * 1. Loading data from data_json files or queries
 * 2. Parsing and transforming data for visualization
 * 3. Rendering charts, tables, and KPI cards
 * 4. Handling user interactions (filters, exports, tabs)
 *
 * Data security: All sensitive data is loaded at runtime from data_json files.
 * The agent never embeds actual customer data in this script.
 *
 * Note: See generate-data.js for BUILD TIME behavior (runs on FDE's machine, has DB access).
 */

// Global configuration (populated by dashboard.html environment)
const CONFIG = {
    title: 'Dashboard',
    description: 'Custom Dashboard',
    lastUpdated: new Date().toISOString(),
    charts: {},
};

// Chart registry — destroy before recreating to prevent memory leaks
// Usage: destroyChart('myChartId'); new Chart(document.getElementById('myChartId'), ...);
var charts = {};
function destroyChart(id) {
  if (charts[id]) { charts[id].destroy(); delete charts[id]; }
}

// Extract unique values for a key from a row array — used to populate filter <select> options
// Usage: var channels = distinct(RAW.sales_rows, 'channel');
function distinct(rows, key) {
  var seen = {};
  return rows.filter(function(r) {
    var v = r[key];
    if (seen[v]) return false;
    seen[v] = true;
    return true;
  }).map(function(r) { return r[key]; }).sort();
}

// Populate a <select> element from a values array; prepends "All" option
// Usage: populateSelect(document.getElementById('channelFilter'), channels);
function populateSelect(selectEl, values) {
  selectEl.innerHTML = '<option value="All">All</option>';
  values.forEach(function(v) {
    var opt = document.createElement('option');
    opt.value = v; opt.textContent = v;
    selectEl.appendChild(opt);
  });
}

// Render a KPI card HTML string with optional tooltip and sub-label
// Usage: container.innerHTML += kpiCard('Revenue', '$1.2M', 'Total gross revenue', '+5% vs last month');
function kpiCard(label, value, tooltip, sub) {
  return '<div class="kpi-card"' + (tooltip ? ' title="' + escapeHtml(tooltip) + '"' : '') + '>' +
    '<div class="label">' + escapeHtml(label) + '</div>' +
    '<div class="value">' + escapeHtml(String(value)) + '</div>' +
    (sub ? '<div class="sub">' + escapeHtml(sub) + '</div>' : '') +
    '</div>';
}

/**
 * Initialize dashboard on page load
 * Load data and render all tabs
 *
 * ⚠️ CRITICAL ERROR HANDLING: Each tab's rendering is wrapped in safeInit()
 * to prevent cascading failures. If one tab's init throws, other tabs still render.
 * Without this, a single tab error aborts the entire script and leaves blank UI.
 *
 * Data range pattern: wire date filter inputs + banner to RAW.data_start / RAW.data_end
 * so the customer sees actual data bounds, not hardcoded placeholder dates.
 * Example:
 *   var dateStart = document.getElementById('dateStart');
 *   var dateEnd   = document.getElementById('dateEnd');
 *   dateStart.min = dateEnd.min = RAW.data_start;
 *   dateStart.max = dateEnd.max = RAW.data_end;
 *   dateStart.value = RAW.data_start;
 *   dateEnd.value   = RAW.data_end;
 *   document.getElementById('dataBanner').textContent =
 *     'Data available: ' + RAW.data_start + ' → ' + RAW.data_end;
 */
async function initializeDashboard() {
    try {
        // Load data from data_json files (or queries)
        const overviewData = await loadData('overview');
        const dimensionData = await loadData('dimensions');
        const timeSeriesData = await loadData('timeseries');
        const rawData = await loadData('rawdata');

        // Render each tab with error boundary
        await safeInit('Overview', () => renderTab(0, overviewData));
        await safeInit('Dimensions', () => renderTab(1, dimensionData));
        await safeInit('Time Series', () => renderTab(2, timeSeriesData));
        await safeInit('Raw Data', () => renderTab(3, rawData));

        // Update last updated timestamp
        document.getElementById('lastUpdated').textContent =
            `Last updated: ${new Date(CONFIG.lastUpdated).toLocaleString()}`;
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showError('Failed to load dashboard: ' + error.message);
    }
}

/**
 * Error boundary wrapper — prevents one tab's failure from cascading
 * Logs tab name + error, continues with remaining tabs
 */
async function safeInit(tabName, initFn) {
    try {
        initFn();
        console.log('✓ Initialized: ' + tabName);
    } catch (error) {
        console.error('✗ Failed to initialize ' + tabName + ':', error);
        // Tab remains in its previous state (error message or loading state)
        // Other tabs continue rendering
    }
}

/**
 * Load data from data_json file or query
 * @param {string} dataType - Type of data (overview, dimensions, timeseries, rawdata)
 * @returns {Promise<Object>} Parsed data
 */
async function loadData(dataType) {
    try {
        // Try to load from data_json file first (pre-computed)
        const response = await fetch(`data_${dataType}.json`);
        if (response.ok) {
            return await response.json();
        }

        // Fallback: return empty structure
        console.warn(`No data_${dataType}.json found, using empty structure`);
        return getEmptyDataStructure(dataType);
    } catch (error) {
        console.error(`Error loading ${dataType} data:`, error);
        return getEmptyDataStructure(dataType);
    }
}

/**
 * Get empty data structure for a tab type
 */
function getEmptyDataStructure(dataType) {
    const structures = {
        overview: { metrics: [] },
        dimensions: { breakdown: [] },
        timeseries: { series: [] },
        rawdata: { rows: [] }
    };
    return structures[dataType] || {};
}

/**
 * Render a specific tab
 * @param {number} tabIndex - Tab index (0-3)
 * @param {Object} data - Data to render
 */
function renderTab(tabIndex, data) {
    const containers = [
        'overviewContent',
        'dimensionContent',
        'timeSeriesContent',
        'rawDataContent'
    ];

    const container = document.getElementById(containers[tabIndex]);
    if (!container) return;

    try {
        switch (tabIndex) {
            case 0:
                renderOverview(container, data || {});
                break;
            case 1:
                renderDimensions(container, data || {});
                break;
            case 2:
                renderTimeSeries(container, data || {});
                break;
            case 3:
                renderRawData(container, data || {});
                break;
        }
    } catch (error) {
        console.error(`Error rendering tab ${tabIndex}:`, error);
        container.innerHTML = `<div class="error">Error rendering tab: ${error.message}</div>`;
    }
}

/**
 * Render Overview tab
 * Displays KPI cards with key metrics
 */
function renderOverview(container, data) {
    if (!data.metrics || data.metrics.length === 0) {
        container.innerHTML = '<div class="error">No overview data available</div>';
        return;
    }

    const kpiGrid = document.createElement('div');
    kpiGrid.className = 'kpi-grid';

    data.metrics.forEach(metric => {
        const card = document.createElement('div');
        card.className = 'kpi-card';
        card.innerHTML = `
            <div class="label">${escapeHtml(metric.label || 'Metric')}</div>
            <div class="value">${formatValue(metric.value, metric.format)}</div>
            ${metric.change ? `<div style="font-size: 12px; margin-top: 8px;">${metric.change}</div>` : ''}
        `;
        kpiGrid.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(kpiGrid);
}

/**
 * Render Dimension breakdown tab
 * Displays bar/pie charts by dimension
 */
function renderDimensions(container, data) {
    if (!data.breakdown || data.breakdown.length === 0) {
        container.innerHTML = '<div class="error">No dimension data available</div>';
        return;
    }

    let html = '';

    // Group by dimension
    const dimensionGroups = {};
    data.breakdown.forEach(item => {
        const dim = item.dimension || 'Other';
        if (!dimensionGroups[dim]) dimensionGroups[dim] = [];
        dimensionGroups[dim].push(item);
    });

    // Render each dimension as a chart
    Object.entries(dimensionGroups).forEach(([dimension, items]) => {
        const chartId = `chart_${dimension.replace(/\s+/g, '_')}`;
        html += `
            <div style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px; font-size: 16px; color: #333;">By ${escapeHtml(dimension)}</h3>
                <div class="chart-container">
                    <canvas id="${chartId}"></canvas>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Render charts
    Object.entries(dimensionGroups).forEach(([dimension, items]) => {
        const chartId = `chart_${dimension.replace(/\s+/g, '_')}`;
        const ctx = document.getElementById(chartId);
        if (ctx) {
            renderBarChart(ctx, items);
        }
    });
}

/**
 * Render Time Series tab
 * Displays line chart of metrics over time
 */
function renderTimeSeries(container, data) {
    if (!data.series || data.series.length === 0) {
        container.innerHTML = '<div class="error">No time series data available</div>';
        return;
    }

    const chartHtml = `
        <h3 style="margin-bottom: 15px; font-size: 16px; color: #333;">Trend over time</h3>
        <div class="chart-container">
            <canvas id="timeSeriesChart"></canvas>
        </div>
    `;

    container.innerHTML = chartHtml;

    const ctx = document.getElementById('timeSeriesChart');
    if (ctx) {
        renderLineChart(ctx, data.series);
    }
}

/**
 * Render Raw Data tab
 * Displays data in table format with export option
 */
function renderRawData(container, data) {
    if (!data.rows || data.rows.length === 0) {
        container.innerHTML = '<div class="error">No raw data available</div>';
        return;
    }

    const columns = Object.keys(data.rows[0] || {});
    let tableHtml = '<table><thead><tr>';

    columns.forEach(col => {
        tableHtml += `<th>${escapeHtml(col)}</th>`;
    });

    tableHtml += '</tr></thead><tbody>';

    data.rows.forEach(row => {
        tableHtml += '<tr>';
        columns.forEach(col => {
            tableHtml += `<td>${escapeHtml(formatValue(row[col]))}</td>`;
        });
        tableHtml += '</tr>';
    });

    tableHtml += '</tbody></table>';
    tableHtml += '<button class="export-button" onclick="exportTableAsCSV()">Export as CSV</button>';

    container.innerHTML = '<div class="table-container">' + tableHtml + '</div>';
}

/**
 * Render a bar chart
 */
function renderBarChart(ctx, data) {
    const labels = data.map(item => item.label || item.dimension || 'Item');
    const values = data.map(item => item.value || 0);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Value',
                data: values,
                backgroundColor: 'rgba(102, 126, 234, 0.7)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Render a line chart
 */
function renderLineChart(ctx, data) {
    const labels = data.map(item => item.date || item.timestamp || 'Date');
    const values = data.map(item => item.value || 0);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Value',
                data: values,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Format a value for display
 */
function formatValue(value, format) {
    if (value === null || value === undefined) return '-';
    if (value === 0) return '0';

    if (format === 'currency') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value);
    }

    if (format === 'percent') {
        return (parseFloat(value) * 100).toFixed(1) + '%';
    }

    if (typeof value === 'number') {
        return new Intl.NumberFormat('en-US').format(Math.round(value));
    }

    return String(value);
}

/**
 * Escape HTML to prevent injection
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Show error message
 */
function showError(message) {
    const containers = ['overviewContent', 'dimensionContent', 'timeSeriesContent', 'rawDataContent'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
        }
    });
}

/**
 * Export table as CSV
 */
function exportTableAsCSV() {
    const table = document.querySelector('table');
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const cells_array = Array.from(cells).map(cell => `"${cell.textContent}"`);
        csv.push(cells_array.join(','));
    });

    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}
