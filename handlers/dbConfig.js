import sqlite3 from "sqlite3";
sqlite3.verbose();
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);
const dbDirectory = __dirname+'./../db/bonk.db'

// let db = new sqlite3.Database(dbDirectory, sqlite3.OPEN_READWRITE, (err)=> {
//     if(err) return console.log(err);
//     console.log("connection successful");
// });

// db.run('CREATE TABLE charity(id, logo, name)', (err) => {
//     if(err) {
//       console.error('Error creating table table:', err.message);
//     }
//     console.log('table animal charity created');
// })

// db.run('DROP TABLE IF EXISTS charity', (err) => {
//     if(err) {
//       console.error('Error dropping table:', err.message);
//     }
//     console.log('Table dropped successfully');
// })

// db.run(`INSERT INTO charity(id, logo, name) VALUES(?,?,?)`,[1189133714, "https://static.tgbwidget.com/organization_logo/e8b4f975-1d82-48c7-8dde-8aa9fa73dd3d.jpg", "Paws of Honor, Inc."], (err)=>{
//     if(err) return console.log(err);
//     console.log(`paws of honour : row has been inserted`);
// })

// db.all('SELECT * FROM charity', (err, rows) => {
//     if (err) {
//       console.error('Error querying data:', err.message);
//       return;
//     }
//     console.log(rows.length);
// })

// db.close((err)=>{
//     if(err) return console.log(err);
// })