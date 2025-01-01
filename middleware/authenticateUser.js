import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserSchema.js";

export const authenticateUser = async (req, res, next) => {
    const bearerToken = req.headers?.authorization;
    if (!bearerToken)
        return res.status(403).json({
            message: "Token not provided",
            error: true,
        })

    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process?.env?.JWT_SECRET);
    console.log('decoded' , decoded);
    if (decoded) {
        const user = await UserModel.findById(decoded?.id);
        console.log("user after search in db", user);
        if (user) {
            req.user = user
            next()
        } else {
            return res.status(403).json({
                message: "User not found",
                error: true,
            })
        }
    } else {
        return res.status(403).json({
            message: "Invalid Token",
            error: true,
        })
    }
};
