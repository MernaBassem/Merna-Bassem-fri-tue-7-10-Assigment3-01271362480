-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2024 at 10:13 AM
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
-- Database: `gym`
--

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE `membership` (
  `id` int(11) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `membership_start` date DEFAULT NULL,
  `membership_end` date DEFAULT NULL,
  `membership_cost` double DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `trainerId` int(11) DEFAULT NULL,
  `national_id` varchar(30) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `soft_delete` enum('no_soft_delete','yes_soft_delete') DEFAULT 'no_soft_delete'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `membership`
--

INSERT INTO `membership` (`id`, `name`, `membership_start`, `membership_end`, `membership_cost`, `status`, `trainerId`, `national_id`, `phone`, `soft_delete`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, '', '', 'no_soft_delete'),
(2, 'Merna', '2024-05-01', '2024-05-01', 400, 'active', 4, '12345678912345', '01271362480', 'no_soft_delete'),
(4, 'Madlin', '2024-05-01', '2024-06-03', 400, 'freeze', 5, '12345678912245', '01271362480', 'no_soft_delete'),
(5, 'Baba', '2024-05-01', '2024-06-03', 400, 'freeze', 4, '12345668912245', '01271362480', 'no_soft_delete'),
(6, 'Atef', '2024-04-12', '2024-07-12', 300, 'active', 5, '12463258123654', '01271362480', 'no_soft_delete'),
(19, 'rana', '2024-04-12', '2024-07-12', 300, 'active', 5, '11463258123654', '01271362480', 'no_soft_delete'),
(20, 'rana', '2024-04-12', '2024-07-12', 300, 'active', 4, '16463258123654', '01271362480', 'no_soft_delete'),
(21, 'rana', '2024-04-12', '2024-07-12', 300, 'active', 6, '26463258123654', '01271362480', 'no_soft_delete'),
(22, 'Madlin', '2024-04-12', '2024-07-12', 300, 'active', 8, '26463258723654', '01271362480', 'yes_soft_delete');

-- --------------------------------------------------------

--
-- Table structure for table `trainer`
--

CREATE TABLE `trainer` (
  `trainer_id` int(11) NOT NULL,
  `trainer_name` varchar(30) DEFAULT NULL,
  `trainer_duration_start` date DEFAULT NULL,
  `trainer_duration_end` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainer`
--

INSERT INTO `trainer` (`trainer_id`, `trainer_name`, `trainer_duration_start`, `trainer_duration_end`) VALUES
(4, 'roma', '2024-04-12', '2025-04-12'),
(5, 'kero', '2024-04-12', '2025-04-12'),
(6, 'mariam', '2024-04-12', '2025-04-12'),
(8, 'Madlin', '2024-04-12', '2025-04-12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `national_id` (`national_id`),
  ADD KEY `trainer_id` (`trainerId`);

--
-- Indexes for table `trainer`
--
ALTER TABLE `trainer`
  ADD PRIMARY KEY (`trainer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `membership`
--
ALTER TABLE `membership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `trainer`
--
ALTER TABLE `trainer`
  MODIFY `trainer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `membership`
--
ALTER TABLE `membership`
  ADD CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`trainerId`) REFERENCES `trainer` (`trainer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
