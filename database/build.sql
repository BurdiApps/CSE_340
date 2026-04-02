-- Drop tables if they exist (to make rebuild safe to re-run)
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TABLE IF EXISTS account;

-- Drop TYPE if it exists
DROP TYPE IF EXISTS account_type_enum;

-- Create account_type enum
CREATE TYPE account_type_enum AS ENUM ('User', 'Admin');

-- Create classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) UNIQUE NOT NULL
);

-- Create account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) UNIQUE NOT NULL,
    account_password VARCHAR(100) NOT NULL,
    account_type account_type_enum DEFAULT 'User'
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
INSERT INTO inventory (inv_make, inv_model, inv_description, classification_id, inv_image, inv_thumbnail) VALUES
('GM', 'Hummer', 'This SUV is known for small interiors and off-road power.', 3, '/images/hummer.jpg', '/images/hummer-thumb.jpg'),
('Ford', 'Mustang', 'The Mustang is a classic sport coupe with great performance.', 3, '/images/mustang.jpg', '/images/mustang-thumb.jpg'),
('Toyota', 'Corolla', 'Economical and reliable sedan.', 1, '/images/corolla.jpg', '/images/corolla-thumb.jpg');

-- Add a default account if desired for testing
INSERT INTO account (first_name, last_name, account_email, account_password) VALUES ('Bruce', 'Wayne', 'bruce@wayne.com', 'IamBatman');

-- Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Update image paths in inventory
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');