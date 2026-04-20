import bcrypt from "bcrypt";
import { User , Todo } from "../../../models/userModel.js";
import redisServer from '../../../Database/redis.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

async function signup(req,res){
    try {
        const {name,email , password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide all the required fields"
            });
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 15);
        const user = await User.create({name,email,password:hashedPassword});
        return res.status(200).json({
            success:true,
            message:"User created successfully",
            user
        });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("motion-tk", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.IS_PROD === "true",
      sameSite: process.env.IS_PROD === "true" ? "None" : "Lax",
    });

    const refinedUser = {
      _id: user._id,
      email: user.email,
      name: user.name, 
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: refinedUser,
    });

  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const guestUser = 'guest_user:userId:';
async function guestLogin(req ,res){
    try {
        const guestEmail = `guest_${Date.now()}@example.com`;
        const guestPassword = `guest_${Date.now()}`;
        const hashedPassword = await bcrypt.hash(guestPassword, 15);
        const guestUser = await User.create({name:"Guest User", email:guestEmail, password:hashedPassword});
        if(!guestUser){
            return res.status(400).json({
                success:false,
                message:"Guest user creation failed"
            });
        }
        await redisServer.set(`guest_user:userId:${guestUser._id}`, JSON.stringify(guestUser));
        res.cookie("motion-tk", jwt.sign(
            { userId: guestUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        ), {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.IS_PROD === "true",
            sameSite: process.env.IS_PROD === "true" ? "None" : "Lax",
        });
        return res.status(200).json({
            success:true,
            message:"Guest user created successfully",
            user: guestUser
        });

    } catch (error) {
        console.error("Error in guestLogin:", error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}

export {signup, login, guestLogin};
