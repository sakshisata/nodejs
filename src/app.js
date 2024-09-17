import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


import rateLimit from "express-rate-limit"
import PQueue from "p-queue"

const app = express()
const queue = new PQueue({ concurrency: 1 });

//Case 1 --> to limit every user to wait 5 second before new request to server
// let ratelimit = rateLimit({
//     max: 1,
//     windowMs: 5000,
//     message: "Wait 5 second to send new request"
// })
// app.use('/api', ratelimit);

// Case 2 --> to limit every user to wait 1 second before new request to server
// because that user already sended 1 request within a second so their request goes to queue and processed after 5sec
let rateLimitPerSecond = rateLimit({
    max: 1,
    windowMs: 1*1000,
    message: "Wait 1 second to send new request",
    handler: (req, res, next) => {
        queue.add(() => new Promise(resolve => setTimeout(resolve, 5000))) // You will get response after 5 sec
            .then(() => next()) 
            .catch(err => res.status(429).json({ message: err.message }));
    }
})
// Case 3 --> to limit every user to wait 1 minute before new request 
// because that user already sended 20 request within a minute so their request goes to queue and processed after 10sec
let rateLimitPerMinute = rateLimit({
    max: 20,
    windowMs: 60*1000,
    message: "You already send 20 request to server,Wait 1 minute to send new request->Sans toh lene de be!",
    handler: (req, res, next) => {
        queue.add(() => new Promise(resolve => setTimeout(resolve, 10 * 1000))) // Your request processed autometic wait 10 second
            .then(() => next()) 
            .catch(err => res.status(429).json({ message: err.message })); 
    }
})

app.use('/api', rateLimitPerSecond,rateLimitPerMinute);


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(cookieParser())

import userRouter from "./routes/userRoute.js"
import taskRouter from "./routes/taskRoute.js"

app.use("/api/users", userRouter)
app.use("/api/tasks", taskRouter)

app.all('*', (req,res,next) =>{
    res.status(400).json({
        message: 'this route does not exists'
    })
})
export {app}