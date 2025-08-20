'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'data', 'jobs.json');

function readJobs() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const jobs = JSON.parse(raw);
  return jobs;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/categories', (req, res) => {
  const jobs = readJobs();
  const categories = Array.from(new Set(jobs.map(j => j.category))).sort();
  res.json(categories);
});

app.get('/api/jobs', (req, res) => {
  const jobs = readJobs();
  const { category, city, q, employmentType, limit, page } = req.query;

  let filtered = jobs;
  if (category) {
    filtered = filtered.filter(j => j.category.toLowerCase() === String(category).toLowerCase());
  }
  if (city) {
    filtered = filtered.filter(j => j.city.toLowerCase().includes(String(city).toLowerCase()));
  }
  if (employmentType) {
    filtered = filtered.filter(j => j.employmentType.toLowerCase() === String(employmentType).toLowerCase());
  }
  if (q) {
    const needle = String(q).toLowerCase();
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(needle) ||
      j.company.toLowerCase().includes(needle) ||
      j.description.toLowerCase().includes(needle) ||
      j.skills.join(' ').toLowerCase().includes(needle)
    );
  }

  const pageNum = Math.max(1, parseInt(page || '1', 10));
  const pageSize = Math.max(1, Math.min(100, parseInt(limit || '50', 10)));
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;

  res.json({
    total: filtered.length,
    page: pageNum,
    limit: pageSize,
    results: filtered.slice(start, end),
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const jobs = readJobs();
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

function startServer(port, attempt = 0) {
  const server = app.listen(port, () => {
    console.log(`Jobs API listening on http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attempt < 10) {
      const nextPort = port + 1;
      console.warn(`Port ${port} in use; retrying on ${nextPort}...`);
      startServer(nextPort, attempt + 1);
    } else {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  });
}

startServer(Number(PORT));


