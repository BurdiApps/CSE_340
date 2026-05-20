-- Drop tables if they exist (to make rebuild safe to re-run)
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TABLE IF EXISTS account;

-- Drop TYPE if it exists
DROP TYPE IF EXISTS account_type_enum;

-- Create account_type enum
CREATE TYPE account_type_enum AS ENUM ('Client', 'Employee', 'Admin');

-- Create classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) UNIQUE NOT NULL
);

-- Create account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) UNIQUE NOT NULL,
    account_password VARCHAR(100) NOT NULL,
    account_type account_type_enum DEFAULT 'Client'
);

-- Create inventory table
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INTEGER NOT NULL,
    inv_description TEXT,
    inv_image VARCHAR(200) NOT NULL,
    inv_thumbnail VARCHAR(200) NOT NULL,
    inv_price NUMERIC NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color VARCHAR(50) NOT NULL,
    classification_id INTEGER NOT NULL REFERENCES classification(classification_id)
);

-- Insert values into classification
INSERT INTO classification (classification_name) VALUES
('Economy'),
('Luxury'),
('Sport');

-- Insert some inventory items
INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES
('GM', 'Hummer', 2024, 'This SUV is known for small interiors and off-road power.', '/images/hummer.jpg', '/images/hummer-thumb.jpg', 58000, 5000, 'Black', 3),
('Ford', 'Mustang', 2023, 'The Mustang is a classic sport coupe with great performance.', '/images/mustang.jpg', '/images/mustang-thumb.jpg', 45000, 12000, 'Red', 3),
('Toyota', 'Corolla', 2024, 'Economical and reliable sedan.', '/images/corolla.jpg', '/images/corolla-thumb.jpg', 25000, 3000, 'White', 1);

-- Add a default account if desired for testing
INSERT INTO account (account_firstname, account_lastname, account_email, account_password) VALUES ('Bruce', 'Wayne', 'bruce@wayne.com', 'IamBatman');

-- Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Update image paths in inventory
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');