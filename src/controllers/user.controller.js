import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Op} from "sequelize"
import {
  isValidEmail,
  isValidPassword,
  isValidUsernameLength,
} from "../utils/validation.js";

const generateAccessAndRefreshToken = async(user)=>{
    try {

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validate: false})
    
        return {accessToken , refreshToken}

    } catch (error) {
        return next(
            new ApiError(
                "Something went wrong while generating access and refresh token",
                500
            )
        )
    }
}

export const registerUser = asyncHandler(async(req,res,next)=>{

    /*
     Check all neccessary data come
     check user already exist with username or email
     check file upload succefully on multer and upload on cloudinary
     created User Object and store in database
     check userCreated Successfully
     send successfull response
     */

    const {username , email , fullName , password } = req.body

    if(
        [username,email,fullName,password].some(field=> field?.trim()=="")
    ){
        throw new ApiError(
            "All fieldsare required",
            400
        )
    }

    // check email is valid
    if(!isValidEmail(email)){
        return next(
            new ApiError(
                "Invalid Email Id"
            )
        )
    }

    // check password is in standard format
    if(!isValidPassword(password)){
        return next(
            new ApiError(
                "Password Should contain at lease 8 character in which one Uppercase letter , one lowercase letter , one number , one special character",
                400
            )
        )
    }

    // check usernamw have length > 4 and < 20
    if(!isValidUsernameLength(username)){
        return next(
            new ApiError(
                "username length should be grater than 4 character and less than 20 character",
                400
            )
        )
    }

    const isUserExist = await User.findOne({
        where:{
            [Op.or] : [{email},{username}]
        }
    })

    if(isUserExist){
        return next( new ApiError(
            "User already exist with Username or email",
            409
        )) 
    }

    if(!(req.files && req.files.avatar && req.files.avatar[0] && req.files.avatar[0].path)){
        throw new ApiError(
            "Missing File for Uploading",
            400
        )
    }

    // Check file upload successfully on multer and then upload on cloudinary
     let avatarLocalPath = req.files?.avatar?.[0]?.path

    if(avatarLocalPath){
        avatarLocalPath = await uploadOnCloudinary(avatarLocalPath)
        if(!avatarLocalPath){
            throw new ApiError(
                "Something Went Wrong while uploading file on Cloudinary",
                500
            )
        }
    }

    let coverImageLocalFilePath =  req.files?.coverImage?.[0]?.path

    if(coverImageLocalFilePath){
        coverImageLocalFilePath = await uploadOnCloudinary(coverImageLocalFilePath)
        if(!coverImageLocalFilePath){
            throw new ApiError(
                "Something went wrong while uploading file on cloudinary",
                500
            )
        }
    }else{
        coverImageLocalFilePath = ""
    }

    const user = await User.create({
        username,
        email,
        fullName,
        password,
        avatar: avatarLocalPath.url,
        coverImage : coverImageLocalFilePath.url
    })

    const createdUser = await User.findByPk(user.id,{
        attributes:{
            exclude: ["password","refreshToken"]
        }
    })

    if(!createdUser){
        throw new ApiError(
            "Something went wrong while registring the user",
            500
        )
    }

    return res.status(201).json(
        new ApiResponse(
            200,
            createdUser,
            "User Created Successfull"
        )
    )
})

export const login = asyncHandler(async(req,res,next)=>{
     
    // take username email and password
    // check username or email mandotary
    // find user found with username and password
    // comapare password
    // generate access and refresh token
    // set a cookies 
    // send a respond to user by removing password and refreshToken

    const {username , email , password} = req.body

    if(!(username || email)){
        return next(
            new ApiError(
                "Username or email is required",
                400
            )
        )
    }

    if(!password){
        return next(
            new ApiError(
                "Password is required",
                400
            )
        )
    }

    const user = await User.findOne({
        where:{
            [Op.or] : [{email},{username}]
        }
    })

    if(!user){
        return next(
            new ApiError(
                "User does not found",
                404
            )
        )
    }

    const isPasswordMatched = await user.isPasswordCorrect(password)

    if(!isPasswordMatched){
        return next(
            new ApiError(
                "Invalid User credentials",
                401
            )
        )
    }

    const { accessToken , refreshToken } = await generateAccessAndRefreshToken(user)

    const loggedInUser = await User.findByPk(user.id,{
        attributes:{
            exclude: ["password","refreshToken"]
        }
    })

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res.
    status(200)
    .cookie("accessToken" , accessToken , cookieOptions)
    .cookie("refreshToken" , refreshToken ,  cookieOptions)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "logged in successfull"
        )
    )
})


export const logOut = asyncHandler(async(req,res,next)=>{
    await User.update(
        {refreshToken: null},
        {
            where: {id: req.user.id},
            returning: true
        }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .clearCookie("accessToken" , cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
        new ApiResponse(
            200,
            {},
            "logOut successfully"
        )
    )
})


