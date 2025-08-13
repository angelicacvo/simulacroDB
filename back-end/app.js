
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const {
  cargarusersDesdeCSV,
  cargardoctorsDesdeCSV,
  cargarlocationsDesdeCSV,
  cargarspecialitiesDesdeCSV,
  cargarappointmentsDesdeCSV
} = require('./uploadcsv');

const app = express();
app.use(express.json());

app.use(cors());

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT
});


app.post('/upload-users', async (req, res) => {
  cargarusersDesdeCSV();
  res.json({ message: 'Proceso de carga inciado' });
});

app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clients");
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.post('/upload-user', async (req, res) => {
  const { document_number, full_name, address, phone_number, email } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT IGNORE INTO clients(document_number, full_name, address, phone_number, email) 
            VALUES (?, ?, ?, ?, ?)`,
      [document_number, full_name, address, phone_number, email]
    );
    if (result.affectedRows > 0) {
      res.status(201).json({
        document_number, 
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


app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM clients WHERE document_number = ?', [id]);

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
app.put('/update-user/:document_number', async (req, res) => {
  const { document_number } = req.params;
  const { full_name, address, phone_number, email } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE clients 
       SET full_name = ?, address = ?, phone_number = ?, email = ?
       WHERE document_number = ?`,
      [full_name, address, phone_number, email, document_number]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
});


app.get('/users/:document_number', async (req, res) => {
  const { document_number } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM clients WHERE document_number = ?',
      [document_number]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'cliente no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
});

// app.post('/upload-doctors', async (req, res) => {
//   cargardoctorsDesdeCSV();
//   res.json({ message: 'Proceso de carga inciado' });
// });

// app.get("/doctors", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM doctors");
//     return res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al obtener doctores" });
//   }
// });


// app.post('/upload-doctor', async (req, res) => {
//   const { name, email } = req.body;

//   try {
//     const [result] = await pool.query(
//       `INSERT IGNORE INTO doctors(name) VALUES (?)`,
//       [name]
//     );
//     if (result.affectedRows > 0) {
//       res.status(201).json({
//         id: result.insertId,
//         name
//       });
//     } else {
//       res.status(200).json({ message: 'doctor ya existente o no insertado' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al insertar el cliente' });
//   }
// });

// app.delete('/doctors/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [result] = await pool.query('DELETE FROM doctors WHERE id_doctor = ?', [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Doctor no encontrado' });
//     }

//     res.json({ mensaje: 'Doctor eliminado correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al eliminar el cliente' });
//   }
// });

// app.put('/update-doctor/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   try {
//     const [result] = await pool.query(
//       `UPDATE doctors 
//        SET name = ?
//        WHERE id_doctor = ?`,
//       [name, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Doctor no encontrado' });
//     }

//     res.json({ mensaje: 'Doctor actualizado correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al actualizar el Doctor' });
//   }
// });

// app.get('/doctors/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [rows] = await pool.query(
//       'SELECT * FROM doctors WHERE id_doctor = ?',
//       [id]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Doctor no encontrado' });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al obtener el doctor' });
//   }
// });


// app.post('/upload-locations', async (req, res) => {
//   cargarlocationsDesdeCSV();
//   res.json({ message: 'Proceso de carga inciado' });
// });


// app.get("/locations", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM locations");
//     return res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al obtener ubicaciones" });
//   }
// });


// app.post('/upload-location', async (req, res) => {
//   const { name } = req.body;

//   try {
//     const [result] = await pool.query(
//       `INSERT IGNORE INTO locations(name) VALUES (?)`,
//       [name]
//     );
//     if (result.affectedRows > 0) {
//       res.status(201).json({
//         id: result.insertId,
//         name
//       });
//     } else {
//       res.status(200).json({ message: 'sede ya existente o no insertada' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al insertar la sede' });
//   }
// });


// app.delete('/locations/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [result] = await pool.query('DELETE FROM locations WHERE id_location = ?', [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'sede no encontrada' });
//     }

//     res.json({ mensaje: 'Sede eliminada correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al eliminar la sede' });
//   }
// });


// app.put('/update-location/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   try {
//     const [result] = await pool.query(
//       `UPDATE locations 
//        SET name = ?
//        WHERE id_location = ?`,
//       [name, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Doctor no encontrado' });
//     }

//     res.json({ mensaje: 'Doctor actualizado correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al actualizar el Doctor' });
//   }
// });

// app.get('/locations/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [rows] = await pool.query(
//       'SELECT * FROM locations WHERE id_location = ?',
//       [id]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Doctor no encontrado' });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al obtener el doctor' });
//   }
// });


// app.post('/upload-specialities', async (req, res) => {
//   cargarspecialitiesDesdeCSV();
//   res.json({ message: 'Proceso de carga inciado' });
// });

// app.get("/specialities", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM specialities");
//     return res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al obtener especialidades" });
//   }
// });

// app.post('/upload-speciality', async (req, res) => {
//   const { name } = req.body;

//   try {
//     const [result] = await pool.query(
//       `INSERT IGNORE INTO specialities(name) VALUES (?)`,
//       [name]
//     );
//     if (result.affectedRows > 0) {
//       res.status(201).json({
//         id: result.insertId,
//         name
//       });
//     } else {
//       res.status(200).json({ message: 'especialidad ya existente o no insertada' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al insertar la especialidad' });
//   }
// });

// app.delete('/specialities/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [result] = await pool.query('DELETE FROM specialities WHERE id_speciality = ?', [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'especialidad no encontrada' });
//     }

//     res.json({ mensaje: 'especialidad eliminada correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al eliminar la sede' });
//   }
// });


// app.put('/update-speciality/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   try {
//     const [result] = await pool.query(
//       `UPDATE specialities 
//        SET name = ?
//        WHERE id_speciality = ?`,
//       [name, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Especialidad no encontrada' });
//     }

//     res.json({ mensaje: 'espacialidad actualizada correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al actualizar la especialidad' });
//   }
// });

// app.get('/specialities/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [rows] = await pool.query(
//       'SELECT * FROM specialities WHERE id_speciality = ?',
//       [id]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'especialidad no encontrada' });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al obtener el doctor' });
//   }
// });


// app.post('/upload-appointments', async (req, res) => {
//   cargarappointmentsDesdeCSV();
//   res.json({ message: 'Proceso de carga inciado' });
// });

// app.get("/appointments", async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT 
//     a.id_appointment,
//     DATE_FORMAT(a.date, '%Y-%m-%d') AS date,
//     a.hour,
//     a.reason,
//     a.observations,
//     a.payment_method,
//     a.status,
//     p.name AS client_name,
//     d.name AS doctor_name,
//     s.name AS speciality_name,
//     l.name AS location_name
// FROM appointments a
// LEFT JOIN clients p ON a.id_client = p.id_client
// LEFT JOIN doctors d ON a.id_doctor = d.id_doctor
// LEFT JOIN specialities s ON a.id_speciality = s.id_speciality
// LEFT JOIN locations l ON a.id_location = l.id_location;
// `);
//     return res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error al obtener appointments" });
//   }
// });


// app.post('/upload-appointment', async (req, res) => {
//   const {
//     date,
//     hour,
//     reason,
//     observations,
//     payment_method,
//     status,
//     id_client,
//     id_doctor,
//     id_speciality,
//     id_location
//   } = req.body;

//   try {
//     const [result] = await pool.query(
//       `INSERT INTO appointments 
//       (date, hour, reason, observations, payment_method, status, id_client, id_doctor, id_speciality, id_location) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [date, hour, reason, observations, payment_method, status, id_client, id_doctor, id_speciality, id_location]
//     );

//     if (result.affectedRows > 0) {
//       res.status(201).json({
//         id: result.insertId,
//         date,
//         hour,
//         reason,
//         observations,
//         payment_method,
//         status,
//         id_client,
//         id_doctor,
//         id_speciality,
//         id_location
//       });
//     } else {
//       res.status(200).json({ message: 'Cita no insertada' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al insertar la cita' });
//   }
// });



// app.delete('/appointments/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [result] = await pool.query('DELETE FROM appointments WHERE id_appointment = ?', [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'cita no encontrada' });
//     }

//     res.json({ mensaje: 'cita eliminada correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error al eliminar la cita' });
//   }
// });

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));

