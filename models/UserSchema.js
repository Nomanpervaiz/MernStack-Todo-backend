import mongoose from "mongoose";
const userschema = new mongoose.Schema({
  fullname: { type: String },
  email: { type: String},
  password: { type: String , required : true },
  role: { type: String, default: "user", enum: ["user", "admin"] },
});
export const UserModel = mongoose.models?.Users || mongoose?.model("Users", userschema);
