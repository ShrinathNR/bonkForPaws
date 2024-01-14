import data from "../../output.json" with {type:"json"};

const getAnimalCharityList = async (req, res) => {
    try {
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