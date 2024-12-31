import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process?.env?.JWT_SECRET);
        console.log("decoded" , decoded);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: true, message: "Invalid or expired token" });
    }
};
