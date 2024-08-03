import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import {v4 as uuid } from 'uuid'
import {v2 as cloudinary} from 'cloudinary'
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOption={
        maxAge: 15*24*60*60*1000,
        sameSite:"none",
        httpOnly:true,
        secure:true,
}

const connectDB = (uri)=>{
    if (!uri) {
        throw new Error('MongoDB connection URI is undefined');
      }
    mongoose
    .connect(uri,{dbName:"chatapp"})
    .then((data)=> console.log(`connected to DB: ${data.connection.host}`))
    .catch((error)=> {
        throw error;
    });
};

const sendToken=(res,user,code,message)=>{

    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);  

    return res.status(code).cookie("letstalk-token",token,cookieOption).json({
        success:true,
        user,
        message,
    });
};

const emitEvent=(req,event,users,data)=>{
    const io=req.app.get("io")
    const userSocket=getSockets(users);
    io.to(userSocket).emit(event,data)
};

const updateFilesToCloudinary=async(files=[])=>{

    const uploadPromises=files.map((file)=>{
        return new Promise((resolve,reject)=>{
            cloudinary.uploader.upload(
                getBase64(file),
                {
                resource_type:"auto",
                public_id:uuid()
            },
            (error,result)=>{
                if(error) return reject(error);
                resolve(result);
            }
        );
        });
    });

    try {
        const results=await Promise.all(uploadPromises);

        const formatteResults= results.map((result)=>({
            public_id:result.public_id,
            url:result.secure_url,
        }));
        return formatteResults;
    } catch (err) {
        throw new Error("Error uploading files to cloudinary",err);
    }

};

const deleteFilesFromCloudinary=async(public_ids)=>{

};

export { 
    connectDB ,
    sendToken ,
    cookieOption,
    emitEvent,
    updateFilesToCloudinary,
    deleteFilesFromCloudinary,
};