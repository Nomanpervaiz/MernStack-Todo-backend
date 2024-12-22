import express from "express";
import { z } from "zod";
import { UserModel } from "../models/UserSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import 'dotenv/config'
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.get("/login", authenticateUser, async (req, res) => {
  try {
    console.log("token ===> " , req.user);
    const users = await UserModel.find()
    res.status(200).json({
      error: false,
      message: "Get Data Fetched successfully",
      users,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: "Error in getting Data!" || error.message,
    });
  }
});


router.get("/register", async (req, res) => {
  try {
    const users = await UserModel.find()
    res.status(200).json({
      error: false,
      message: "Get Data Fetched successfully",
      users,
    });

  } catch (error) {
    res.status(400).json({
      error: true,
      message: "Error in getting Data!" || error.message,
      tasks,
    });
  }
});


// Register Flow <==
// Zod Schema for validation <==
let userschema = z.object({
  fullname: z.string().trim().min(3),
  email: z.string().email().trim(),
  password: z.string().min(8).trim(),
  role: z.enum(["user", "admin"]).optional().default("user")
})
// This function Register user in my backend <==
router.post("/register", async (req, res) => {
  try {
    const validateUser = userschema.parse(req.body);
    console.log("validateUser", validateUser)
    let user = await UserModel.findOne({ email: validateUser.email })
    if (user) {
      return res.status(403).json({
        error: true,
        message: "User already Exist",
        data: null
      })
    }

    const hashPassword = await bcrypt.hash(validateUser.password, 12)
    validateUser.password = hashPassword

    let newUser = new UserModel({ ...validateUser })
    newUser = await newUser.save()
    res.status(201).json(
      {
        error: false,
        message: "User Reister Succesfully!",
        data: newUser
      })

  } catch (error) {
    res.status(500).json({
      errro: true,
      message: error.message || "error in Registering User"
    });
  }
});


// Login Flow <==
const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8).trim()
})
router.post("/login", async (req, res) => {
  try {
    const validateUser = loginSchema.parse(req.body)
    const isUserExist = await UserModel.findOne({ email: validateUser.email })
    if (!isUserExist) {
      return res.status(404).json({
        error: true,
        message: "User Not Found",
        data: null
      })
    }
    let decodePassword = await bcrypt.compare(validateUser.password, isUserExist.password)
    if (!decodePassword) {
      return res.status(401).json({
        error: true,
        message: "Invalid Password",
        data: null
      })
    }

    let token = jwt.sign({ id: isUserExist._id, email: isUserExist.email } ,process.env.JWT_SECRET )
    res.status(200).json({
      error: false,
      message: "User Login Succesfully!",
      data: {token ,user:{email : isUserExist.email , id : isUserExist._id}}
    })
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message || "Something went wrong in login user",
    });
  }
})



router.put("/", (req, res) => {
  const updatedUser = req.body;
  console.log("updatedUser", updatedUser);
  const isUserExist = user.find((obj) => obj.id === updatedUser.id)
  if (!isUserExist) {
    return res.status(404).json({
      error: true,
      message: "user not exist",
      data: null
    })
  }
  const updatingUserEmail = isUserExist.email = updatedUser.email
  console.log("updatingUserEmail ==>", updatingUserEmail);
  res.status(201).json({
    error: false,
    message: "user email updated!",
    data: updatingUserEmail
  })
});


router.delete("/", (req, res) => {
  const deleteUser = req.body

  const findUserAndDelete = user.find((obj) => obj.id === deleteUser.id)
  console.log("findUserAndDelete==>", findUserAndDelete);
  if (!findUserAndDelete) {
    return res.status(404).json({
      error: true,
      message: "user not exist",
      data: null
    })
  }
  const deletableUser = user.indexOf(findUserAndDelete)
  console.log("deletableUser ==>", deletableUser);
  user.splice(deletableUser, 1)
  res.status(201).json({
    error: false,
    message: "user deleted successfully!",
    data: user
  })
})

export default router;
