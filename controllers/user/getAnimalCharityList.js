import data from "../../output.json" with {type:"json"};
import sqlite3 from "sqlite3";
sqlite3.verbose();
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);
const dbDirectory = __dirname+'./../../db/bonk.db';

const getAnimalCharityList = async (req, res) => {
    try {
        let db = new sqlite3.Database(dbDirectory, sqlite3.OPEN_READWRITE, (err)=> {
            if(err) throw new Error(err.message);
            console.log("connection successful");
        });
        const getAllCharity = () => {
            return new Promise((resolve, reject) => {
                db.all('SELECT * FROM charity', (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                });
            });
        };
        let data  = await getAllCharity();

        db.close((err)=>{
            if(err) return console.log(err);
        })
        res.status(200).json({
            code: 200,
            error: false,
            charity: data
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code : 400,
            message : "Something went wrong",
            error: true
        })
    }

    
}

export default getAnimalCharityList;