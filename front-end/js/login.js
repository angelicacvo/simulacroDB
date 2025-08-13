require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  const [rows] = await conn.execute("SELECT * FROM usuarios WHERE correo = ?", [correo]);
  if (rows.length === 0) return res.status(401).send("Usuario no encontrado");

  const usuario = rows[0];
  const valid = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!valid) return res.status(401).send("Contraseña incorrecta");

  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

  res.json({ token });
});

module.exports = router;
