const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken"); // Importa jsonwebtoken
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: 'root',
  password: '123456',
  database: "arkey_grp",
  connectTimeout: 10000,  // 10 segundos
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.stack);
    return;
  }
  console.log("Conexión a la base de datos establecida con ID", connection.threadId);
});

// Sirve los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "public")));

// Ruta raíz para redirigir al login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta para el login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario en la base de datos
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = results[0]; // Tomamos el primer resultado (debería ser único por email)

    // Genera el token JWT con los datos del usuario (incluyendo role_id)
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id }, // Incluye role_id
      'tu_clave_secreta', // Usa una clave secreta para firmar el token
      { expiresIn: '1h' }
    );

    res.json({ message: "Login exitoso", token });
  });
});

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Suponiendo que el token se pasa como "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Verificar el token
  jwt.verify(token, 'tu_clave_secreta', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token no válido' });
    }
    req.user = decoded; // Guarda los datos del usuario decodificados en la solicitud
    next(); // Continúa al siguiente middleware o ruta
  });
};

// Ruta para obtener los datos del usuario autenticado
app.get("/api/auth/me", verifyToken, (req, res) => {
  // El usuario está disponible en req.user gracias al middleware
  const user = req.user; // Aquí puedes acceder al user.id, user.email, user.role_id, etc.
  res.json({
    id: user.id,
    email: user.email,
    role_id: user.role_id,
    name: user.name, // Asumiendo que tienes un campo 'name' en tu tabla de usuarios
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
