---
name: html-client-config-schema
description: |
  Complete HTML/CSS/JavaScript configuration reference for HTML Client-Side Dashboard. RAW object shape, HTML structure, CSS classes, JavaScript patterns, Chart.js options.
---

# HTML Client-Side Configuration Schema

Complete reference for customizing HTML dashboard templates.

---

## HTML Structure

### Basic Container

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Title</title>
  <style>
    /* CSS goes here */
  </style>
</head>
<body>
  <div class="container">
    <!-- Content goes here -->
  </div>

  <script>
    // JavaScript goes here
  </script>
</body>
</html>
```

### Header Section

```html
<header>
  <h1>Dashboard Title</h1>
  <p class="subtitle">Dashboard description</p>
</header>
```

### Metrics/KPI Cards

```html
<div class="metrics-grid">
  <div class="metric-card">
    <div class="metric-label">Label</div>
    <div class="metric-value">$1,234,567</div>
    <div class="metric-change">↑ +12.5%</div>
  </div>
</div>
```

### Data Table

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th onclick="sortTable(0)">Column 1</th>
        <th onclick="sortTable(1)">Column 2</th>
      </tr>
    </thead>
    <tbody id="tableBody">
      <!-- Rows inserted by JavaScript -->
    </tbody>
  </table>
</div>
```

### Charts with Canvas

```html
<div class="chart-container">
  <h2>Chart Title</h2>
  <div class="chart-wrapper">
    <canvas id="myChart"></canvas>
  </div>
</div>
```

---

## CSS Patterns

### Root Color Variables

```css
:root {
  --primary: #3b82f6;        /* Main color */
  --success: #10b981;        /* Success/positive */
  --warning: #f59e0b;        /* Warning/attention */
  --danger: #ef4444;         /* Danger/error */
  --purple: #8b5cf6;         /* Secondary */
  --gray-50: #f9fafb;        /* Light gray */
  --gray-100: #f3f4f6;       /* Light gray 2 */
  --gray-200: #e5e7eb;       /* Light gray 3 */
  --gray-600: #4b5563;       /* Medium gray */
  --gray-900: #111827;       /* Dark gray */
}
```

### Responsive Grid

```css
/* Auto-responsive grid (1-4 columns based on screen size) */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Explicit breakpoints */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
```

### Card Style

```css
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}
```

### Table Styles

```css
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  cursor: pointer;  /* Clickable for sorting */
}

tbody tr:hover {
  background: var(--gray-50);
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--gray-200);
}
```

### Status Badge

```css
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.75rem;
}

.status-active {
  background: #d1fae5;  /* Light green */
  color: var(--success);
}

.status-inactive {
  background: var(--gray-100);
  color: var(--gray-600);
}
```

---

## JavaScript Patterns

### Data Source: `RAW` Object

HTML Client templates receive data via the `RAW` global object injected by `generate-data.js`. Never hard-code data in the template — always read from `RAW`:

```javascript
// RAW is injected by generate-data.js at the <!-- DATA_PLACEHOLDER --> point.
// Keys available depend on which queries were run in generate-data.js:
var kpis      = RAW.kpis;         // Array of { label, value, format }
var rows      = RAW.rows;         // Array of row objects from the table query
var trend     = RAW.trend;        // Array of { period, value } for time-series
var by_region = RAW.by_region;    // Array of { region, value } for bar charts
var dist      = RAW.distribution; // Array of { label, value } for pie/doughnut
var top       = RAW.top_items;    // Array of { name, value } for top-N rankings
var summary   = RAW.summary;      // { source, period, records, updated }
```

Template bootstrap pattern (at end of `<script>` block):

```javascript
var allData     = RAW.rows;          // full dataset for filter/sort operations
var currentData = allData.slice();   // mutable copy used by table functions
```

> All numeric fields in `RAW` are pre-coerced to JS numbers by `generate-data.js` via `num()`. You do not need to `parseFloat()` in the template.

### Render Table

```javascript
function renderTable() {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = currentData.map(row => `
    <tr>
      <td>${row.id}</td>
      <td>${row.name}</td>
      <td>$${row.revenue.toLocaleString()}</td>
      <td>${row.orders}</td>
      <td>
        <span class="status-badge ${
          row.status === 'Active' ? 'status-active' : 'status-inactive'
        }">
          ${row.status}
        </span>
      </td>
    </tr>
  `).join('');
}
```

### Filter Table

```javascript
function filterTable() {
  const statusFilter = document.getElementById('statusFilter').value;
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  currentData = allData.filter(row => {
    const statusMatch = !statusFilter || row.status === statusFilter;
    const searchMatch = !searchTerm || row.name.toLowerCase().includes(searchTerm);
    return statusMatch && searchMatch;
  });

  renderTable();
  updateMetrics();
}
```

### Sort Table

```javascript
let sortColumn = -1;
let sortAsc = true;

function sortTable(col) {
  if (sortColumn === col) {
    sortAsc = !sortAsc;  // Toggle direction
  } else {
    sortColumn = col;
    sortAsc = true;
  }

  const keys = ['id', 'name', 'revenue', 'orders'];
  currentData.sort((a, b) => {
    const aVal = a[keys[col]];
    const bVal = b[keys[col]];
    return sortAsc ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  renderTable();
}
```

### Export CSV

```javascript
function exportCSV() {
  const headers = ['ID', 'Name', 'Revenue', 'Orders', 'Status'];
  const rows = currentData.map(r => [r.id, r.name, r.revenue, r.orders, r.status]);

  let csv = headers.join(',') + '\n';
  rows.forEach(row => csv += row.join(',') + '\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dashboard-data.csv';
  a.click();
}
```

### Update Metrics

```javascript
function updateMetrics() {
  const total = allData.length;
  const filtered = currentData.length;
  const revenue = currentData.reduce((sum, r) => sum + r.revenue, 0);

  document.getElementById('totalMetric').textContent = total;
  document.getElementById('filteredMetric').textContent = filtered;
  document.getElementById('matchMetric').textContent = 
    ((filtered / total) * 100).toFixed(1) + '%';
  document.getElementById('revenueMetric').textContent = 
    '$' + revenue.toLocaleString();
}
```

---

## Chart.js Patterns

### Line Chart

```javascript
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [50000, 48000, 52000, 55000, 58000, 60000],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});
```

### Bar Chart

```javascript
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['North America', 'Europe', 'APAC', 'LATAM'],
    datasets: [{
      label: 'Sales',
      data: [500000, 450000, 380000, 170000],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});
```

### Pie/Doughnut Chart

```javascript
new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Product A', 'Product B', 'Product C'],
    datasets: [{
      data: [45, 35, 20],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});
```

### Horizontal Bar Chart

```javascript
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Acme Corp', 'Tech Inc', 'Global Ltd'],
    datasets: [{
      label: 'Revenue',
      data: [289000, 234000, 201000],
      backgroundColor: '#3b82f6'
    }]
  },
  options: {
    indexAxis: 'y',  // Makes it horizontal
    responsive: true,
    maintainAspectRatio: false
  }
});
```

---

## Event Handlers

### Filter on Select Change

```html
<select id="statusFilter" onchange="filterTable()">
  <option value="">All</option>
  <option value="Active">Active</option>
</select>
```

### Filter on Input Change

```html
<input type="text" id="searchInput" placeholder="Search..." onkeyup="filterTable()">
```

### Sort on Header Click

```html
<th onclick="sortTable(0)">Column 1 ↕</th>
```

### Button Click

```html
<button class="btn" onclick="exportCSV()">Export CSV</button>
```

---

## Common Customizations

### Add KPI Card

```html
<div class="metric-card">
  <div class="metric-label">Your Metric</div>
  <div class="metric-value">Your Value</div>
  <div class="metric-change">↑ +X%</div>
</div>
```

### Add Table Column

1. Add header:
```html
<th>New Column</th>
```

2. Add data cell in template:
```javascript
<td>${row.newField}</td>
```

### Add Filter

```html
<div class="control-group">
  <label for="regionFilter">Region</label>
  <select id="regionFilter" onchange="filterTable()">
    <option value="">All</option>
    <option value="North America">North America</option>
  </select>
</div>
```

### Change Chart Type

Update `type:` in Chart.js options:
- `'line'` → Line chart
- `'bar'` → Bar chart
- `'pie'` → Pie chart
- `'doughnut'` → Doughnut chart

---

## Browser DevTools Tips

### Debug Filtering

```javascript
// In browser console (F12):
currentData  // See filtered data
allData      // See original data
filterTable() // Trigger filter
```

### Check Metrics

```javascript
updateMetrics()  // Recalculate
```
---

**Version:** 1.0.0 (Lite)
**Last Updated:** 15 July 2026
**Author:** FDE Team
