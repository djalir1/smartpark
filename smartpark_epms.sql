-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2026 at 07:51 PM
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
-- Database: `smartpark_epms`
--

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `departmentCode` varchar(10) NOT NULL,
  `departmentName` varchar(100) NOT NULL,
  `grossSalary` decimal(12,2) NOT NULL,
  `totalDeduction` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`departmentCode`, `departmentName`, `grossSalary`, `totalDeduction`, `created_at`) VALUES
('ADMS', 'Administration staff', 600000.00, 70000.00, '2026-05-30 21:11:03'),
('CW', 'Carwash', 300000.00, 20000.00, '2026-05-30 21:11:03'),
('MC', 'Mechanic', 450000.00, 40000.00, '2026-05-30 21:11:03'),
('ST', 'Stock', 200000.00, 5000.00, '2026-05-30 21:11:03'),
('TST', 'testing', 2450000.00, 135000.00, '2026-05-30 22:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employeeNumber` varchar(20) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `position` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `telephone` varchar(10) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `hiredDate` date NOT NULL,
  `departmentCode` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employeeNumber`, `firstName`, `lastName`, `position`, `address`, `telephone`, `gender`, `hiredDate`, `departmentCode`, `created_at`) VALUES
('EMP-001', 'Jean', 'Mugabo', 'Carwash Operator', 'Rubavu, Western Province', '0788123456', 'Male', '2024-01-15', 'CW', '2026-05-30 21:11:03'),
('EMP-002', 'Marie', 'Uwase', 'Stock Keeper', 'Rubavu, Western Province', '0722345678', 'Female', '2024-03-10', 'ST', '2026-05-30 21:11:03'),
('EMP-003', 'Patrick', 'Nshimiyimana', 'Senior Mechanic', 'Rubavu, Western Province', '0788456789', 'Male', '2023-09-20', 'MC', '2026-05-30 21:11:03'),
('EMP-004', 'Aline', 'Mukamana', 'HR Officer', 'Rubavu, Western Province', '0733567890', 'Female', '2023-05-05', 'ADMS', '2026-05-30 21:11:03'),
('EMP-005', 'Shema', 'Abdul', 'senior tester', 'kigali', '0780267792', 'Male', '2026-05-30', 'TST', '2026-05-30 22:15:57');

-- --------------------------------------------------------

--
-- Table structure for table `salaries`
--

CREATE TABLE `salaries` (
  `salaryId` int(11) NOT NULL,
  `employeeNumber` varchar(20) NOT NULL,
  `departmentCode` varchar(10) NOT NULL,
  `grossSalary` decimal(12,2) NOT NULL,
  `totalDeduction` decimal(12,2) NOT NULL,
  `netSalary` decimal(12,2) NOT NULL,
  `month` varchar(7) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salaries`
--

INSERT INTO `salaries` (`salaryId`, `employeeNumber`, `departmentCode`, `grossSalary`, `totalDeduction`, `netSalary`, `month`, `created_at`) VALUES
(1, 'EMP-001', 'CW', 300000.00, 20000.00, 280000.00, '2026-05', '2026-05-30 21:11:03'),
(2, 'EMP-002', 'ST', 200000.00, 5000.00, 195000.00, '2026-05', '2026-05-30 21:11:03'),
(3, 'EMP-003', 'MC', 450000.00, 40000.00, 410000.00, '2026-05', '2026-05-30 21:11:03'),
(4, 'EMP-004', 'ADMS', 600000.00, 70000.00, 530000.00, '2026-05', '2026-05-30 21:11:03'),
(5, 'EMP-005', 'TST', 2450000.00, 135000.00, 2315000.00, '2026-05', '2026-05-30 22:16:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'Administrator',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', '$2b$10$DIuJN1SELO7WJzMuN.ycMusIUx/h.YUcQte3w6kvxmUa126rhF2zy', 'Administrator', '2026-05-30 21:11:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`departmentCode`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employeeNumber`),
  ADD KEY `departmentCode` (`departmentCode`);

--
-- Indexes for table `salaries`
--
ALTER TABLE `salaries`
  ADD PRIMARY KEY (`salaryId`),
  ADD UNIQUE KEY `uniq_emp_month` (`employeeNumber`,`month`),
  ADD KEY `departmentCode` (`departmentCode`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `salaryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`departmentCode`) REFERENCES `departments` (`departmentCode`) ON UPDATE CASCADE;

--
-- Constraints for table `salaries`
--
ALTER TABLE `salaries`
  ADD CONSTRAINT `salaries_ibfk_1` FOREIGN KEY (`employeeNumber`) REFERENCES `employees` (`employeeNumber`) ON UPDATE CASCADE,
  ADD CONSTRAINT `salaries_ibfk_2` FOREIGN KEY (`departmentCode`) REFERENCES `departments` (`departmentCode`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
