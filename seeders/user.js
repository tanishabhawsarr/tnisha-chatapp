import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { faker, simpleFaker } from "@faker-js/faker"


const createUser=async(numUsers)=>{
    try {

        const usersPromise=[];
         
        for(let i=1;i<numUsers;i++){

            const tempUsers=User.create({
                name:faker.person.fullName(),
                username:faker.internet.userName(),
                bio:faker.lorem.sentence(10),
                password:"password",
                avatar:{
                    url:faker.image.avatar(),
                    public_id:faker.system.fileName(),
                },
            });
            usersPromise.push(tempUsers);
        }

        await Promise.all(usersPromise);

        console.log("Users created",numUsers);
        process.exit(1);

    } 
    catch (error) 
    {
        console.error(error);
        process.exit(1);
    };
};

const createSingleChats=async(numChats)=>{
    try {
        const users=await User.find().select("_id");

        const chatsPromise=[];

        for(let i=0;i<users.length;i++){
            for(let j=i+1;j<users.length;j++){
              chatsPromise.push(
                Chat.create({
                    name:faker.lorem.words(2),
                    members:[users[i],users[j]],
                })
              );
            }
        }

        await Promise.all(chatsPromise);

        console.log("Chat created successfully");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const createGroupChats=async(numChats)=>{
    try {
        const users=await User.find().select("_id");

        const chatsPromise=[];

        for(let i=0;i<numChats;i++){
            const numMembers=simpleFaker.number.int({min:3,max:users.length});
            const members=[];


            for(let i=0;i<numMembers;i++){
                const randomIndex=Math.floor(Math.random()*users.length);
                const randomUser=users[randomIndex];

                if(!members.includes(randomUser)){
                    members.push(randomUser);
                }
            }
              
            const chat=Chat.create({
                groupchat:true,
                name:faker.lorem.words(1),
                members,
                creator:members[0],      
            });

            chatsPromise.push(chat);
        }

        await Promise.all(chatsPromise);

        console.log("Chats created successfully");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const createMessage=async(numMessages)=>{
    try {
        const users=await User.find().select("_id");
        const chats=await Chat.find().select("_id");

        const messagesPromise=[];

        for(let i=0;i<numMessages;i++){
            const randomUser=users[Math.floor(Math.randon()*users.length)];
            const randomChat=chats[Math.floor(Math.random()*chats.length)];

            messagesPromise.push(
                Message.create({
                    chat:randomChat,
                    sender:randomUser,
                    content:faker.lorem.sentence,
                })
            );
        }
         
        await Promise.all(messagesPromise);

        console.log("Message created successfully");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const createMessageInAChat=async(chatId,numMessages)=>{
    try {
        const users=await User.find().select("_id");

        const messagePromise=[];

        for(let i=0;i<numMessages;i++){
            const randomUser=users[Math.floor(Math.random()*users.length)];

            messagePromise.push(
                Message.create({
                    chat:chatId,
                    sender:randomUser,
                    content:faker.lorem.sentence(),
                })
            );
        }

        await Promise.all(messagePromise);

        console.log("Message created successfully");
        process.exit();

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export {createUser,createSingleChats,createGroupChats,createMessage,createMessageInAChat};
