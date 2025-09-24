-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 25, 2025 at 12:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `brg145`
--

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
(1, 'Hanna N. Sarabia', '123 General Tirona St', '2004-06-01', 21, '123 General Tirona St', '09275649283', 'Single', 'Job Application', '2025-09-22', '2025-09-22 15:24:57', '2025-09-22 15:24:57', 1);

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
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`certificate_id`),
  ADD KEY `resident_id` (`resident_id`);

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
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `certificate_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `request_records`
--
ALTER TABLE `request_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `request_types`
--
ALTER TABLE `request_types`
  MODIFY `request_type_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`resident_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
