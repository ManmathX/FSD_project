# NexusTech E-Commerce Platform

A modern, full-stack e-commerce application built with a React frontend and an Express/SQLite backend. It features a professional "shining blue and white" UI theme, product listing, cart management, and checkout simulation. 

## 🚀 Tech Stack

### Frontend
- **React 19** & **Vite** for fast development and optimized builds
- **Lucide React** for beautiful icons
- **React Hot Toast** for seamless notifications
- **Jest & React Testing Library** for component testing
- **Nginx** for production static asset serving and API proxying

### Backend
- **Node.js** & **Express** for the REST API
- **Better-SQLite3** for lightweight, robust data storage
- **Jest & Supertest** for API endpoint testing
- **PM2** for production process management

### DevOps & Deployment
- **Docker & Docker Compose** for containerized local development and deployment
- **GitHub Actions** CI/CD pipeline (Linting, Testing, Building, Docker Image validation)
- Production-ready configurations tailored for **Render** deployments

## 📦 Project Structure

```text
FSD_project/
├── frontend/       # React application (Vite, CSS Modules, Nginx config)
├── backend/        # Express API (SQLite DB, PM2 config)
├── .github/        # GitHub Actions CI/CD workflows
└── docker-compose.yml
```

## 🛠️ Running Locally (Without Docker)

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
The backend API will run on `http://localhost:3002` (or the port specified in your environment) and automatically seed the SQLite database on the first run.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The React app will be available at `http://localhost:5173`.

## 🐳 Running with Docker

To run the entire full-stack application using Docker Compose:

```bash
docker-compose up --build
```

- **Frontend:** `http://localhost:8080`
- **Backend API:** internally proxied and running on port 80

## 🧪 Testing

Both the frontend and backend feature comprehensive test suites.

**Frontend Tests:**
```bash
cd frontend
npm test
```

**Backend Tests:**
```bash
cd backend
npm test
```

## ☁️ Deployment (Render)

This application is configured for easy deployment on [Render](https://render.com/).

1. **Backend (Web Service):** Point Render to the `backend/` directory. The included `Dockerfile` uses PM2 (`pm2-runtime`) and exposes port 80.
2. **Frontend (Static Site / Web Service):** Point Render to the `frontend/` directory. You can use the included `Dockerfile` (which utilizes Nginx) to serve the built static assets and proxy API requests.
