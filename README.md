# HireTrack — Applicant Tracking System

A production-quality ATS built with React + Vite, Node.js + Express, and MongoDB.

## Quick Start

### Prerequisites

- Node.js ≥ 20
- MongoDB 7+ (local or Atlas)
- npm

### Backend

```bash
cd backend
cp .env.example .env   # Edit with your values
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

## Project Structure

```
hiretrack/
├── frontend/    # React + Vite
├── backend/     # Node.js + Express
├── .gitignore
├── .prettierrc
└── README.md
```

## Default Accounts

The first user to register is automatically assigned the **Admin** role.
All subsequent registrations default to **Recruiter**.
