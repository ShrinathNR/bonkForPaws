import updateAnimalCharityListJson from "../../handlers/updateAnimalCharityListJson.js";
const updateAnimalCharityList = async (req, res) => {
    try {
        await updateAnimalCharityListJson();
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
