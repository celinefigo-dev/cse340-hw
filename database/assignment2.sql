--Task One - Write SQL Statements
--1. The Tony Stark insert SQL statement works.
INSERT INTO
	PUBLIC.ACCOUNT (
		ACCOUNT_FIRSTNAME,
		ACCOUNT_LASTNAME,
		ACCOUNT_EMAIL,
		ACCOUNT_PASSWORD,
		ACCOUNT_TYPE
	)
VALUES
	(
		'Tony',
		'Stark',
		'tony@starkent.com',
		'Iam1ronM@n',
		'Client'
	)
	
--2. The Tony Stark update SQL statement works.
UPDATE PUBLIC.ACCOUNT
SET
	ACCOUNT_TYPE = 'Admin'
WHERE
	ACCOUNT_ID = 1;

--3. The delete Tony Stark SQL statement works.
DELETE FROM PUBLIC.ACCOUNT
WHERE
	ACCOUNT_ID = 1;

--4. The description update SQL statement works.
UPDATE PUBLIC.INVENTORY
SET
	INV_DESCRIPTION = REPLACE(
		INV_DESCRIPTION,
		'small interiors',
		'a huge interior'
	)
WHERE
	INV_ID = 10;

--5. The select query using a JOIN SQL statement works.
SELECT
	A.INV_MAKE,
	A.INV_MODEL,
	B.CLASSIFICATION_NAME
FROM
	PUBLIC.INVENTORY A
	INNER JOIN PUBLIC.CLASSIFICATION B ON B.CLASSIFICATION_ID = A.CLASSIFICATION_ID
WHERE
	B.CLASSIFICATION_ID = 2;

--6. The inv_image and inv_thumbnail update query works. 
UPDATE PUBLIC.INVENTORY
SET
	INV_IMAGE = REPLACE(INV_IMAGE, '/images', '/images/vehicles'),
	INV_THUMBNAIL = REPLACE(INV_THUMBNAIL, '/images', '/images/vehicles');