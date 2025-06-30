# Talent Finder - Talent Tracking System

This project is a full-stack application with a React frontend and an Express backend using Prisma as ORM and a PostgreSQL database. It includes a candidate management feature for recruiters.

## Main Features

- **"Talent Finder" Dashboard**: Modern interface with a large title and logo.
- **Candidate Management**: Allows recruiters to add new candidates through a complete, validated form.
- **Resume Upload**: Supports PDF and DOCX files up to 5MB.
- **Notifications**: Immediate visual feedback after each action.
- **Responsive and Accessible Design**: Adapts to different screen sizes and uses high-contrast visuals.

## Directory and File Overview

- `backend/`: Server code (Node.js + Express + Prisma).
  - `src/`: Backend source code.
    - `index.ts`: Entry point and REST API.
    - `uploads/`: Folder where uploaded resumes are stored.
  - `prisma/`: Prisma ORM schema.
- `frontend/`: Client code (React).
  - `src/`: Frontend source code.
    - `App.tsx`: Main dashboard and candidate form.
    - `App.css`: High-contrast styles and modern design.
  - `public/`: Static files.
- `docker-compose.yml`: Docker Compose configuration for the PostgreSQL database.
- `README.md`: This file.

## Getting Started

1. Clone the repository.
2. Install dependencies for both frontend and backend:
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Set up your database and environment variables as needed for your local environment.
4. Run Prisma migrations:
```sh
cd backend
npx prisma migrate dev --name init
```
5. Start the backend:
```sh
cd backend
npm run dev
```
6. In a new terminal, start the frontend:
```sh
cd frontend
npm start
```

The backend will run at http://localhost:3010 and the frontend at http://localhost:3000.

### Development Proxy Setup
Make sure your `frontend/package.json` contains:
```json
"proxy": "http://localhost:3010"
```
This allows the frontend to forward `/api` requests to the backend during development.

## Using the Candidate Management Feature

1. Click the **Add Candidate** button on the "Talent Finder" dashboard.
2. Fill out the form with the following fields:
   - **First Name** (required)
   - **Last Name** (required)
   - **Email** (required, valid format)
   - **Job Title** (required)
   - **Address** (optional)
   - **Age** (optional, positive integer)
   - **Phone** (required, valid format)
   - **Education Level** (required, select from list)
   - **Salary Expectations** (required, number)
   - **Resume** (optional, PDF or DOCX, max 5MB)
3. Click **Submit**. You will receive a success or error notification.

## Backend: API and File Storage
- The main endpoint is `POST /api/candidates`.
- Resume files are stored in `backend/uploads/`.
- The backend validates all fields and file type/size.

## Docker and PostgreSQL

This project uses Docker for the PostgreSQL database:

1. Install Docker if you don't have it.
2. From the project root, run:
```sh
docker-compose up -d
```
3. To stop the database:
```sh
docker-compose down
```

## Security and Privacy
- All inputs are validated and sanitized.
- Only PDF/DOCX files are allowed for resumes.
- Ready for RBAC and sensitive field encryption (extend as needed).

---

Enjoy using Talent Finder to efficiently and securely manage candidates!