
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const {
  uploadUsersFromCSV,
  uploadInvoicesFromCSV,
  uploadTransactionsFromCSV
} = require('./uploadcsv');

const app = express();
app.use(express.json());

app.use(cors());

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT
});


app.post('/upload-users', async (req, res) => {
  uploadUsersFromCSV();
  res.json({ message: 'Proceso de carga inciado' });
});

app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.post('/upload-user', async (req, res) => {
  const { id_document, full_name, address, phone_number, email } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT IGNORE INTO users(id_document, full_name, address, phone_number, email) 
      VALUES (?, ?, ?, ?, ?)`,
      [id_document, full_name, address, phone_number, email]
    );
    if (result.affectedRows > 0) {
      res.status(201).json({
        id_document,
        full_name,
        address,
        phone_number,
        email
      });
    } else {
      res.status(200).json({ message: 'cliente ya existente o no insertado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar el cliente' });
  }
});

//
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id_document = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'usuario no encontrado' });
    }

    res.json({ mensaje: 'usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
});

//

app.put('/update-user/:id', async (req, res) => {
  const { id } = req.params;
  const { user_full_name, user_address, user_phone_number, user_email } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE users 
       SET full_name = ?, address = ?, phone_number = ?, email = ?
       WHERE id_document = ?`,
      [user_full_name, user_address, user_phone_number, user_email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id_document = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el paciente' });
  }
});


// Invoices
app.post('/upload-invoices', async (req, res) => {
  uploadInvoicesFromCSV();
  res.json({ message: 'Proceso de carga inciado' });
});

app.get("/invoices", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM invoices");
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener facturas" });
  }
});

app.post('/upload-invoice', async (req, res) => {
  const { id_invoice, used_platform, billing_period, amount, amount_paid, id_document } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT IGNORE INTO invoices(id_invoice,used_platform,billing_period,amount,amount_paid,id_document) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id_invoice, used_platform, billing_period, amount, amount_paid, id_document]
    );
    if (result.affectedRows > 0) {
      res.status(201).json({
        id_invoice,
        used_platform,
        billing_period,
        amount,
        amount_paid,
        id_document
      });
    } else {
      res.status(200).json({ message: 'factura ya existente o no insertada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar la factura' });
  }
});


//
app.delete('/invoices/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM invoices WHERE id_invoice = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'factura no encontrada' });
    }

    res.json({ mensaje: 'factura eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la factura' });
  }
});

app.put('/update-invoice/:id', async (req, res) => {
  const { id } = req.params;
  const { invoice_used_platform, invoice_billing_period, invoice_amount, invoice_amount_paid, invoice_id_document } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE invoices 
       SET used_platform = ?, billing_period = ?, amount = ?, amount_paid = ?, id_document = ? 
       WHERE id_invoice = ?`,
      [invoice_used_platform, invoice_billing_period, invoice_amount, invoice_amount_paid, invoice_id_document, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    res.json({ mensaje: 'Factura actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la factura' });
  }
});

app.get('/invoices/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM invoices WHERE id_invoice = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la factura' });
  }
});

// Transactions
app.post('/upload-transactions', async (req, res) => {
  uploadTransactionsFromCSV();
  res.json({ message: 'Proceso de carga inciado' });
});

app.get("/transactions", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM transactions");
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
});

app.post('/upload-transaction', async (req, res) => {
  const { id_transaction, date, hour, amount, status, type, id_invoice } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO transactions(id_transaction,date,hour,amount,status,type,id_invoice) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_transaction, date, hour, amount, status, type, id_invoice]
    );
    if (result.affectedRows > 0) {
      res.status(201).json({
        id_transaction,
        date,
        hour,
        amount,
        status,
        type,
        id_invoice
      });
    } else {
      res.status(200).json({ message: 'transaccion ya existente o no insertada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar la transaccion' });
  }
});

app.delete('/transactions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM transactions WHERE id_transaction = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    res.json({ mensaje: 'Transacción eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la transacción' });
  }
});

app.put('/update-transaction/:id', async (req, res) => {
  const { id } = req.params;
  const { transaction_date, transaction_hour, transaction_amount, transaction_status, transaction_type, transaction_id_invoice } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE transactions
       SET date = ?, hour = ?, amount = ?, status = ?, type = ?, id_invoice = ? 
       WHERE id_transaction = ?`,
      [transaction_date, transaction_hour, transaction_amount, transaction_status, transaction_type, transaction_id_invoice, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    res.json({ mensaje: 'Factura actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la factura' });
  }
});

app.get('/transactions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE id_transaction = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la factura' });
  }
});

//Consultas avanzadas
app.get('/users/total-paid', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id_document,
        u.full_name,
        COALESCE(SUM(i.amount_paid), 0) AS total_paid
      FROM users u
      LEFT JOIN invoices i ON u.id_document = i.id_document
      GROUP BY u.id_document, u.full_name
    `);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error en /users/total-paid:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

//Endpoints
// Total pagado por cliente:
// GET http://localhost:3000/users/total-paid

// Facturas pendientes:
// GET http://localhost:3000/invoices/pending

// Transacciones por plataforma:
// GET http://localhost:3000/transactions/platform/Nequi
// o
// GET http://localhost:3000/transactions/platform/Daviplata

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));

