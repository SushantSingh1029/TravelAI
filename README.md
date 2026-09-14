# TravelAI: Intelligent Itinerary Planner

TravelAI is a premium, full-stack web application designed to help users discover destinations, bookmark their favorite places, and automatically generate highly optimized, budget-aware travel itineraries using artificial intelligence. 

## Features
- **Destination Discovery**: Browse a rich catalog of global destinations and top attractions.
- **Trip Planning**: Generate dynamic, day-by-day itineraries based on travel dates, budget, number of travellers, and specific preferences (e.g., Beaches, Adventure).
- **Interactive Maps**: Full integration with React-Leaflet to visualize your entire trip routing and individual daily stops.
- **Budget Optimization**: Real-time tracking of estimated costs. If you exceed your budget, the built-in "Optimize Budget" engine intelligently replaces expensive activities with budget-friendly alternatives while preserving your favorite stops.
- **Surgical Edits**: Make precise changes (add, replace, or remove places) without losing the context of your entire generated trip.
- **Booking Engine**: Confirm your trips and track them securely in your personalized Booking History dashboard.

## Architecture & Tech Stack
TravelAI is built with a clean, strict separation between frontend and backend. 

### Frontend
- **Framework**: React + Vite
- **Styling**: Vanilla CSS (Global variables, flexbox/grid layouts, micro-animations)
- **Routing**: React Router DOM (v6)
- **Maps**: React-Leaflet
- **State**: Context API for global state (Auth, Favorites)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (motor asynchronous driver)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Data Validation**: Pydantic models
- **AI Integration**: Designed to interface directly with external LLMs for intelligent planning.

*Note: The architecture strictly avoids Node.js on the backend and uses a pure NoSQL (MongoDB) approach, with zero SQLAlchemy or PostgreSQL dependencies.*

## Folder Structure
```text
travel-planner/
├── .venv/                   # Python Virtual Environment
├── backend/
│   ├── config/              # Settings, MongoDB setup
│   ├── controllers/         # API Routers (Auth, Trips, Bookings, Destinations)
│   ├── middlewares/         # JWT Auth dependency
│   ├── models/              # Pydantic schemas
│   ├── services/            # AI logic, Auth helpers
│   └── app.py               # FastAPI entry point
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI (Cards, Modals, Itinerary timeline)
│   │   ├── context/         # Auth & Favorites Context
│   │   ├── pages/           # Dashboard, Plan Tour, Profile, etc.
│   │   ├── services/        # Axios API configurations
│   │   ├── App.jsx          # Route definitions
│   │   ├── App.css          # Global Component CSS
│   │   └── index.css        # Core Design Tokens & Animations
│   └── package.json
└── .env.example             # Template for secrets
```

## Setup & Local Development

This project requires **Python 3.10+** and **Node.js 18+**.

### 1. Database Setup
Ensure you have MongoDB running locally on the default port (`27017`) or have a valid MongoDB Atlas URI.

### 2. Environment Variables
Copy the `.env.example` file to `.env` in the root directory:
```bash
cp .env.example .env
```
Update the `.env` file with your actual secrets (e.g., `JWT_SECRET`, `AI_API_KEY`).

### 3. Backend Setup
Create and activate the virtual environment at the root of the project:

**Windows**:
```powershell
python -m venv .venv
.\.venv\Scripts\activate
```

**MacOS/Linux**:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the dependencies:
```bash
pip install "fastapi[all]" motor pydantic-settings passlib bcrypt python-jose
```

Start the FastAPI development server:
```bash
python -m uvicorn backend.app:app --reload --port 8000
```
*API Documentation (Swagger) will be available at: http://localhost:8000/docs*

### 4. Frontend Setup
Open a new terminal session, navigate to the frontend directory, and start Vite:

```bash
cd frontend
npm install
npm run dev
```
*The React app will be available at: http://localhost:5173*

## Testing
- Ensure the backend is running on `port 8000`.
- Ensure MongoDB is actively listening on `port 27017`.
- Sign up with a new user account through the frontend to verify end-to-end connectivity.
- Verify map functionality by ensuring the Leaflet CSS is properly imported (handled inside `Map.css`).

> **Disclaimer**: This is a portfolio/development project. Do not commit your `.env` files or deploy this specific configuration directly to production without hardening the CORS policies and rotating the JWT secrets.
