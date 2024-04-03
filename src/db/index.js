import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

export const sequelize = new Sequelize(process.env.DATABASE_URI)

export const connectDB = async()=>{
    try {
        const connectionInstance = await sequelize.sync()
        console.log("DATABASE CONNECTED ON HOST", connectionInstance.config.host)
    } catch (error) {
        console.log("DATABASE CONNECTION FAILED", error)
    }
}
