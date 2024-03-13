const sqlite3 = require('sqlite3').verbose();

// Change the database file to 'sshdata.db'
const db = new sqlite3.Database('sshdata.db');

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
  );
`;

// Use db.exec instead of db.run for table creation
db.exec(createUserTableQuery, (err) => {
  if (err) {
    console.error('Error creating users table:', err.message);
  } else {
    console.log('Backend Started Successfully');
  }
});

module.exports = db;
