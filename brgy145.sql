-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2025 at 10:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `brgy145`
--

-- --------------------------------------------------------

--
-- Table structure for table `barangay_clearance`
--

CREATE TABLE `barangay_clearance` (
  `barangay_clearance_id` int(11) NOT NULL,
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
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barangay_clearance`
--

INSERT INTO `barangay_clearance` (`barangay_clearance_id`, `resident_id`, `transactionNum`, `full_name`, `address`, `provincial_address`, `dob`, `age`, `civil_status`, `contact_no`, `request_reason`, `remarks`, `date_issued`, `transaction_number`, `is_active`, `date_created`, `date_updated`) VALUES
(1, 7, '', 'Hanna N. Sarabia', '123 General Tirona St', '123 General Tirona St', '2004-06-01', 21, 'Single', '09663122562', 'hehhe', 'Residence in this Barangay and certifies that he/she is a resident of good moral character.', '2025-10-18', 'BC-251018-231100', 1, '2025-10-18 02:34:58', '2025-10-18 02:34:58');

-- --------------------------------------------------------

--
-- Table structure for table `business_clearance`
--

CREATE TABLE `business_clearance` (
  `business_clearance_id` int(11) NOT NULL,
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
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_clearance`
--

INSERT INTO `business_clearance` (`business_clearance_id`, `resident_id`, `transactionNum`, `full_name`, `address`, `provincial_address`, `dob`, `age`, `civil_status`, `contact_no`, `request_reason`, `remarks`, `date_issued`, `transaction_number`, `is_active`, `date_created`, `date_updated`) VALUES
(1, 6, 'BUS-251018-614100', 'Lyra Borling', '29 St', 'MetroManila', '2000-01-28', 25, 'Single', '09276121723', 'sdfsdf', 'Residence in this Barangay and certifies that he/she is a resident of good moral character.', '2025-10-18', 'BUS-251018-614100', 1, '2025-10-18 02:44:33', '2025-10-18 02:44:33');

-- --------------------------------------------------------

--
-- Table structure for table `cash_assistance`
--

CREATE TABLE `cash_assistance` (
  `cash_assistance_id` int(11) NOT NULL,
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
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `certificate_id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `date_issued` timestamp NOT NULL DEFAULT current_timestamp(),
  `validity_months` int(11) DEFAULT 6,
  `issued_by` varchar(100) DEFAULT 'Barangay Chairman'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificate_of_residency`
--

CREATE TABLE `certificate_of_residency` (
  `certificate_of_residency_id` int(11) NOT NULL,
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
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificate_of_residency`
--

INSERT INTO `certificate_of_residency` (`certificate_of_residency_id`, `resident_id`, `transactionNum`, `full_name`, `address`, `provincial_address`, `dob`, `age`, `civil_status`, `contact_no`, `request_reason`, `remarks`, `date_issued`, `transaction_number`, `is_active`, `date_created`, `date_updated`) VALUES
(1, 7, '', 'Hanna N. Sarabia', '123 General Tirona St', '123 General Tirona St', '2004-06-01', 21, 'Single', '09663122562', 'hehe', 'Residence in this Barangay and certifies that he/she is a resident of good moral character.', '2025-10-18', 'COR-251018-100100', 1, '2025-10-18 02:44:53', '2025-10-18 02:44:53'),
(2, 7, '', 'Hanna N. Sarabia', '123 General Tirona St', '123 General Tirona St', '2004-06-01', 21, 'Single', '09663122562', 'sjhdsakdas', 'Residence in this Barangay and certifies that he/she is a resident of good moral character.', '2025-10-18', 'COR-251018-139100', 0, '2025-10-18 02:48:19', '2025-10-18 02:48:27');

-- --------------------------------------------------------

--
-- Table structure for table `indigency`
--

CREATE TABLE `indigency` (
  `indigency_id` int(11) NOT NULL,
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
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `indigency`
--

INSERT INTO `indigency` (`indigency_id`, `resident_id`, `transactionNum`, `full_name`, `address`, `provincial_address`, `dob`, `age`, `civil_status`, `contact_no`, `request_reason`, `remarks`, `date_issued`, `transaction_number`, `is_active`, `date_created`, `date_updated`) VALUES
(1, 1, '', 'Moneque Sazon', '12 Kanto St', 'Metro Manila', '2000-01-31', 25, 'Single', '098726416782', 'Job Application\n', 'Residence in this Barangay and certifies that he/she belongs to indigent families.', '2025-10-09', NULL, 0, '2025-10-11 11:24:38', '2025-10-16 02:03:35'),
(3, 6, '', 'Lyra Borling', '29 St', 'MetroManila', '2000-01-27', 25, 'Single', '09276121723', 'Employment', 'Residence in this Barangay and certifies that he/she belongs to indigent families. ', '2025-10-11', NULL, 0, '2025-10-11 13:42:58', '2025-10-16 02:03:37'),
(6, 8, '', 'Trixie Ann G. Morales', 'Sampaloc, Manila', 'Metro Manila', '2002-10-05', 23, 'Single', '09354685456', 'dasdasda', 'Residence in this Barangay and certifies that he/she belongs to indigent families.', '2025-10-14', 'IND-251014-167', 1, '2025-10-14 07:39:55', '2025-10-14 07:39:55'),
(7, 6, '', 'Lyra Borling', '29 St', 'MetroManila', '2000-01-28', 25, 'Single', '09276121723', 'fsfsd', 'Residence in this Barangay and certifies that he/she belongs to indigent families.', '2025-10-14', 'IND-251014-756', 1, '2025-10-14 07:40:16', '2025-10-14 07:40:16'),
(8, 6, '', 'Lyra Borling', '29 St', 'MetroManila', '2000-01-28', 25, 'Single', '09276121723', 'Wala lang', 'Residence in this Barangay and certifies that he/she belongs to indigent families.', '2025-10-14', 'IND-251014-050', 1, '2025-10-14 07:44:34', '2025-10-16 02:03:26');

-- --------------------------------------------------------

--
-- Table structure for table `oath_job`
--

CREATE TABLE `oath_job` (
  `id` int(11) NOT NULL,
  `resident_id` int(11) DEFAULT NULL,
  `transaction_number` varchar(50) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `date_issued` date DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `oath_job`
--

INSERT INTO `oath_job` (`id`, `resident_id`, `transaction_number`, `full_name`, `age`, `address`, `date_issued`, `date_created`, `date_updated`) VALUES
(1, 7, 'IND-251018144452-418', 'Hanna N. Sarabia', 21, '123 General Tirona St', '2025-10-18', '2025-10-18 06:44:52', '2025-10-18 07:01:28');

-- --------------------------------------------------------

--
-- Table structure for table `permit_to_travel`
--

CREATE TABLE `permit_to_travel` (
  `permit_to_travel_id` int(11) NOT NULL,
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
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permit_to_travel`
--

INSERT INTO `permit_to_travel` (`permit_to_travel_id`, `resident_id`, `transactionNum`, `full_name`, `address`, `provincial_address`, `dob`, `age`, `civil_status`, `contact_no`, `request_reason`, `remarks`, `date_issued`, `transaction_number`, `is_active`, `date_created`, `date_updated`) VALUES
(1, 1, '', 'Moneque Sazon', '12 Kanto St', 'Metro Manila', '2000-01-31', 25, 'Single', '098726416782', 'hehehe', 'you can also change this', '2025-10-18', 'PTT-251018-377100', 1, '2025-10-18 02:47:42', '2025-10-18 02:47:42');

-- --------------------------------------------------------

--
-- Table structure for table `request_records`
--

CREATE TABLE `request_records` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `birthday` date NOT NULL,
  `age` int(11) NOT NULL,
  `provincial_address` text DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `civil_status` enum('Single','Married','Widowed','Divorced','Separated') NOT NULL,
  `request_reason` text NOT NULL,
  `date_issued` date NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request_records`
--

INSERT INTO `request_records` (`id`, `name`, `address`, `birthday`, `age`, `provincial_address`, `contact_no`, `civil_status`, `request_reason`, `date_issued`, `date_created`, `date_updated`, `is_active`) VALUES
(1, 'Hanna N. Sarabia', '123 General Tirona St', '2004-06-01', 21, '123 General Tirona St', '09275649283', 'Single', 'Job Application', '2025-09-22', '2025-09-22 15:24:57', '2025-09-22 15:24:57', 1),
(2, 'Moneque Sazon', '18 Kanto St. Barangay 145 Caloocan City', '2005-05-29', 20, 'Metro', '098126172632', 'Married', 'Job Application', '2025-10-18', '2025-10-06 12:54:57', '2025-10-18 05:34:57', 1);

-- --------------------------------------------------------

--
-- Table structure for table `request_types`
--

CREATE TABLE `request_types` (
  `request_type_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `resident_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `address` varchar(255) NOT NULL,
  `provincial_address` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `civil_status` enum('Single','Married','Widowed','Separated','Divorced') DEFAULT 'Single',
  `contact_no` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`resident_id`, `full_name`, `address`, `provincial_address`, `dob`, `age`, `civil_status`, `contact_no`, `created_at`) VALUES
(1, 'Moneque Sazon', '12 Kanto St', 'Metro Manila', '2000-01-31', 25, 'Single', '098726416782', '2025-10-11 07:01:56'),
(6, 'Lyra Borling', '29 St', 'MetroManila', '2000-01-28', 25, 'Single', '09276121723', '2025-10-11 07:58:05'),
(7, 'Hanna N. Sarabia', '123 General Tirona St', '123 General Tirona St', '2004-06-01', 21, 'Single', '09663122562', '2025-10-13 08:07:13'),
(8, 'Trixie Ann G. Morales', 'Sampaloc, Manila', 'Metro Manila', '2002-10-05', 23, 'Single', '09354685456', '2025-10-13 08:30:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','chairman') DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `name`, `password`, `role`, `created_at`) VALUES
(1, 'admin', 'System Administrator', '$2a$10$bUyF1Q1Yf6ciA9JC1meB.ut/7r18kk1mj42bbOEvI4K7RHkeqXb0S', 'admin', '2025-09-22 04:37:24'),
(2, 'chairman', 'Barangay Chairman', '$2a$10$jgED7lGEw8j9iq39MHHUt.OsJOGyMUROSDLVTS7kcPs4h/f79EkUq', 'chairman', '2025-09-22 04:37:24'),
(3, 'staff', 'Barangay Staff', '$2a$10$cenRvwfB/eqQE339/vq0ROdTIVfxClidW2YEBUCw//rGIZeInRxWK', 'staff', '2025-09-22 04:37:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barangay_clearance`
--
ALTER TABLE `barangay_clearance`
  ADD PRIMARY KEY (`barangay_clearance_id`),
  ADD UNIQUE KEY `transaction_number` (`transaction_number`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `idx_transaction_number` (`transaction_number`);

--
-- Indexes for table `business_clearance`
--
ALTER TABLE `business_clearance`
  ADD PRIMARY KEY (`business_clearance_id`),
  ADD UNIQUE KEY `transaction_number` (`transaction_number`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `idx_transaction_number` (`transaction_number`);

--
-- Indexes for table `cash_assistance`
--
ALTER TABLE `cash_assistance`
  ADD PRIMARY KEY (`cash_assistance_id`),
  ADD UNIQUE KEY `transaction_number` (`transaction_number`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `idx_transaction_number` (`transaction_number`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`certificate_id`),
  ADD KEY `resident_id` (`resident_id`);

--
-- Indexes for table `certificate_of_residency`
--
ALTER TABLE `certificate_of_residency`
  ADD PRIMARY KEY (`certificate_of_residency_id`),
  ADD UNIQUE KEY `transaction_number` (`transaction_number`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `idx_transaction_number` (`transaction_number`);

--
-- Indexes for table `indigency`
--
ALTER TABLE `indigency`
  ADD PRIMARY KEY (`indigency_id`),
  ADD UNIQUE KEY `transaction_number` (`transaction_number`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `idx_transaction_number` (`transaction_number`);

--
-- Indexes for table `oath_job`
--
ALTER TABLE `oath_job`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_number` (`transaction_number`);

--
-- Indexes for table `permit_to_travel`
--
ALTER TABLE `permit_to_travel`
  ADD PRIMARY KEY (`permit_to_travel_id`),
  ADD UNIQUE KEY `transaction_number` (`transaction_number`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `idx_transaction_number` (`transaction_number`);

--
-- Indexes for table `request_records`
--
ALTER TABLE `request_records`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `request_types`
--
ALTER TABLE `request_types`
  ADD PRIMARY KEY (`request_type_id`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`resident_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barangay_clearance`
--
ALTER TABLE `barangay_clearance`
  MODIFY `barangay_clearance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `business_clearance`
--
ALTER TABLE `business_clearance`
  MODIFY `business_clearance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cash_assistance`
--
ALTER TABLE `cash_assistance`
  MODIFY `cash_assistance_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `certificate_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certificate_of_residency`
--
ALTER TABLE `certificate_of_residency`
  MODIFY `certificate_of_residency_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `indigency`
--
ALTER TABLE `indigency`
  MODIFY `indigency_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `oath_job`
--
ALTER TABLE `oath_job`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permit_to_travel`
--
ALTER TABLE `permit_to_travel`
  MODIFY `permit_to_travel_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `request_records`
--
ALTER TABLE `request_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `request_types`
--
ALTER TABLE `request_types`
  MODIFY `request_type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barangay_clearance`
--
ALTER TABLE `barangay_clearance`
  ADD CONSTRAINT `barangay_clearance_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`);

--
-- Constraints for table `business_clearance`
--
ALTER TABLE `business_clearance`
  ADD CONSTRAINT `business_clearance_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`);

--
-- Constraints for table `cash_assistance`
--
ALTER TABLE `cash_assistance`
  ADD CONSTRAINT `cash_assistance_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`);

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`) ON DELETE CASCADE;

--
-- Constraints for table `certificate_of_residency`
--
ALTER TABLE `certificate_of_residency`
  ADD CONSTRAINT `certificate_of_residency_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`);

--
-- Constraints for table `indigency`
--
ALTER TABLE `indigency`
  ADD CONSTRAINT `indigency_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`);

--
-- Constraints for table `permit_to_travel`
--
ALTER TABLE `permit_to_travel`
  ADD CONSTRAINT `permit_to_travel_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
