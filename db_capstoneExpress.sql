/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `tblComment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `image_id` int NOT NULL,
  `comment_date` date NOT NULL,
  `content` varchar(255) NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `image_id` (`image_id`),
  CONSTRAINT `tblComment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tblUser` (`user_id`),
  CONSTRAINT `tblComment_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `tblImage` (`image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tblImage` (
  `image_id` int NOT NULL AUTO_INCREMENT,
  `image_name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tblImage_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tblUser` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tblSaveImage` (
  `user_id` int NOT NULL,
  `image_id` int NOT NULL,
  `save_date` date DEFAULT NULL,
  PRIMARY KEY (`user_id`,`image_id`),
  KEY `image_id` (`image_id`),
  KEY `user_id` (`user_id`) USING BTREE,
  CONSTRAINT `tblSaveImage_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `tblUser` (`user_id`),
  CONSTRAINT `tblSaveImage_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `tblImage` (`image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tblUser` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `pass_word` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `age` int DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `tblComment` (`comment_id`, `user_id`, `image_id`, `comment_date`, `content`) VALUES
(1, 1, 1, '2023-07-01', 'comment 1');
INSERT INTO `tblComment` (`comment_id`, `user_id`, `image_id`, `comment_date`, `content`) VALUES
(2, 2, 2, '2023-07-01', 'comment 2');


INSERT INTO `tblImage` (`image_id`, `image_name`, `url`, `description`, `user_id`) VALUES
(1, 'image1', 'image1.png', NULL, 1);
INSERT INTO `tblImage` (`image_id`, `image_name`, `url`, `description`, `user_id`) VALUES
(2, 'image2', 'image2.png', NULL, 2);


INSERT INTO `tblSaveImage` (`user_id`, `image_id`, `save_date`) VALUES
(1, 1, '2023-12-01');
INSERT INTO `tblSaveImage` (`user_id`, `image_id`, `save_date`) VALUES
(2, 2, '2023-12-01');


INSERT INTO `tblUser` (`user_id`, `email`, `pass_word`, `full_name`, `age`, `avatar`) VALUES
(1, 'alice@gmail.com', '1234', 'alice', 20, 'avatar1.png');
INSERT INTO `tblUser` (`user_id`, `email`, `pass_word`, `full_name`, `age`, `avatar`) VALUES
(2, 'yorn@gmail.com', '1234', 'yorn', 25, 'avatar2.png');
INSERT INTO `tblUser` (`user_id`, `email`, `pass_word`, `full_name`, `age`, `avatar`) VALUES
(3, 'lam@gmail.com', '1234', 'lam', 25, 'avatar3.png');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;