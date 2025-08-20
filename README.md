## Jobs API (Local, Self-Hosted)

Seeded REST API for jobs data (80 postings: 10 per category). No external API required. CORS enabled, so aap isse kahin se bhi call kar sakte ho.

### Categories
- Cybersecurity
- Data Science
- DevOps & Cloud
- Mobile Development
- Product Management
- Quality Assurance
- Software Development
- UI/UX Design

## Quick Start

### Prerequisites
- Node.js 18+ recommended

### Install & Run (Windows PowerShell)
```bash
npm install
npm start
```

Server: `http://localhost:3000`

Port change (PowerShell):
```bash
$env:PORT=4000; npm start
```

## Endpoints
- `GET /api/health` → basic health
- `GET /api/categories` → list of categories
- `GET /api/jobs` → paginated jobs
- `GET /api/jobs/:id` → single job by id (e.g., `CYB-001`)

### Query Params for /api/jobs
- `category` (exact match, case-insensitive)
- `city` (substring match)
- `employmentType` (`Full-time` | `Part-time`)
- `q` (search in title, company, description, skills)
- `limit` (default 50, max 100)
- `page` (default 1)

### Examples
```text
GET http://localhost:3000/api/jobs
GET http://localhost:3000/api/jobs?category=Data%20Science&limit=10
GET http://localhost:3000/api/jobs?city=Berlin&q=Python
GET http://localhost:3000/api/jobs?employmentType=Full-time&page=2
GET http://localhost:3000/api/jobs/CYB-001
```

## Data
- Source file: `data/jobs.json`
- Edit freely to customize dataset.

### Job Object Shape
```json
{
  "id": "CYB-001",
  "title": "Security Analyst",
  "category": "Cybersecurity",
  "company": "SecureShield",
  "description": "...",
  "city": "New York, NY",
  "postedDate": "2025-06-01",
  "employmentType": "Full-time",
  "skills": ["SIEM", "Linux", "Python"],
  "imageUrl": "https://picsum.photos/seed/CYB-001/800/600"
}
```

## Notes
- CORS enabled by default.
- No database — purely file-based for portability.
- Safe to deploy behind any Node hosting (PM2, Docker, etc.).


