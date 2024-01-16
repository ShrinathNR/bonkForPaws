import axios from "axios";
const baseURL = process.env.TGB_API_URL;
import getAccessToken from "../../handlers/getAccessToken.js";

const getDonationAddress = async (req, res) => {
    try {
        const {
            organizationId, 
            isAnon, 
            pledgeCurrency, 
            pledgeAmount,
            receiptEmail,
            firstName,
            lastName,
            addressLine1,
            addressLine2,
            country,
            state,
            city,
            zipcode
        } = req.body;
        let data = {
            organizationId: organizationId,
            isAnonymous: isAnon,
            pledgeCurrency: pledgeCurrency,
            pledgeAmount: pledgeAmount,
            receiptEmail: receiptEmail,
        }

        if (!isAnon){
            addtionalDetails = {
                    firstName: firstName,
                    lastName: lastName,
                    addressLine1: addressLine1,
                    addressLine2: addressLine2,
                    country: country,
                    state: state,
                    city: city,
                    zipcode: zipcode
            }
            data = Object.assign(data, addtionalDetails); 
        }
        const accessToken = await getAccessToken()
        const options = {
            method: 'POST',
            url: `${baseURL}/deposit-address`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            data: data
        };
        const donationAddress = (await axios.request(options)).data.data.depositAddress;

        res.status(200).json({
            code: 200,
            error: false,
            donationAddress : donationAddress
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

export default getDonationAddress;