import express from 'express';
import { adminLogin, adminLogout, allChats, allMessage, allUsers, getAdminData, getDashboardStats } from '../controllers/admin.js';
import { adminLoginValidator, validateHandler } from '../lib/validators.js';
import { adminOnly } from '../middlewares/auth.js';

const app=express.Router();



app.post("/verify",adminLoginValidator(),validateHandler,adminLogin);

app.get("/logout",adminLogout);

//only accessible to admin

app.use(adminOnly)

app.get("/",getAdminData);

app.get("/users",allUsers);
app.get("/chats",allChats);
app.get("/messages",allMessage);

app.get("/stats",getDashboardStats);

export default app;