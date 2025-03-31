-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS arkey_grp;
USE arkey_grp;

-- Tabla de roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar roles predeterminados
INSERT INTO roles (name) VALUES ('admin'), ('contabilidad'), ('recursos_humanos'), ('inventarios');

-- Tabla de usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Insertar usuarios predeterminados (contraseñas en texto claro solo para pruebas)
INSERT INTO users (username, email, password, role_id) VALUES
('admin_user', 'admin@example.com', 'admin123', 1),
('conta_user', 'contabilidad@example.com', 'conta123', 2),
('rrhh_user', 'recursoshumanos@example.com', 'rrhh123', 3),
('inv_user', 'inventarios@example.com', 'inv12345', 4);