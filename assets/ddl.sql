CREATE TABLE `users` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `hashed_password` char(24) NOT NULL,
  `salt` char(24) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `likes` (
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `book_id`)
);

CREATE TABLE `cart_books` (
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `count` int NOT NULL,
  PRIMARY KEY (`user_id`, `book_id`)
);

CREATE TABLE `books` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `category_id` int NOT NULL,
  `form` varchar(45) NOT NULL,
  `isbn` varchar(13) NOT NULL,
  `summary` varchar(1024),
  `detail` varchar(2048),
  `author` varchar(45) NOT NULL,
  `pages` int NOT NULL,
  `contents` text,
  `price` int NOT NULL,
  `amount` int NOT NULL,
  `published_at` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `orders` (
  `order_id` char(36) PRIMARY KEY NOT NULL,
  `user_id` int NOT NULL,
  `delivery` JSON COMMENT 'address varchar(500)
receiver varchar(45)
contact varchar(13)
',
  `books` JSON COMMENT 'book_id int, 
count int,
price int,
title varchar
author varchar
',
  `main_book_title` varchar(45) NOT NULL,
  `total_price` int NOT NULL,
  `total_count` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE `promotions` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `discount_rate` decimal(2,1) NOT NULL,
  `start_at` date,
  `end_at` date
);

CREATE TABLE `promotion_users` (
  `user_id` int NOT NULL,
  `promotion_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `promotion_id`)
);

CREATE TABLE `promotion_categories` (
  `book_id` int NOT NULL,
  `category_id` int NOT NULL,
  `promotion_id` int NOT NULL,
  PRIMARY KEY (`book_id`, `category_id`, `promotion_id`)
);

ALTER TABLE `likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `likes` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `cart_books` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `cart_books` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `promotion_users` ADD FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `promotion_users` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `promotion_categories` ADD FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `promotion_categories` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
