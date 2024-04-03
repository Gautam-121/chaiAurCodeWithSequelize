import app from "./app.js"
import { connectDB } from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 3000

process.on("uncaughtException" , (error)=>{
    console.log("Connection Closed because of uncaught Exception Error" , error.message)
    process.exit(1)
})


connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      console.log("Server listening on port", port);
    });

    process.on("unhandledRejection", ()=>{
        console.log("Connection Closed because of unhandled Promised Rejection")
        server.close(()=>{
            process.exit(1)
        })
    })
  })
  .catch((error) => {
    console.log("DATABASE CONNECTION FAILED", error);
  });


