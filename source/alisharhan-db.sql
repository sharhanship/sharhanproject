-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 04, 2025 at 03:10 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alisharhan-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_section`
--

DROP TABLE IF EXISTS `about_section`;
CREATE TABLE IF NOT EXISTS `about_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL COMMENT 'متن تگ h3 (نیم نگاه)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL COMMENT 'متن تگ p (توضیحات درباره من)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

--
-- Dumping data for table `about_section`
--

INSERT INTO `about_section` (`id`, `title`, `description`) VALUES
(13, 'علی شرحان هستم', 'همه جیز از جایی شروع شد که با خدم گفتم همه چیز چطوری کار میکنه.........');

-- --------------------------------------------------------

--
-- Table structure for table `adminpartloginpart`
--

DROP TABLE IF EXISTS `adminpartloginpart`;
CREATE TABLE IF NOT EXISTS `adminpartloginpart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `adminpartloginpart`
--

INSERT INTO `adminpartloginpart` (`id`, `username`, `password`) VALUES
(1, 'darkboy', 'darkboy2049');

-- --------------------------------------------------------

--
-- Table structure for table `coding_skills`
--

DROP TABLE IF EXISTS `coding_skills`;
CREATE TABLE IF NOT EXISTS `coding_skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL,
  `skill_percentage` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

--
-- Dumping data for table `coding_skills`
--

INSERT INTO `coding_skills` (`id`, `skill_name`, `skill_percentage`, `created_at`) VALUES
(9, '#C', 85, '2025-04-14 14:51:37'),
(10, 'PHP', 80, '2025-04-14 14:51:50'),
(11, 'js', 40, '2025-04-14 14:52:02'),
(12, 'HTML5', 90, '2025-04-14 14:52:18'),
(13, 'CSS', 90, '2025-04-14 14:52:27'),
(14, 'phpmyadmin', 95, '2025-04-14 14:52:45'),
(15, 'sql server', 80, '2025-04-14 14:53:06'),
(16, 'wpf', 60, '2025-04-14 14:53:16'),
(18, 'xml', 50, '2025-04-14 14:53:43'),
(19, 'ASP.NET', 30, '2025-04-15 07:17:14'),
(20, 'DART', 8, '2025-04-29 18:29:19'),
(21, 'DART', 6, '2025-05-03 07:01:07');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameandfamily` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL,
  `numberphone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL,
  `mortext` text CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `nameandfamily`, `email`, `numberphone`, `mortext`) VALUES
(27, 'رضا عزیزی', 'rezaazizi2000@gmail.com', '09165485963', 'سلام . میخام بدونم چطوری باید درخواست بدم برای استفاده از سرویس های گوگل......'),
(28, 'رضا جودکی', 'jodi5055@gmail.com', '09927856216', 'سلام میخاستم یه درخواست بدم برای ساخت یک سایت فروشگاهی.'),
(29, 'محمد سعادتی فرد', 'mamad2000@gmail.com', '09925654646', 'من میخام بدونم چطوری میشه بازی ساخت در بستر وب'),
(30, 'قاسمی', 'abmtim1@gmail.com', '09920352936', 'سلام علی'),
(31, 'قاسمی', 'abmtim1@gmail.com', '09920352936', 'علی خوبی؟'),
(32, 'علی قاسمی', 'abmtim1@gmail.com', '09920352936', 'میخام باهم بازی کنیم');

-- --------------------------------------------------------

--
-- Table structure for table `education_section`
--

DROP TABLE IF EXISTS `education_section`;
CREATE TABLE IF NOT EXISTS `education_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL COMMENT 'سال (مثال: 1401)',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL COMMENT 'متن تگ h3 (عنوان)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_persian_ci NOT NULL COMMENT 'متن تگ p (توضیحات)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_persian_ci;

--
-- Dumping data for table `education_section`
--

INSERT INTO `education_section` (`id`, `year`, `title`, `description`) VALUES
(10, '1396-1400', 'دنیای تلفن های همراه', 'یادگیری تخصصی سیتم عامل های مختلف . انواع ترفند ها و آشنایی کامل با سخت افزار تلفن های هوشمند.'),
(11, '1400-1402', 'دنیای سی شارپ', 'ورود به دنیای برنامه نویسی با زبان سی شارپ و پیداکردن تخصص در ساخت نرم افزار برای سیستم عامل های ویندوز و مک و لینوکس .\nپیاده سازی نرم افزار های مدیریت فروشگاهی در سطح متوسط. و ساخت نرم افزار های کاربردی سیستمی...'),
(12, '1402-1404', 'دنیای وبسایت', 'پیاده سازی سیستم های مدیریت محتوا در وبسیات ها . پیاده سازی انواع وبسیات های فروشگاهی و شخصی . \nیادگیری تکنولوژی های جدید برای بالا بردن امنیت وبسیات ها . تونایی پیاده سازی فرانت و بک اند و دیتابیس به صورت تک نفره.');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
