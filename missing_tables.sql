-- Add transaction_number field to existing indigency table
ALTER TABLE `indigency` ADD COLUMN `transaction_number` varchar(50) DEFAULT NULL;
ALTER TABLE `indigency` ADD UNIQUE KEY `transaction_number` (`transaction_number`);
ALTER TABLE `indigency` ADD KEY `idx_transaction_number` (`transaction_number`);

-- Financial Assistance Table
CREATE TABLE `financial_assistance` (
 `financial_assistance_id` int(11) NOT NULL AUTO_INCREMENT,
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
 PRIMARY KEY (`financial_assistance_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `financial_assistance_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Cohabitation Table
CREATE TABLE `cohabitation` (
 `cohabitation_id` int(11) NOT NULL AUTO_INCREMENT,
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
 PRIMARY KEY (`cohabitation_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `cohabitation_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Oath Job Seeker Table
CREATE TABLE `oath_job_seeker` (
 `oath_job_seeker_id` int(11) NOT NULL AUTO_INCREMENT,
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
 PRIMARY KEY (`oath_job_seeker_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `oath_job_seeker_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Solo Parent Form Table
CREATE TABLE `solo_parent_form` (
 `solo_parent_form_id` int(11) NOT NULL AUTO_INCREMENT,
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
 PRIMARY KEY (`solo_parent_form_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `solo_parent_form_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Certification Action Table
CREATE TABLE `certification_action` (
 `certification_action_id` int(11) NOT NULL AUTO_INCREMENT,
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
 PRIMARY KEY (`certification_action_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `certification_action_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bhert Cert Positive Table
CREATE TABLE `bhert_cert_positive` (
 `bhert_cert_positive_id` int(11) NOT NULL AUTO_INCREMENT,
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
 PRIMARY KEY (`bhert_cert_positive_id`),
 UNIQUE KEY `transaction_number` (`transaction_number`),
 KEY `resident_id` (`resident_id`),
 KEY `idx_transaction_number` (`transaction_number`),
 CONSTRAINT `bhert_cert_positive_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
