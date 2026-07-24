# JP EdTech - Student & Teacher Web Application

React/Vite frontend application for students and teachers on the JP EdTech platform.

## Features
- **Student Portal**: Home, Courses Browse, Course Details, Video Player, Cart, Checkout, My Courses.
- **Teacher Portal**: Course Creation, Section & SubSection Management, Instructor Courses List.
- **Authentication**: Login, Signup, OTP Verification, Password Reset.

## Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd frontend
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
