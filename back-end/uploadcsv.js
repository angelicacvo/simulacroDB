const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();
const mysql = require('mysql2/promise');

async function uploadUsersFromCSV() {
  let client;

  try {
    client = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.DB_USER,
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
            INSERT IGNORE INTO users(id_document, full_name, address, phone_number, email) 
            VALUES (?, ?, ?, ?, ?)
          `;
          const values = [user.id_document, user.full_name, user.address, user.phone_number, user.email];
          await client.execute(query, values);
        }

        console.log('usuarios cargados exitosamente.');
        await client.end();
      });

  } catch (err) {
    console.error('Error cargando usuarios:', err.message || err);
    if (client) await client.end();
  }
}

// Invoices
async function uploadInvoicesFromCSV() {
  let client;

  try {
    client = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.DB_USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.PORT
    });


    const invoices = [];
    fs.createReadStream('invoices.csv')
      .pipe(csv())
      .on('data', (data) => {
        invoices.push(data);
      })
      .on('end', async () => {
        for (const invoice of invoices) {
          const query = `
            INSERT IGNORE INTO invoices(id_invoice, used_platform, billing_period, amount, amount_paid, id_document) 
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          const values = [invoice.id_invoice, invoice.used_platform, invoice.billing_period, invoice.amount, invoice.amount_paid, invoice.id_document];
          await client.execute(query, values);
        }

        console.log('facturas cargadas exitosamente.');
        await client.end();
      });

  } catch (err) {
    console.error('Error cargando facturas:', err.message || err);
    if (client) await client.end();
  }
}


// Transactions
async function uploadTransactionsFromCSV() {
  let client;

  try {
    client = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.DB_USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.PORT
    });


    const transactions = [];
    fs.createReadStream('transactions.csv')
      .pipe(csv())
      .on('data', (data) => {
        transactions.push(data);
      })
      .on('end', async () => {
        for (const transaction of transactions) {
          const query = `
            INSERT IGNORE INTO transactions(id_transaction,date,hour,amount,status,type,id_invoice) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          const values = [transaction.id_transaction, transaction.date, transaction.hour, transaction.amount, transaction.status, transaction.type, transaction.id_invoice];
          await client.execute(query, values);
        }

        console.log('Transacciones cargadas exitosamente.');
        await client.end();
      });

  } catch (err) {
    console.error('Error cargando transacciones:', err.message || err);
    if (client) await client.end();
  }
}

module.exports = {
  uploadUsersFromCSV,
  uploadInvoicesFromCSV,
  uploadTransactionsFromCSV
};