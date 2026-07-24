# JP EdTech - Dedicated Admin Portal

React/Vite application for administrative control over the JP EdTech platform.

## Features
- **Admin Dashboard**: Overview metrics for courses, users, and transactions.
- **Course Management**: Approve, edit, delete, or organize platform courses.
- **Category Management**: Create, edit, and organize course categories.
- **User & Instructor Management**: Manage permissions, accounts, and instructor approvals.
- **Admin Quiz Management**: Create and manage quizzes.

## Getting Started

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and set `VITE_API_URL`.
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Production Build:
   ```bash
   npm run build
   ```

## Deployment
Deployable on Vercel, Netlify, or Cloudflare Pages:
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `VITE_API_URL`
