# Lucky Reading Room – Seat Booking System

A full-stack seat booking web app for a 96-seat reading room with interactive floor map, UPI payments, and an admin dashboard.

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS          |
| Backend   | Node.js + Express                       |
| Database  | PostgreSQL                              |
| Auth      | JWT (admin only)                        |
| Payments  | UPI (QR + deep link + UTR confirmation) |
| Deploy    | Vercel (frontend) + Railway (API + DB)  |

## Project Structure

```
/
├── client/          # React + Vite frontend
│   ├── public/
│   │   └── upi-qr.png        # Google Pay QR code
│   ├── src/
│   │   ├── components/       # Reusable UI
│   │   │   └── admin/        # Admin-only components
│   │   ├── hooks/            # useSeats, useAuth
│   │   ├── pages/            # Home, AdminLogin, AdminDashboard
│   │   └── utils/            # api.js, seatLayout.js
│   ├── vercel.json
│   └── .env.example
└── server/          # Express API
    ├── migrations/
    │   └── 001_initial.sql   # DB schema + seat seed
    ├── src/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   └── routes/
    ├── railway.json
    └── .env.example
```

## Seat Layout

The floor plan mirrors the physical reading room:

- **Seats 1–12**: Front row (A/C)
- **Seats 13–58**: A/C section (pods arranged in left/right clusters)
- **Seats 59–82**: Non-A/C section
- **Seats 83–96**: Back rows (Non-A/C)

Default pricing: **₹50/hr** (A/C) · **₹30/hr** (Non-A/C)

## Local Setup

### Prerequisites

- Node.js ≥ 18
- PostgreSQL 14+

### 1. Clone & install

```bash
git clone <repo-url>
cd lucky-reading-room

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure environment

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your DB credentials and JWT secret

# Client
cp client/.env.example client/.env
# VITE_API_URL is empty by default (Vite proxy handles it locally)
```

### 3. Set up the database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE lucky_reading_room;"

# Run migration + seed (creates tables + all 96 seats + default admin)
cd server && npm run migrate
```

Default admin credentials (set in `.env`):
- Username: `admin`
- Password: `admin123`

**Change these in production!**

### 4. Run locally

```bash
# Terminal 1 – Backend (port 5000)
cd server && npm run dev

# Terminal 2 – Frontend (port 5173)
cd client && npm run dev
```

Visit: http://localhost:5173

## API Endpoints

### Public

| Method | Path                              | Description               |
|--------|-----------------------------------|---------------------------|
| GET    | `/api/seats?date=YYYY-MM-DD`      | All seats + booking status |
| GET    | `/api/seats/:id?date=YYYY-MM-DD`  | Single seat               |
| POST   | `/api/bookings`                   | Create booking            |
| PATCH  | `/api/bookings/:id/confirm-payment` | Submit UTR reference    |
| GET    | `/api/bookings/:id`               | Get booking details       |
| GET    | `/api/health`                     | Health check              |

### Admin (requires JWT)

| Method | Path                        | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/api/auth/login`           | Admin login              |
| GET    | `/api/auth/verify`          | Verify token             |
| GET    | `/api/admin/dashboard`      | Stats overview           |
| GET    | `/api/admin/bookings`       | List bookings (paginated)|
| PATCH  | `/api/admin/bookings/:id`   | Update status/payment    |
| GET    | `/api/admin/seats`          | All seats with pricing   |
| PATCH  | `/api/admin/seats/pricing`  | Bulk update pricing      |

## Deployment

### Frontend → Vercel

1. Import the `client/` folder as a Vercel project
2. Set environment variable:  
   `VITE_API_URL=https://your-railway-backend.up.railway.app`
3. Build command: `npm run build` · Output dir: `dist`

### Backend → Railway

1. Create a new Railway project, link the `server/` folder
2. Add a PostgreSQL plugin – Railway auto-sets `DATABASE_URL`
3. Set environment variables from `server/.env.example`
4. Run migration: `npm run migrate` (one-time, via Railway's shell)
5. Start command is set in `railway.json`

## UPI Payment Flow

1. User selects a seat and fills in details
2. System creates a booking (status: PENDING)
3. Payment modal shows the Google Pay QR code + UPI ID (`9014463623@okbizaxis`)
4. User pays via any UPI app and gets a UTR/transaction ID
5. User submits the UTR – booking status updates to PAID
6. Admin can verify/override payment status from the dashboard

## Admin Features

- **Overview**: total seats, today's bookings, revenue, occupancy by section
- **Bookings**: searchable/filterable table; mark paid, cancel, complete
- **Pricing**: bulk update A/C / Non-A/C rates per hour
