# JP EdTech - Backend API Service

Express/Node.js REST API service for the JP EdTech platform providing authentication, course management, payments, and admin endpoints.

## Tech Stack
- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **JWT** (JSON Web Tokens) for Authentication
- **Cloudinary** for Media Uploads
- **Razorpay** for Payment Processing
- **Nodemailer** for Email Notifications & OTP

## Getting Started

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and update the required values.
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. (Optional) Seed initial admin user:
   ```bash
   npm run seed:admin
   ```

## Deployment
Deployable on Render, Railway, AWS, or DigitalOcean:
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: Configure all variables listed in `.env.example` in your hosting dashboard.
