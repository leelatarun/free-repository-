-- Lucky Reading Room - Initial Database Schema

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  seat_number INTEGER UNIQUE NOT NULL,
  section VARCHAR(20) NOT NULL CHECK (section IN ('AC', 'NON_AC')),
  price_per_hour DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  seat_id INTEGER REFERENCES seats(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  user_phone VARCHAR(15) NOT NULL,
  user_email VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')),
  payment_reference VARCHAR(100),
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED', 'COMPLETED')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_seat_date ON bookings (seat_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status, payment_status);

-- Seed: Insert all 96 seats (1-12 and 13-58 are AC, 59-96 are Non-AC)
INSERT INTO seats (seat_number, section, price_per_hour)
SELECT
  gs.n,
  CASE WHEN gs.n <= 58 THEN 'AC' ELSE 'NON_AC' END,
  CASE WHEN gs.n <= 58 THEN 50.00 ELSE 30.00 END
FROM generate_series(1, 96) AS gs(n)
ON CONFLICT (seat_number) DO NOTHING;
