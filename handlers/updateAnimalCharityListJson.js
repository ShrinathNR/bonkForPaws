import axios from "axios";
import fs from 'fs'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import getAccessToken from "./getAccessToken.js";
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config()
const baseURL = process.env.TGB_API_URL;
import sqlite3 from "sqlite3";
sqlite3.verbose();
const dbDirectory = __dirname+'./../db/bonk.db';

const getAllOrganization = async (accessToken) => {
    const getoptions = {
        method: 'GET',
        url: `${baseURL}/organizations/list`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };
    try {
        let organizations = (await axios.request(getoptions)).data.data.organizations;
        return organizations
    } catch (error) {
        console.log(error);
    }
};



const getOrganizationById = async (id, accessToken) => {
    const options = {
        method: 'GET',
        url: `${baseURL}/organization/${id}`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const organization = (await axios.request(options)).data.data.organization;
        return organization
    } catch (error) {
        console.log(error);
    }
};

const delay = (ms) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
});


const getAnimalCharities = async (organizations, accessToken, delayMs = 90) => {
    let db = new sqlite3.Database(dbDirectory, sqlite3.OPEN_READWRITE, (err)=> {
        if(err) return console.log(err);
        console.log("connection successful");
    });
    const dropTable = () => {
        return new Promise((resolve, reject) => {
            db.run('DROP TABLE IF EXISTS charity', (err) => {
                if(err) {
                  console.error('Error dropping table:', err.message);
                }
                console.log('Table dropped successfully and new values are getting updated');
                resolve();
            });
        });
    };
    const addCharityTable = () => {
        return new Promise((resolve, reject) => {
            db.run('CREATE TABLE charity(id, logo, name, allowsAnon, isReceiptEnabled)', (err) => {
                if(err) {
                  console.error('Error creating charity table:', err.message);
                }
                console.log('table animal charity created');
                resolve();
            })
        });
    };
    

    await dropTable();
    await addCharityTable();
    
    const res = [];
    for (const org of organizations) {
        await delay(delayMs);
        const details = await getOrganizationById(org.id, accessToken);
        
        if (details.categories.some(itm => itm.id === 2) && details.areCryptoDonationsEnabled) {
            console.log(`${details.name} : row has been inserted`);
            const isReceiptEnabled = details.isReceiptEnabled ? details.isReceiptEnabled.toString() : "false";
            db.run(`INSERT INTO charity(id, logo, name, allowsAnon, isReceiptEnabled) VALUES(?,?,?,?,?)`,
                [details.id, details.logo, details.name, details.allowsAnon.toString(), isReceiptEnabled], (err)=>{
                if(err) return console.log(err);
                
                

            })
            res.push({
                id: details.id,
                logo: details.logo,
                name: details.name,
                allowsAnon: details.allowsAnon,
                isReceiptEnabled:isReceiptEnabled,
            })
        }
    }
    console.log("inserted all the data");
    db.close((err)=>{
        if(err) return console.log(err);
    })
    return res;
}

const updateAnimalCharityListJson = async () => {
        let accessToken = await getAccessToken();
        console.log(accessToken);
        let organizations = await getAllOrganization(accessToken);
        console.log(organizations.length); 
        // 193 charities after filter
        let animalCharity = await getAnimalCharities(organizations, accessToken);
        console.log(animalCharity);
        console.log(animalCharity.length);

        const jsonArray = JSON.stringify(animalCharity, null, 2);

        const realtive_filePath = './../output.json';
        const absolute_filePath = path.join(__dirname, realtive_filePath);
        fs.writeFile(absolute_filePath, jsonArray, 'utf8', (err)=> {
            console.log(err);  
        });
}

export default updateAnimalCharityListJson;