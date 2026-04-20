import { Router } from "express";
import {signup , login , guestLogin} from '../services/user/auth/index.js'
import {
    createTodo,updateCompletionStatus,deleteTodo,editTodo ,getUserTodos,getUserProfile  ,getStatus
 } from '../services/user/controller/user_controller.js'
import { validateToken  , checkLoginStatus} from "../services/user/middleware/auth_middleware.js";
const userRouter = Router();

// auth 
userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/guest-login',guestLogin);
// user

userRouter.post('/todo/create',validateToken,createTodo);
userRouter.put('/todo/updateStatus',validateToken,updateCompletionStatus);
userRouter.delete('/todo/delete',validateToken,deleteTodo);
userRouter.put('/todo/edit',validateToken,editTodo);
userRouter.get('/todo/getall',validateToken ,getUserTodos);
userRouter.get('/profile',validateToken,getUserProfile);
userRouter.get('/status',checkLoginStatus,getStatus);
export default userRouter;