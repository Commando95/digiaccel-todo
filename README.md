# Digiaccel SDE-1 Assessment — To-Do List App

A responsive To-Do List application developed as part of the Digiaccel SDE-1 (MERN Stack) assessment. The application allows users to manage tasks, track their status, search tasks, and monitor weekly progress through a mobile-friendly interface.

## Live Demo

- **Frontend:** https://delicate-gelato-37325e.netlify.app/
- **Backend API:** https://digiaccel-todo-api.onrender.com
- **API Health Check:** https://digiaccel-todo-api.onrender.com/api/health

> Note: The backend uses Render's free tier and may take additional time to respond after a period of inactivity.

## Features

- Create, edit, and delete tasks.
- Add task titles, descriptions, dates, times, and priorities.
- Update task status.
- Search tasks by title or description.
- Organize tasks into Monday–Sunday weeks.
- View task counts and weekly completion progress.
- Responsive, mobile-first user interface.
- REST API with MongoDB persistence.

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB
- MongoDB Atlas

**Deployment**
- Netlify for the frontend
- Render for the backend
- MongoDB Atlas for the database

## Project Structure

```text
digiaccel-todo/
├── client/          # React frontend
├── server/          # Express backend
├── .env.example     # Environment configuration example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

- Node.js and npm
- MongoDB locally or a MongoDB Atlas account
- Git

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Commando95/digiaccel-todo.git
cd digiaccel-todo
```

### 2. Install dependencies

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Configure environment variables

Create `server/.env` and configure the database connection:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/digiaccel_todo
```

For MongoDB Atlas, use your own Atlas connection string instead of the local MongoDB URI.

If the frontend requires a custom API URL, create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Keep environment files and database credentials private. Never commit secrets to the repository.

### 4. Run the application

From the project root, run:

```bash
npm run dev
```

If you prefer to start the applications separately, use two terminals.

Backend:

```bash
cd server
npm start
```

Frontend:

```bash
cd client
npm run dev
```

Open the frontend URL displayed by Vite, usually `http://localhost:5173`.

### 5. Verify the API

Local health check:

```text
http://localhost:5000/api/health
```

Production health check:

https://digiaccel-todo-api.onrender.com/api/health

## Testing and Build

Run the available test suite from the project root:

```bash
npm test
```

Build the frontend for production:

```bash
npm run build
```

## Deployment Configuration

### Frontend — Netlify

Production API environment variable:

```env
VITE_API_URL=https://digiaccel-todo-api.onrender.com/api
```

Vite reads environment variables during the build. Redeploy the frontend after changing this value.

### Backend — Render

Configure the backend environment variables in the Render dashboard, including the MongoDB connection string and the frontend origin required by the CORS configuration.

### Database — MongoDB Atlas

The deployed backend uses MongoDB Atlas for persistent task storage. Database credentials should be stored securely in the backend's environment variables.

## Assessment Scope

The application was developed to address the assessment requirements for task management, search, weekly organization, status tracking, responsive design, and backend API integration.

## Author

**Piyush Chittauria**

GitHub: https://github.com/Commando95

---

Developed for the Digiaccel SDE-1 (MERN Stack) assessment.
