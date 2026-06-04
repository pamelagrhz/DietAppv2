-- Create database and tables structure for the diet app
CREATE DATABASE IF NOT EXISTS dietapp;
USE dietapp;

-- Table for users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  age INT NULL,
  genre VARCHAR(50) NULL,
  mail VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  score DECIMAL(3,2) NOT NULL DEFAULT 4.50,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Table for recipes
CREATE TABLE IF NOT EXISTS recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  preparacion TEXT NOT NULL,
  score DECIMAL(3,2) NOT NULL DEFAULT 4.50,
  porciones INT NOT NULL DEFAULT 1,
  creation_date DATETIME NOT NULL,
  last_modified_date DATETIME NOT NULL,
  INDEX idx_recipes_user_id (user_id),
  CONSTRAINT fk_recipes_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Table for ingredients catalog
CREATE TABLE IF NOT EXISTS ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for recipe ingredients
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  cantidad DECIMAL(10,4) NOT NULL,
  medida VARCHAR(60) NOT NULL,
  INDEX idx_recipe_ingredients_recipe_id (recipe_id),
  INDEX idx_recipe_ingredients_ingredient_id (ingredient_id),
  CONSTRAINT fk_recipe_ingredients_recipe FOREIGN KEY (recipe_id)
    REFERENCES recipes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_recipe_ingredients_ingredient FOREIGN KEY (ingredient_id)
    REFERENCES ingredients(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
-- Table for meal plan entries
CREATE TABLE IF NOT EXISTS meal_plan_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  recipe_name VARCHAR(255) NOT NULL,
  last_modified_date DATETIME NOT NULL,
  UNIQUE KEY uq_meal_plan_user_date (user_id, date),
  INDEX idx_meal_plan_recipe_name (recipe_name),
  CONSTRAINT fk_meal_plan_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
