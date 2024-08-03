import express from 'express';
import { acceptFriendRequest, getMyFriendss, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from '../controllers/user.js';
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from '../lib/validators.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { singleAvatar } from '../middlewares/multer.js';


const app=express.Router();

app.post("/new" ,singleAvatar,registerValidator(), validateHandler,newUser);
app.post("/login",loginValidator(),validateHandler , login);

//after that user nedd to be logged in 
app.use(isAuthenticated);

app.get("/me",getMyProfile);
app.get("/logout",logout);
app.get("/search",searchUser);
app.put("/sendrequest",sendRequestValidator(),validateHandler,sendFriendRequest);
app.put("/acceptrequest",acceptRequestValidator(),validateHandler,acceptFriendRequest);

app.get("/notifications",getMyNotifications);
app.get('/friends',getMyFriendss)

export default app;
