-- Create database if not exists
CREATE DATABASE IF NOT EXISTS dairy;
USE dairy;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  partyCode INT NULL,
  name VARCHAR(50) NOT NULL,
  mobile VARCHAR(20) NULL,
  route VARCHAR(100) NULL,
  openingBalance DECIMAL(10,2) NULL DEFAULT 0,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Distributor', 'Sub-Admin') DEFAULT 'Sub-Admin',
  createdBy INT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productCode VARCHAR(50) NOT NULL UNIQUE,
  productName VARCHAR(100) NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  gst DECIMAL(5,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  crate INT NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ProductPrices table
CREATE TABLE IF NOT EXISTS productprices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  distributorId INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'unit',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (distributorId) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_productprices_product ON productprices(productId);
CREATE INDEX idx_productprices_distributor ON productprices(distributorId);
