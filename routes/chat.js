import express from 'express';
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments } from '../controllers/chat.js';
import { addMembersValidator, chatIdValidator, newGroupValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, validateHandler } from '../lib/validators.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { attachmentsMulter } from '../middlewares/multer.js';


const app=express.Router();


//after that user nedd to be logged in 
app.use(isAuthenticated);

app.post('/new',newGroupValidator(),validateHandler,newGroupChat);

app.get('/my',getMyChats);

app.get('/my/groups',getMyGroups);

app.put('/addmembers',addMembersValidator(),validateHandler,addMembers );

app.put('/removemembers',removeMemberValidator(),validateHandler,removeMember);

app.delete('/leave/:id',chatIdValidator(),validateHandler,leaveGroup);

//send attachments
app.post('/message',attachmentsMulter,sendAttachmentsValidator(),validateHandler,sendAttachments);

//get message
app.get('/message/:id',chatIdValidator(),validateHandler,getMessages)

//get chat details,rename and delete
app
.route('/:id')
.get(chatIdValidator(),validateHandler,getChatDetails)
.put(renameValidator(),validateHandler,renameGroup)
.delete(chatIdValidator(),validateHandler,deleteChat);



export default app;
