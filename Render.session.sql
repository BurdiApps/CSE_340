CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL
);

INSERT INTO classification (classification_name) VALUES ('Your Classification Name');
