import { User , Todo } from "../../../models/userModel.js";
import redisServer from '../../../Database/redis.js';

const toDo_redisKey = 'todos:userId:';

async function updateTodoInCache(userId, ) {
    try {
        const redisKey = `${toDo_redisKey}${userId}`;
        const del_todos = await redisServer.del(redisKey);
        if (del_todos) {
            console.log(`Deleted existing todos for userId ${userId} from Redis cache`);
            // Fetch the updated list of todos from the database
            const todos = await Todo.find({ userId });
            if (todos) {
                // Store the updated list of todos in Redis cache
                await redisServer.set(redisKey, JSON.stringify(todos) , 'EX', 900); 
                console.log(`Updated todos for userId ${userId} in Redis cache`);
            }
        }
    } catch (error) {
        console.error("Error updating todo in cache:", error);
    }
}


async function createTodo(req,res){
    try {
        const {title,description} = req.body;
        const userId = req.userId;
        if(!title || !description){
            return res.status(400).json({
                success:false,
                message:"Please provide all the required fields"
            });
        }
        const todo = await Todo.create({
            userId,
            title,
            description
        });
        if(!todo){
            return res.status(400).json({
                success:false,
                message:"Todo creation failed"
            });
        }
        await updateTodoInCache(userId);
        return res.status(200).json({
            success:true,
            message:"Todo created successfully",
            todo
        });
    } catch (error) {
        console.error("Error in createTodo:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}


async function updateCompletionStatus(req,res){
    try {
        const {id , status} = req.query;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"Please provide the todo id"
            });
        }
        const updatedTodo = await Todo.findByIdAndUpdate(id,{completed: status},{new:true});
        if(!updatedTodo){
            return res.status(400).json({
                success:false,
                message:"Todo not found"
            });
        }
        await updateTodoInCache(updatedTodo.userId);
        return res.status(200).json({
            success:true,
            message:"Todo updated successfully",
            updatedTodo
        });
    } catch (error) {   
        console.error("Error in updateCompletionStatus:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}


async function deleteTodo(req,res){
    try {
        const {id} = req.query; 
        if(!id){
            return res.status(400).json({
                success:false,
                message:"Please provide the todo id"
            });
        }
        const deletedTodo = await Todo.findByIdAndDelete(id);   
        if(!deletedTodo){
            return res.status(400).json({
                success:false,
                message:"Todo not found"
            });
        }
        await updateTodoInCache(deletedTodo.userId);
        return res.status(200).json({
            success:true,
            message:"Todo deleted successfully",
            deletedTodo
        });
    } catch (error) {
        console.error("Error in deleteTodo:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}


async function editTodo(req,res){
    try {
        const {id} = req.query;
        const {title,description} = req.body;

        if(!id){
            return res.status(400).json({
                success:false,
                message:"Please provide the todo id"
            });
        }

        if(!title || !description){
            return res.status(400).json({
                success:false,
                message:"Please provide all the required fields"
            });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(id, {title,description}, {new:true});
        await updateTodoInCache(updatedTodo.userId);
        if(!updatedTodo){
            return res.status(400).json({
                success:false,
                message:"Todo not found"
            });
        }

        return res.status(200).json({
            success:true,
            message:"Todo updated successfully",
            updatedTodo
        });
    } catch (error) {
        console.error("Error in editTodo:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}


async function getUserTodos(req,res){
    try {
        const userId = req.userId;
        console.log("Fetching todos for userId:", userId);
        const cached = await redisServer.get(`${toDo_redisKey}${userId}`);
        if(cached){
            console.log("Todos fetched from Redis cache for userId:", userId);
            const todos = JSON.parse(cached);
            return res.status(200).json({
                success:true,
                message:"Todos fetched successfully (redis cache)",
                todos
            });
        }
        console.log("Fetching todos from database for userId:", userId);
        const todos = await Todo.find({userId});
        if(!todos){
            return res.status(400).json({
                success:false,
                message:"No todos found"
            }); 
        }
        // Store the fetched todos in Redis cache for future requests
        await redisServer.set(`${toDo_redisKey}${userId}`, JSON.stringify(todos), 'EX', 900);

        return res.status(200).json({
            success:true,
            message:"Todos fetched successfully (db fetch)",
            todos
        });
    } catch (error) {
        console.error("Error in getUserTodos:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}

async function getUserProfile(req,res){
    try {
        const userId = req.user._id;
        const user = await User.findById(userId ,{password:0 , __v:0 });
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }
        return res.status(200).json({
            success:true,
            message:"User profile fetched successfully",
            user
        });
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}


async function getStatus(req,res){
    console.log("Checking login status for userId:");   
    try {

        const LoginStatus = req.LoginStatus;
        if(!LoginStatus){
            return res.status(401).json({
               status:false,
            });
        }
        return res.status(200).json({"status":true});
    } catch (error) {
        console.error("Error in getStatus:", error);
        return res.status(500).json({
            success:false,
        });
    }
}
export {createTodo,updateCompletionStatus,deleteTodo,editTodo ,getUserTodos,getUserProfile,getStatus};