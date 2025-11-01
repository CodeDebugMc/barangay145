-- Database tables for all certificate types based on indigency structure

-- Barangay Clearance Table
CREATE TABLE `barangay_clearance` (
 `barangay_clearance_id` int(11) NOT NULL AUTO_INCREMENT,
 `resident_id` int(11) NOT NULL,
 `transactionNum` varchar(255) NOT NULL,
 `full_name` varchar(255) NOT NULL,
 `address` text DEFAULT NULL,
 `provincial_address` text DEFAULT NULL,
 `dob` date DEFAULT NULL,
 `age` int(11) DEFAULT NULL,
 `civil_status` enum('Single','Married','Widowed','Divorced','Separated') NOT NULL,
 `contact_no` varchar(20) DEFAULT NULL,
 `request_reason` text DEFAULT NULL,
 `remarks` text DEFAULT NULL,
 `date_issued` date DEFAULT NULL,
 `transaction_number` varchar(50) DEFAULT NULL,
 `is_active` tinyint(1) DEFAULT 1,
 `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
 `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`barangay_clearance_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `barangay_clearance_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Business Clearance Table
CREATE TABLE `business_clearance` (
 `business_clearance_id` int(11) NOT NULL AUTO_INCREMENT,
 `resident_id` int(11) NOT NULL,
 `transactionNum` varchar(255) NOT NULL,
 `full_name` varchar(255) NOT NULL,
 `address` text DEFAULT NULL,
 `provincial_address` text DEFAULT NULL,
 `dob` date DEFAULT NULL,
 `age` int(11) DEFAULT NULL,
 `civil_status` enum('Single','Married','Widowed','Divorced','Separated') NOT NULL,
 `contact_no` varchar(20) DEFAULT NULL,
 `request_reason` text DEFAULT NULL,
 `remarks` text DEFAULT NULL,
 `date_issued` date DEFAULT NULL,
 `transaction_number` varchar(50) DEFAULT NULL,
 `is_active` tinyint(1) DEFAULT 1,
 `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
 `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`business_clearance_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `business_clearance_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Certificate of Residency Table
CREATE TABLE `certificate_of_residency` (
 `certificate_of_residency_id` int(11) NOT NULL AUTO_INCREMENT,
 `resident_id` int(11) NOT NULL,
 `transactionNum` varchar(255) NOT NULL,
 `full_name` varchar(255) NOT NULL,
 `address` text DEFAULT NULL,
 `provincial_address` text DEFAULT NULL,
 `dob` date DEFAULT NULL,
 `age` int(11) DEFAULT NULL,
 `civil_status` enum('Single','Married','Widowed','Divorced','Separated') NOT NULL,
 `contact_no` varchar(20) DEFAULT NULL,
 `request_reason` text DEFAULT NULL,
 `remarks` text DEFAULT NULL,
 `date_issued` date DEFAULT NULL,
 `transaction_number` varchar(50) DEFAULT NULL,
 `is_active` tinyint(1) DEFAULT 1,
 `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
 `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`certificate_of_residency_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `certificate_of_residency_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Permit to Travel Table
CREATE TABLE `permit_to_travel` (
 `permit_to_travel_id` int(11) NOT NULL AUTO_INCREMENT,
 `resident_id` int(11) NOT NULL,
 `transactionNum` varchar(255) NOT NULL,
 `full_name` varchar(255) NOT NULL,
 `address` text DEFAULT NULL,
 `provincial_address` text DEFAULT NULL,
 `dob` date DEFAULT NULL,
 `age` int(11) DEFAULT NULL,
 `civil_status` enum('Single','Married','Widowed','Divorced','Separated') NOT NULL,
 `contact_no` varchar(20) DEFAULT NULL,
 `request_reason` text DEFAULT NULL,
 `remarks` text DEFAULT NULL,
 `date_issued` date DEFAULT NULL,
 `transaction_number` varchar(50) DEFAULT NULL,
 `is_active` tinyint(1) DEFAULT 1,
 `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
 `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`permit_to_travel_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `permit_to_travel_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Cash Assistance Table
CREATE TABLE `cash_assistance` (
 `cash_assistance_id` int(11) NOT NULL AUTO_INCREMENT,
 `resident_id` int(11) NOT NULL,
 `transactionNum` varchar(255) NOT NULL,
 `full_name` varchar(255) NOT NULL,
 `address` text DEFAULT NULL,
 `provincial_address` text DEFAULT NULL,
 `dob` date DEFAULT NULL,
 `age` int(11) DEFAULT NULL,
 `civil_status` enum('Single','Married','Widowed','Divorced','Separated') NOT NULL,
 `contact_no` varchar(20) DEFAULT NULL,
 `request_reason` text DEFAULT NULL,
 `remarks` text DEFAULT NULL,
 `date_issued` date DEFAULT NULL,
 `transaction_number` varchar(50) DEFAULT NULL,
 `is_active` tinyint(1) DEFAULT 1,
 `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
 `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
 PRIMARY KEY (`cash_assistance_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `cash_assistance_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
