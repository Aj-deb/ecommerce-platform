-- CREATE TABLE orders (
--   order_id INT,
--   status VARCHAR(255),
--   date INT
-- -- );
-- DROP TABLE orders;
-- -- SELECT * FROM orders;
-- INSERT INTO orders(order_id,status,date) 
-- VALUES (1,'bye2eweq',5);
-- ALTER TABLE orders ADD time INT;

-- -- UPDATE orders SET status = 'processed',date = 32  WHERE order_id = 1

-- ALTER TABLE orders
-- DROP COLUMN date 

-- DELETE FROM orders WHERE status = 'processed'
-- SELECT * FROM orders WHERE status ILIKE 'B%' OR date=5343 ;
-- SELECT * FROM orders 
-- WHERE status IN ('HELLO');

-- SELECT * FROM orders 
-- WHERE date BETWEEN 4 AND 312;

-- SELECT * FROM orders
-- WHERE status IS NULL;

-- SELECT * FROM orders LIMIT 2 OFFSET 1
-- 1️⃣ Create ENUM type for order status
-- CREATE TYPE order_status AS ENUM (
--     'pending',
--     'completed',
--     'cancelled'
-- );
-- 2️⃣ Create orders table


-- CREATE TABLE categories(
--     category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     category_name VARCHAR(255) NOT NULL
-- );
-- INSERT INTO categories (category_name)
-- VALUES 
-- ('Beverages'),
-- ('Condiments'),
-- ('Confections'),
-- ('Dairy Products');

-- INSERT INTO products (product_name, category_id)
-- VALUES
-- ('Geitost', 4),
-- ('Sasquatch Ale', 1),
-- ('Steeleye Stout', 1),
-- ('Inlagd Sill', 15);

-- DELETE FROM  products;
-- TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE;
-- CREATE TABLE products(
--     product_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     product_name VARCHAR(255) NOT NULL,
--     category_id INT,
--     CONSTRAINT fk_category
--         FOREIGN KEY (category_id)
--         REFERENCES categories(category_id)
--         ON DELETE SET NULL
-- );
-- SELECT product_id,product_name,category_name 
-- FROM products
-- INNER JOIN categories ON products.category_id = categories.category_id

-- SELECT product_id,product_name,category_name 
-- FROM products
-- INNER JOIN categories ON products.category_id = categories.category_id
-- SELECT * FROM categories;
-- SELECT product_id,product_name,category_name FROM products
-- LEFT JOIN categories ON products.category_id  =  categories.category_id
-- WHERE category_name ILIKE 'BEVERAGES';


-- SELECT 
--     p.product_name,
--     c.category_name
-- FROM products p
-- FULL JOIN categories c
-- ON p.category_id = c.category_id;

-- SELECT category_name FROM categories
-- UNION
-- SELECT product_name FROM products;
-- SELECT products

-- SELECT product_id, SUM(quantity) AS total_qty
-- FROM orderitems
-- GROUP BY product_id
-- HAVING SUM(quantity) > 3;