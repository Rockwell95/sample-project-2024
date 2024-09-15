CREATE USER bookadmin WITH PASSWORD 'bookadmin';
CREATE DATABASE book_database;
\c book_database;
GRANT ALL PRIVILEGES ON DATABASE book_database TO bookadmin;