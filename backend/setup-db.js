const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

// Database connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "brg145",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function setupDatabase() {
  try {
    console.log("Setting up database...");

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id int(11) NOT NULL AUTO_INCREMENT,
        username varchar(50) NOT NULL,
        name varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        role enum('admin','staff','chairman') DEFAULT 'staff',
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (user_id),
        UNIQUE KEY username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    console.log("Users table created/verified");

    // Create residents table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS residents (
        resident_id int(11) NOT NULL AUTO_INCREMENT,
        full_name varchar(255) NOT NULL,
        address varchar(255) DEFAULT NULL,
        provincial_address varchar(255) DEFAULT NULL,
        dob date DEFAULT NULL,
        age int(11) DEFAULT NULL,
        civil_status varchar(50) DEFAULT NULL,
        contact_no varchar(50) DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (resident_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    console.log("Residents table created/verified");

    // Create certificates table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        certificate_id int(11) NOT NULL AUTO_INCREMENT,
        resident_id int(11) NOT NULL,
        type enum('action','indigency','barangay_clearance') NOT NULL,
        purpose varchar(255) DEFAULT NULL,
        date_issued timestamp NOT NULL DEFAULT current_timestamp(),
        validity_months int(11) DEFAULT 6,
        issued_by varchar(255) DEFAULT 'Barangay Chairman',
        PRIMARY KEY (certificate_id),
        KEY resident_id (resident_id),
        CONSTRAINT fk_cert_resident FOREIGN KEY (resident_id) REFERENCES residents (resident_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    console.log("Certificates table created/verified");

    // Create request_records table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS request_records (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        birthday DATE NOT NULL,
        age INT NOT NULL,
        provincial_address TEXT,
        contact_no VARCHAR(20),
        civil_status ENUM('Single','Married','Widowed','Divorced','Separated') NOT NULL,
        request_reason TEXT NOT NULL,
        date_issued DATE NOT NULL,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    console.log("Request records table created/verified");

    // Check if admin user exists
    const [existingAdmin] = await pool.query(
      "SELECT user_id FROM users WHERE username = 'admin'"
    );

    if (existingAdmin.length === 0) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await pool.query(
        "INSERT INTO users (username, name, password, role) VALUES (?, ?, ?, ?)",
        ["admin", "System Administrator", hashedPassword, "admin"]
      );
      
      console.log("✅ Admin user created:");
      console.log("   Username: admin");
      console.log("   Password: admin123");
      console.log("   Role: admin");
    } else {
      console.log("Admin user already exists");
    }

    // Check if chairman user exists
    const [existingChairman] = await pool.query(
      "SELECT user_id FROM users WHERE username = 'chairman'"
    );

    if (existingChairman.length === 0) {
      // Create default chairman user
      const hashedPassword = await bcrypt.hash("chairman123", 10);
      
      await pool.query(
        "INSERT INTO users (username, name, password, role) VALUES (?, ?, ?, ?)",
        ["chairman", "Barangay Chairman", hashedPassword, "chairman"]
      );
      
      console.log("✅ Chairman user created:");
      console.log("   Username: chairman");
      console.log("   Password: chairman123");
      console.log("   Role: chairman");
    } else {
      console.log("Chairman user already exists");
    }

    // Check if staff user exists
    const [existingStaff] = await pool.query(
      "SELECT user_id FROM users WHERE username = 'staff'"
    );

    if (existingStaff.length === 0) {
      // Create default staff user
      const hashedPassword = await bcrypt.hash("staff123", 10);
      
      await pool.query(
        "INSERT INTO users (username, name, password, role) VALUES (?, ?, ?, ?)",
        ["staff", "Barangay Staff", hashedPassword, "staff"]
      );
      
      console.log("✅ Staff user created:");
      console.log("   Username: staff");
      console.log("   Password: staff123");
      console.log("   Role: staff");
    } else {
      console.log("Staff user already exists");
    }

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\nDefault login credentials:");
    console.log("┌─────────────┬─────────────┬─────────────┬─────────────┐");
    console.log("│ Username    │ Password    │ Role        │ Access      │");
    console.log("├─────────────┼─────────────┼─────────────┼─────────────┤");
    console.log("│ admin       │ admin123    │ admin       │ Full Access │");
    console.log("│ chairman    │ chairman123 │ chairman    │ Limited     │");
    console.log("│ staff       │ staff123    │ staff       │ Basic       │");
    console.log("└─────────────┴─────────────┴─────────────┴─────────────┘");

  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
