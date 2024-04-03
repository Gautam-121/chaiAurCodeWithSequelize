import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localfilepath)=>{
    try {
        // check localfilePath comes
        if(!localfilepath){
            return null
        }

        // Upload file on cloudinary
        const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type: "auto"
        })

        // file Uploaded Successfully
        fs.unlinkSync(localfilepath)

        // return uploaded file object comes from cloudinart
        return response

    } catch (error) {
        // geeting error while uploading unlink the file from local
        fs.unlinkSync(localfilepath)
        return null
    }
}

export default uploadOnCloudinary