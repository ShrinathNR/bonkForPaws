import axios from "axios";
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

export default getAccessToken;