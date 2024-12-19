import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    status : {
        type : String ,
        enum : ['pending' , 'inprogress' , 'done'],
        default : 'pending'
        },   
},{timestamps : true})

export const TaskModel = mongoose.models?.Tasks || mongoose?.model( "Tasks" , taskSchema)  