import express from "express";
import cors from "cors";
import taskRoutes from "./routes/task.js";
import authRoutes from "./routes/auth.js";
import mongoose from "mongoose";
import 'dotenv/config'
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Mongodb Connected"))
  .catch((err) => console.log("error in connection",err));

app.get("/", (req, res) => res.send(new Date()));
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);


app.listen(PORT, () => console.log("Server runing on PORT " + PORT));
