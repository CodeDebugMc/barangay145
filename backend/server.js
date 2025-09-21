// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection (Pool)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",        // change if needed
  password: "",        // your MySQL password
  database: "brg145",  // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * ROOT
 */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Barangay 145 API 🚀" });
});

/**
 * RESIDENTS
 */
// Get all residents
app.get("/residents", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM residents ORDER BY resident_id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch residents" });
  }
});

// Add new resident
app.post("/residents", async (req, res) => {
  const { full_name, address, provincial_address, dob, age, civil_status, contact_no } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO residents 
        (full_name, address, provincial_address, dob, age, civil_status, contact_no) 
       VALUES (?,?,?,?,?,?,?)`,
      [full_name, address, provincial_address, dob, age, civil_status, contact_no]
    );
    res.json({ message: "Resident added", resident_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add resident" });
  }
});

/**
 * CERTIFICATES
 */
// Get all certificates
app.get("/certificates", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.certificate_id, r.full_name, c.purpose, c.date_issued, 
              c.validity_months, c.issued_by 
       FROM certificates c 
       JOIN residents r ON c.resident_id = r.resident_id 
       ORDER BY c.certificate_id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// Add new certificate
app.post("/certificates", async (req, res) => {
  const { resident_id, purpose, validity_months, issued_by } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO certificates 
        (resident_id, purpose, validity_months, issued_by) 
       VALUES (?,?,?,?)`,
      [resident_id, purpose, validity_months || 6, issued_by || "Barangay Chairman"]
    );
    res.json({ message: "Certificate created", certificate_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create certificate" });
  }
});

/**
 * USERS
 */
// Get all users (no passwords exposed)
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT user_id, username, role, created_at FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Add new user
app.post("/users", async (req, res) => {
  const { username, password_hash, role } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO users (username, password_hash, role) VALUES (?,?,?)`,
      [username, password_hash, role || "staff"]
    );
    res.json({ message: "User created", user_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

/**
 * START SERVER
 */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
