# jija

> Production-grade personal portfolio and CMS application engineered for **Shubham Sharma**.

## 🚀 Overview

Full-stack portfolio featuring modern systems architecture, autonomous agentic workflows, dynamic project showcases, and a secure administrative command center.

- **Framework**: Next.js 14 (App Router) with TypeScript & React 18
- **Styling**: Tailwind CSS & Framer Motion
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: NextAuth.js (Credentials & Google OAuth 2.0)
- **CMS**: Admin dashboard with CRUD operations for projects, skills, certificates, and site settings

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon serverless PostgreSQL)

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```
Fill in your database URL, NextAuth secret, and OAuth credentials.

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Seeding
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
