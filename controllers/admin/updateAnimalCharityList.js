import axios from "axios";
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()
const [login, password, baseURL] = [
    process.env.TGB_API_LOGIN, 
    process.env.TGB_API_PASSWORD, 
    process.env.TGB_API_URL
];

const getAccessToken = async () => {
    const postoptions = {
        method: 'POST',
        url: `${baseURL}/login`,
        headers: {'Content-Type': 'application/json'},
        data: {
            login: login,
            password: password
        }
    };   
    try {
        let accessToken = (await axios.request(postoptions)).data.data.accessToken;
        return accessToken
    } catch (error) {
        console.log(error);
    }
}

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

const updateAnimalCharityList = async (req, res) => {
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

        const filePath = '../../output.json';
        fs.writeFile(filePath, jsonArray, 'utf8', (err)=> {
            console.log(err);  
        });

        res.status(200).json({
            code: 200,
            error: false,
            message:"updated successfully"
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

export default updateAnimalCharityList;
