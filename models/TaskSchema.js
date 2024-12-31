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
    taskAddedBy : { type : mongoose.Schema.Types.ObjectId, ref : 'Users' }
},{timestamps : true})

export const TaskModel = mongoose.models?.Tasks || mongoose?.model( "Tasks" , taskSchema)  