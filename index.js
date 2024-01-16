import express from 'express';
import cors from 'cors';
import bodyparser from "body-parser";
import * as dotenv from 'dotenv';
dotenv.config();

const app = express()

app.use(cors());
app.use(bodyparser.json());
app.use(express.json());

import router from './routes/api.js'

app.use('/api', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`);
})

app.use((req, res) => {
    res.status(200).json({
      name: "Bonk for Paws RESTful API",
      message: "NOT FOUND"
    });
});

