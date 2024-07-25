DELIMITER $$
  CREATE TRIGGER after_book_insert
  AFTER INSERT ON books
  FOR EACH ROW
  BEGIN
    IF NEW.category_id = 1
    THEN
      INSERT INTO
        promotion_categories (
          book_id,
          category_id,
          promotion_id
        )
      VALUES
        (NEW.id, NEW.category_id, 1);
    END IF;
  END$$
DELIMITER ;