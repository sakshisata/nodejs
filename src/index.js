import dotenv from "dotenv";
import connectDB from "./database/index.js";
import {app} from "./app.js";

dotenv.config({
    path: "./.env"
})


connectDB()
.then(()=>{
    app.on("error", (error) =>{
        console.log("error while running", error)
        throw error
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("mongodb connection failed",err);
})

