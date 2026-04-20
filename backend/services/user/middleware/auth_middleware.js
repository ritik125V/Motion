import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function validateToken(req, res, next) {
    try {
        const token = req.cookies["motion-tk"];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        console.log("Decoded token:", decoded);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Error in validateToken:", error);
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }   
}


async function checkLoginStatus(req, res ,next) {
    try {
        let LoginStatus = false
        const token = req.cookies["motion-tk"];
        if (!token) {
            req.LoginStatus = false;
            return next();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            req.LoginStatus = false;
            return next();
        }
        req.LoginStatus = true;
        next();
    } catch (error) {
        req.LoginStatus = false;
        next();
    }
}
export { validateToken, checkLoginStatus };
