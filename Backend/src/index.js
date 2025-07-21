import dotenv from "dotenv"

import connectDB from "./db/index.js";

import app from './app.js'   //app import from app.js and because in app.js we have express 

dotenv.config({

    path: './.env'

})







connectDB()  //imported from /db/index.js  // after async function in db/index.js we use promise always

.then(() => {

    app.listen(process.env.PORT || 8000, () => {

        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);

    })

})

.catch((err) => {

    console.log("MONGO db connection failed !!! ", err);

})


