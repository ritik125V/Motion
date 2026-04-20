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
userRouter.put('/todo/updateStatus',updateCompletionStatus);
userRouter.delete('/todo/delete',deleteTodo);
userRouter.put('/todo/edit',editTodo);
userRouter.get('/todo/getall',validateToken ,getUserTodos);
userRouter.get('/profile',getUserProfile);
userRouter.get('/status',checkLoginStatus,getStatus);
export default userRouter;