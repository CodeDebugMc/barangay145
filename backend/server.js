// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");



const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json())




// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.user = {
      user_id: user.user_id,
      username: user.username,
      name: user.name,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    
    next();
  };
};

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
 * INDIGENCY CRUD
 */

// GET all active indigency records
app.get("/indigency", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         indigency_id, resident_id, full_name, address, provincial_address, dob, age, civil_status, contact_no, request_reason, remarks, date_issued, date_created, date_updated, is_active
       FROM indigency
       WHERE is_active = TRUE
       ORDER BY indigency_id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch indigency records" });
  }
});

// GET single record by ID
app.get("/indigency/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT 
         indigency_id, resident_id, full_name, address, provincial_address, dob, age, civil_status, contact_no, request_reason, remarks, date_issued, date_created, date_updated, is_active
       FROM indigency
       WHERE indigency_id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Record not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch record" });
  }
});

// CREATE new record
app.post("/indigency", async (req, res) => {
  try {
    const { resident_id, full_name, address, provincial_address, dob, age, civil_status, contact_no, request_reason, remarks, date_issued } = req.body;

    // Basic validation
    if (!resident_id || !full_name || !address || !dob || !Number.isFinite(Number(age)) || !civil_status || !request_reason || !date_issued) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert record
    const [result] = await pool.query(
      `INSERT INTO indigency 
        (resident_id, full_name, address, provincial_address, dob, age, civil_status, contact_no, request_reason, remarks, date_issued)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [resident_id, full_name, address, provincial_address || null, dob, Number(age), civil_status, contact_no || null, request_reason, remarks || null, date_issued]
    );

    // Fetch newly created record
    const [rows] = await pool.query(`SELECT * FROM indigency WHERE indigency_id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create record" });
  }
});

// UPDATE existing record
app.put("/indigency/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { resident_id, full_name, address, provincial_address, dob, age, civil_status, contact_no, request_reason, remarks, date_issued } = req.body;

    if (!full_name || !address || !dob || !Number.isFinite(Number(age)) || !civil_status || !request_reason || !date_issued) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await pool.query(
      `UPDATE indigency
       SET resident_id = ?, full_name = ?, address = ?, provincial_address = ?, dob = ?, age = ?, civil_status = ?, contact_no = ?, request_reason = ?, remarks = ?, date_issued = ?, date_updated = NOW()
       WHERE indigency_id = ?`,
      [resident_id, full_name, address, provincial_address, dob, Number(age), civil_status, contact_no, request_reason, remarks, date_issued, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "Record updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update record" });
  }
});


// DELETE indigency record
app.delete("/indigency/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE indigency
       SET is_active = FALSE, date_updated = NOW()
       WHERE indigency_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete record" });
  }
});







/**
 * REQUEST RECORDS (Barangay Clearance/Indigency UI CRUD)
 */
app.get("/request-records", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, address, birthday, age, provincial_address, contact_no, civil_status, request_reason, date_issued, date_created, date_updated, is_active
       FROM request_records
       WHERE is_active = TRUE
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

app.get("/request-records/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT id, name, address, birthday, age, provincial_address, contact_no, civil_status, request_reason, date_issued, date_created, date_updated, is_active
       FROM request_records WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Record not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch record" });
  }
});

app.post("/request-records", async (req, res) => {
  try {
    const { name, address, birthday, age, provincial_address, contact_no, civil_status, request_reason, date_issued } = req.body;

    if (!name || !address || !birthday || !Number.isFinite(Number(age)) || !civil_status || !request_reason || !date_issued) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await pool.query(
      `INSERT INTO request_records (name, address, birthday, age, provincial_address, contact_no, civil_status, request_reason, date_issued)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [name, address, birthday, Number(age), provincial_address || null, contact_no || null, civil_status, request_reason, date_issued]
    );

    const [rows] = await pool.query(`SELECT * FROM request_records WHERE id = ?`, [result.insertId]);
    res.status(201).json({ id: result.insertId, ...rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create record" });
  }
});

app.put("/request-records/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, birthday, age, provincial_address, contact_no, civil_status, request_reason, date_issued, is_active } = req.body;

    const [result] = await pool.query(
      `UPDATE request_records SET 
        name = ?, address = ?, birthday = ?, age = ?, provincial_address = ?, contact_no = ?, civil_status = ?, request_reason = ?, date_issued = ?, is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [name, address, birthday, Number(age), provincial_address || null, contact_no || null, civil_status, request_reason, date_issued, is_active, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update record" });
  }
});

app.delete("/request-records/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM request_records WHERE id = ?`, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete record" });
  }
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
    // 🔍 Check if a resident with the same name and birthday already exists
    const [existing] = await pool.query(
      "SELECT * FROM residents WHERE LOWER(full_name) = LOWER(?) AND dob = ?",
      [full_name, dob]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Resident already exists (same name and date of birth)" });
    }
    // ✅ Insert if no duplicate found
    const [result] = await pool.query(
      `INSERT INTO residents 
        (full_name, address, provincial_address, dob, age, civil_status, contact_no) 
       VALUES (?,?,?,?,?,?,?)`,
      [full_name, address, provincial_address, dob, age, civil_status, contact_no]
    );

    res.json({ message: "Resident added successfully", resident_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add resident" });
  }
});

// Update resident
app.put("/residents/:id", async (req, res) => {
  const { id } = req.params;
  const { full_name, address, provincial_address, dob, age, civil_status, contact_no } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM residents WHERE LOWER(full_name) = LOWER(?) AND dob = ? AND resident_id != ?",
      [full_name, dob, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Another resident with same name and date of birth already exists" });
    }
    await pool.query(
      `UPDATE residents 
       SET full_name = ?, address = ?, provincial_address = ?, dob = ?, 
           age = ?, civil_status = ?, contact_no = ?
       WHERE resident_id = ?`,
      [full_name, address, provincial_address, dob, age, civil_status, contact_no, id]
    );

    res.json({ message: "Resident updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update resident" });
  }
});

// Delete resident

app.delete("/residents/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM residents WHERE resident_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Resident not found" });
    }

    res.json({ message: "Resident deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete resident" });
  }
});



// GET all residents for dropdown
app.get("/residents", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, full_name, address, provincial_address, dob, age, civil_status, contact_no FROM residents WHERE is_active = 1"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




/**
 * CERTIFICATES
 */
// Get certificates (optional filter by type)
app.get("/certificates", async (req, res) => {
  try {
    const { type } = req.query;
    const whereClause = type ? "WHERE c.type = ?" : "";
    const params = type ? [type] : [];
    const [rows] = await pool.query(
      `SELECT c.certificate_id, c.type, r.full_name, c.purpose, c.date_issued, 
              c.validity_months, c.issued_by, c.resident_id 
       FROM certificates c 
       JOIN residents r ON c.resident_id = r.resident_id 
       ${whereClause}
       ORDER BY c.certificate_id DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// Get single certificate by id
app.get("/certificates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT certificate_id, type, resident_id, purpose, date_issued, validity_months, issued_by
       FROM certificates WHERE certificate_id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Certificate not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch certificate" });
  }
});

// Add new certificate
app.post("/certificates", async (req, res) => {
  const { resident_id, type, purpose, validity_months, issued_by } = req.body;
  try {
    if (!resident_id || !type) {
      return res.status(400).json({ error: "resident_id and type are required" });
    }
    const [result] = await pool.query(
      `INSERT INTO certificates 
        (resident_id, type, purpose, validity_months, issued_by) 
       VALUES (?,?,?,?,?)`,
      [resident_id, type, purpose || null, validity_months || 6, issued_by || "Barangay Chairman"]
    );
    res.json({ message: "Certificate created", certificate_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create certificate" });
  }
});

// Update certificate
app.put("/certificates/:id", async (req, res) => {
  const { id } = req.params;
  const { resident_id, type, purpose, validity_months, issued_by } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE certificates SET resident_id = ?, type = ?, purpose = ?, validity_months = ?, issued_by = ?
       WHERE certificate_id = ?`,
      [resident_id, type, purpose, validity_months, issued_by, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Certificate not found" });
    res.json({ message: "Certificate updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update certificate" });
  }
});

// Delete certificate
app.delete("/certificates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      `DELETE FROM certificates WHERE certificate_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Certificate not found" });
    res.json({ message: "Certificate deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete certificate" });
  }
});

/**
 * AUTHENTICATION
 */
app.post("/auth/login", authenticateUser, (req, res) => {
  res.json({
    message: "Login successful",
    user: req.user
  });
});

/**
 * USERS
 */
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT user_id, username, name, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/users", async (req, res) => {
  const { username, name, password, role } = req.body;
  
  if (!username || !name || !password) {
    return res.status(400).json({ error: "Username, name, and password are required" });
  }

  try {
    // Check if username already exists
    const [existingUsers] = await pool.query(
      "SELECT user_id FROM users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (username, name, password, role) VALUES (?,?,?,?)`,
      [username, name, hashedPassword, role || "staff"]
    );
    res.json({ message: "User created", user_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, name, password, role } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: "Username and name are required" });
  }

  try {
    // Check if username already exists (excluding current user)
    const [existingUsers] = await pool.query(
      "SELECT user_id FROM users WHERE username = ? AND user_id != ?",
      [username, id]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    let updateQuery = "UPDATE users SET username = ?, name = ?, role = ?";
    let queryParams = [username, name, role];

    // Only update password if provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery += ", password = ?";
      queryParams.push(hashedPassword);
    }

    updateQuery += " WHERE user_id = ?";
    queryParams.push(id);

    await pool.query(updateQuery, queryParams);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM users WHERE user_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});
/**
 * START SERVER
 */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
