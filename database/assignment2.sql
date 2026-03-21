-- Assignment 2

-- Insert Tony Stark
INSERT INTO account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

-- Update Tony Stark's Acccount Type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Delete Tony Stark's Record 
DELETE FROM account
WHERE account_email = 'tony@starkent.com';


-- Replace "small interiors" with "a huge interior" in hummer
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Select make, model and classification for "sport"
SELECT 
  inventory.inv_make, 
  inventory.inv_model, 
  classification.classification_name
FROM inventory
INNER JOIN classification 
  ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- add /vehicles to inv_image and inv_thumbnail
UPDATE inventory
SET 
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- Book Appointment 
CREATE TABLE appointments (
  appointment_id SERIAL PRIMARY KEY,
  account_id INT REFERENCES account(account_id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  purpose TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);