import axios from "axios";
import fs from 'fs'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import getAccessToken from "./getAccessToken";
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config()
const baseURL = process.env.TGB_API_URL;

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
    const res = [];
    for (const org of organizations) {
        await delay(delayMs);
        const details = await getOrganizationById(org.id, accessToken);
        if (details.categories.some(itm => itm.id === 2)) {
            res.push({
                id: details.id,
                logo: details.logo,
                name: details.name
            })
        }
    }
    return res;
}

const updateAnimalCharityListJson = async () => {
    try {
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
    } catch (error) {
        console.log(error);
    }
    
}

export default updateAnimalCharityListJson;