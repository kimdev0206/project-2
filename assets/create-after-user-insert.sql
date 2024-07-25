DELIMITER $$
  CREATE TRIGGER after_user_insert
  AFTER INSERT ON users
  FOR EACH ROW
  BEGIN
    IF NEW.email LIKE '%@gmail.com'
    THEN
      INSERT INTO
        promotion_users (
          user_id,
          promotion_id
        )
      VALUES
        (NEW.id, 2);
    END IF;
  END$$
DELIMITER ;