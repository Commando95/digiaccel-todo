# Daymark — Digiaccel SDE-1 To-Do Assessment

A mobile-first MERN task planner for the Digiaccel SDE-1 assignment.

## Features
- Responsive mobile-first UI based on the supplied Figma screenshot: blue accent, weekly date strip, task summary tiles, weekly progress, today's tasks and floating add button.
- Create, edit and delete tasks.
- Required title and due date/time; optional description and Low/Medium/High priority.
- In Progress and Completed status toggle.
- Search by task title or description.
- Weekly grouping/progress logic based on Monday–Sunday weeks.
- Express REST API and MongoDB persistence.

## Requirements
- Node.js 20+ recommended
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup
1. Extract the archive and open the project directory in a terminal.
2. Install packages:
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```
3. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`. For local MongoDB:
   ```dotenv
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/todoapp
   ```
4. Start both apps from the root directory:
   ```bash
   npm run dev
   ```
5. Open the Vite URL printed in the terminal (normally `http://localhost:5173`). API health check: `http://localhost:5000/api/health`.

## Tests and production build
```bash
npm test
npm run build
```

## API
- `GET /api/tasks` — list tasks; accepts optional `?search=` query
- `POST /api/tasks` — create task
- `PATCH /api/tasks/:id` — update task
- `DELETE /api/tasks/:id` — delete task
- `GET /api/health` — health check

## Submission notes
Before submitting, run the app locally, verify all task flows, check the Figma reference at mobile size, and commit only source files. Never commit `.env` or database credentials.
