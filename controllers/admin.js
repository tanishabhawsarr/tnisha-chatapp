import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import {cookieOption} from '../utils/feature.js'
import { adminSecretKey } from "../app.js";

const adminLogin=TryCatch(async(req,res,next)=>{

    const {secretKey}=req.body; 

    const isMatched=secretKey===adminSecretKey;

    if(!isMatched) return next(new ErrorHandler("You are not authroized to access this Page",401));

    const token=jwt.sign(secretKey,process.env.JWT_SECRET);
     return res.status(200).cookie("Lestalk-admin-token",token,{...cookieOption,maxAge:1000*60*15}).json({
        success:true,
        message:"Authenticated successfully,Welcome BOSS",
     });
});

const adminLogout=TryCatch(async(req,res,next)=>{

     return res
     .status(200)
     .cookie("Lestalk-admin-token","",{
        ...cookieOption,
        maxAge:0,
    })
     .json({
        success:true,
        message:"Logged out successfully",
     });
});

const getAdminData=TryCatch(async(req,res,next)=>{
    return res.status(200).json({
        admin:true,
    })
});

const allUsers=TryCatch(async(req,res)=>{

    const users=await User.find({});

    const transformedUsers= await Promise.all(
        users.map(async({name,username,avatar,_id})=>{
    
            const [groups,friends]=await Promise.all([
                Chat.countDocuments({groupchat:true,members:_id}),
                Chat.countDocuments({groupchat:false,members:_id}),
            ]);
    
            return{
                name,
                username,
                avatar:avatar.url,
                _id,
                groups,
                friends,
            };
        })
    );

    return res.status(200).json({
        status:"success",
        users:transformedUsers,
    });
});

const allChats=TryCatch(async(req,res)=>{
    const chats=await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator","name avatar");

    const transformedChats=await Promise.all(
        chats.map(async({members,_id,groupchat,name,creator})=>{
            const totalMessage=await Message.countDocuments({chat:_id});

        return{
            _id,
            groupchat,
            name,
            avatar:members.slice(0,3).map((members)=>members.avatar.url),
            members:members.map(({_id,name,avatar})=>{
                return{
                    _id,
                    name,
                    avatar:avatar.url,
                }}),
            creator: creator
                        ? {
                              name: creator.name , 
                              avatar: creator.avatar.url,
                          }
                        : {
                              name: "none",
                              avatar: "",
                          },
            totalmembers:members.length,
            totalMessage,
        };
    }
    ));

    return res.status(200).json({
        status:"success",
        chats:transformedChats,
    });

});

const allMessage=TryCatch(async(req,res)=>{
const messages=await Message.find({})
.populate("sender","name avatar")
.populate("chat","groupchat");

const transformedMessages=messages.map(({content,attachments,_id,sender,createdAt,chat})=>({
    _id,
    attachments,
    content,
    createdAt,
    chat:chat? chat._id:null,
    groupchat:chat?chat.groupchat:false,
    sender:sender?{
        _id:sender._id,
        name:sender.name,
        avatar:sender.avatar.url,
    }:{
        _id:null,
        name:"unknown",
        avatar:"",
    },
}))

return res.status(200).json({
    success:"true",
    messages:transformedMessages,
})
});

const getDashboardStats=TryCatch(async(req,res)=>{

    const[groupsCount,usersCount,messagesCount,totalChatsCount]=await Promise.all([
        Chat.countDocuments({groupchat:true}),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
    ]);

    const today=new Date();

    const last7days=new Date();
    last7days.setDate(last7days.getDate()-7);

    const last7daysMessages=await Message.find({
        createdAt:{
            $gte:last7days,
            $lte:today,
        },
    }).select("createdAt");

    const messages=new Array(7).fill(0);
    const dayInMiliseconds=1000*60*60*24;

    last7daysMessages.forEach((message)=>{
        const indexApprox=
        (today.getTime()-message.createdAt.getTime())/ dayInMiliseconds;
        const index=Math.floor(indexApprox);

        messages[6-index]++;
    })

    const stats={
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart:messages,
    };
      
    return res.status(200).json({
       success:"true",
       stats,
    })
});



export {allUsers,allChats,allMessage,getDashboardStats,adminLogin,adminLogout,getAdminData};