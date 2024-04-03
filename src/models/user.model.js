import {sequelize} from "../db/index.js"
import { DataTypes } from "sequelize"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

const User = sequelize.define("User",{
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            notEmpty:{
                msg: "Username is required"
            },
            len:{
                args: [4,30],
                msg: "Username should greater than 4 character and less than 30 character"
            }
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            notEmpty:{
                msg: "email is required"
            },
            isEmail:{
                msg: "Invalid email Address"
            }
        }
    },
    avatar:{
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty:{
            msg: "Avatar is Required"
        }
    },
    coverImage:{
        type: DataTypes.STRING,
        allowNull: true
    },
    fullName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg: "FullName is Required"
            }
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg: "Password is required"
            }
        }
    },
    refreshToken:{
        type: DataTypes.STRING,
        defaultValue: undefined
    }
},{
    hooks:{
        beforeCreate : async (user)=>{
            user.password =  await bcrypt.hash(user.password , 10)
        },
        beforeUpdate: async (user)=>{
            if(user.changed("password")){
                user.password =  await bcrypt.hash(user.password , 10)
            }
        },
        beforeValidate: (instance, options)=>{
            if(instance.username){
                instance.username = instance.username.trim().toLowerCase()
            }
            if(instance.email){
                instance.email = instance.email.trim().toLowerCase()
            }
        }
    }
})

User.prototype.isPasswordCorrect = async function(password){
    return bcrypt.compare(password,this.password)
}

User.prototype.generateAccessToken = function (){
    return jwt.sign(
        {
            id : this.id,
            email: this.email,
        },
        process.env.ACCEESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCEESS_TOKEN_EXPIRE
        }
    )
}

User.prototype.generateRefreshToken = function (){
    return jwt.sign(
        {
            id : this.id,
            email: this.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}

User.prototype.generateForgotPasswordToken = function(){
    return jwt.sign(
        {
            id: this.id
        },
        process.env.FORGOT_TOKEN_SECRET,
        {
            expiresIn: process.env.FORGOT_TOKEN_EXPIRE
        }
    )
}

export default User