require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

async function migrate() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../../migrations/001_initial.sql'),
      'utf8'
    );
    await db.query(sql);
    console.log('Migration 001_initial.sql applied');

    // Seed default admin if not exists
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const existing = await db.query(
      'SELECT id FROM admin_users WHERE username = $1',
      [adminUsername]
    );
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await db.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        [adminUsername, hash]
      );
      console.log(`Admin user "${adminUsername}" created`);
    }

    console.log('Database ready');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
