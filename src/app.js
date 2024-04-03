import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorMiddleware from "./middlewares/error.middleware.js"


const app = express()

app.use(express.json({limit: "50kb"}))
app.use(express.urlencoded({extended: true , limit: "50kb"}))
app.use(express.static("public"))
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
    }
))
app.use(cookieParser())


// Import Routes
import userRouter from "./routes/user.route.js"

app.use("/api/v1/user",userRouter)

app.use(errorMiddleware)

export default app