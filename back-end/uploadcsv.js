const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();
const mysql = require('mysql2/promise');

async function cargarusersDesdeCSV() {
  let client;

  try {
    client = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.PORT
    });


    const users = [];
    fs.createReadStream('users.csv')
      .pipe(csv())
      .on('data', (data) => {
        users.push(data);
      })
      .on('end', async () => {
        for (const user of users) {
          const query = `
            INSERT IGNORE INTO clients(document_number, full_name, address, phone_number, email) 
            VALUES (?, ?, ?, ?, ?)
          `;
          const values = [user.document_number, user.full_name, user.address, user.phone_number, user.email];
          await client.execute(query, values);
        }

        console.log('usuarios cargados exitosamente.');
        await client.end();
      });

  } catch (err) {
    console.error('Error cargando clientes:', err.message || err);
    if (client) await client.end();
  }
}

// async function cargardoctorsDesdeCSV() {
//   let client;

//   try {
//     client = await mysql.createConnection({
//       host: process.env.HOST,
//       user: process.env.USER,
//       password: process.env.PASSWORD,
//       database: process.env.DATABASE,
//       port: process.env.PORT
//     });


//     const doctors = [];
//     fs.createReadStream('doctors.csv')
//       .pipe(csv())
//       .on('data', (data) => {
//         doctors.push(data);
//       })
//       .on('end', async () => {
//         for (const doctor of doctors) {
//           const query = `
//             INSERT IGNORE INTO doctors(name) 
//             VALUES (?)
//           `;
//           const values = [doctor.name];
//           await client.execute(query, values);
//         }

//         console.log('doctores cargados exitosamente.');
//         await client.end();
//       });

//   } catch (err) {
//     console.error('Error cargando doctores:', err.message || err);
//     if (client) await client.end();
//   }
// }




// async function cargarlocationsDesdeCSV() {
//   let client;

//   try {
//     client = await mysql.createConnection({
//       host: process.env.HOST,
//       user: process.env.USER,
//       password: process.env.PASSWORD,
//       database: process.env.DATABASE,
//       port: process.env.PORT
//     });


//     const locations = [];
//     fs.createReadStream('locations.csv')
//       .pipe(csv())
//       .on('data', (data) => {
//         locations.push(data);
//       })
//       .on('end', async () => {
//         for (const location of locations) {
//           const query = `
//             INSERT IGNORE INTO locations(name) 
//             VALUES (?)
//           `;
//           const values = [location.name];
//           await client.execute(query, values);
//         }

//         console.log('Sedes cargadas exitosamente.');
//         await client.end();
//       });

//   } catch (err) {
//     console.error('Error cargando sedes:', err.message || err);
//     if (client) await client.end();
//   }
// }

// async function cargarspecialitiesDesdeCSV() {
//   let client;

//   try {
//     client = await mysql.createConnection({
//       host: process.env.HOST,
//       user: process.env.USER,
//       password: process.env.PASSWORD,
//       database: process.env.DATABASE,
//       port: process.env.PORT
//     });


//     const specialities = [];
//     fs.createReadStream('specialities.csv')
//       .pipe(csv())
//       .on('data', (data) => {
//         specialities.push(data);
//       })
//       .on('end', async () => {
//         for (const speciality of specialities) {
//           const query = `
//             INSERT IGNORE INTO specialities(name) 
//             VALUES (?)
//           `;
//           const values = [speciality.name];
//           await client.execute(query, values);
//         }

//         console.log('especialidades cargadas exitosamente.');
//         await client.end();
//       });

//   } catch (err) {
//     console.error('Error cargando especialidades:', err.message || err);
//     if (client) await client.end();
//   }
// }

// async function cargarappointmentsDesdeCSV() {
//   let client;

//   try {
//     client = await mysql.createConnection({
//       host: process.env.HOST,
//       user: process.env.USER,
//       password: process.env.PASSWORD,
//       database: process.env.DATABASE,
//       port: process.env.PORT
//     });


//     const appointments = [];
//     fs.createReadStream('appointments.csv')
//       .pipe(csv())
//       .on('data', (data) => {
//         appointments.push(data);
//       })
//       .on('end', async () => {
//         for (const appointment of appointments) {
//           const query = `
//             INSERT IGNORE INTO appointments(date, hour , reason, observations, payment_method, status, id_client, id_doctor, id_speciality, id_location ) 
//             VALUES (?,?,?,?,?,?,?,?,?,?)
//           `;
//           const values = [appointment.date, appointment.hour, appointment.reason, appointment.observations, appointment.payment_method, appointment.status, appointment.id_client, appointment.id_doctor, appointment.id_speciality, appointment.id_location];
//           await client.execute(query, values);
//         }

//         console.log('citas cargadas exitosamente.');
//         await client.end();
//       });

//   } catch (err) {
//     console.error('Error cargando especialidades:', err.message || err);
//     if (client) await client.end();
//   }
// }


module.exports = {
  cargarusersDesdeCSV,
  // cargardoctorsDesdeCSV,
  // cargarlocationsDesdeCSV,
  // cargarspecialitiesDesdeCSV,
  // cargarappointmentsDesdeCSV
};