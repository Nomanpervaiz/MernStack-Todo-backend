import express from "express";
import { z } from "zod";
import { TaskModel } from "../models/TaskSchema.js";
const router = express.Router();

function middleware(req, res, next) {
  console.log("get req ==>", req.query);
  const query = req.query.auth === "true";
  if (!query) {
    return res
      .status(403)
      .send("You are not authorized to access this resource.");
  }
  next();
}

// router.get("/:id",  (req, res) => {
//     console.log("get req ==>", req.params);
//     const parameterId = req.params.id
//     const findId = tasks.findIndex((obj) => obj.id == parameterId)
//     if (tasks[findId]) {
//         res.status(200).send(tasks[findId]);
//     }
//     res.status(404).send("task not found!");
// });


// task get from mongoDb
router.get("/", async (req, res) => {
  const tasks = await TaskModel.find();
  res.status(200).json({
    error: false,
    message: "Get Data Fetched successfully !",
    tasks,
  });
});


router.post("/", async (req, res) => {
  console.log("req from thunder ==>",req.body);
  
  try {
    // Zod validation === > 
    const taskSchema = z.object({
      task: z.string().min(1, { message: "Task is required and cannot be empty" }),
      status: z.enum(["pending", "inprogress", "done"]),
    });
    
    const validTaskData = taskSchema.parse(req.body);
    // task added to mongoDb ===>
    let newTask = new TaskModel(validTaskData);
    newTask = await newTask.save();
    res.status(201).json({
      error: false,
      message: "Data Inserted Successfully !",
    });
  } catch (error) {
    console.log("error==>", error);
    res.status(500).json({
      error: true,
      message: error.message || "Data insertion failed!",
      data: null,
    });
  }
});


router.put("/", async (req, res) => {
  try {
    const taskSchema = z.object({
      status: z.enum(["pending", "inprogress", "done"]),
      id: z.string(),
    });
    const validTaskData = taskSchema.parse(req.body);
    let updatedTask = await TaskModel.findByIdAndUpdate(validTaskData.id, {
      status: validTaskData.status,
    });
    console.log('updatedTask ====>', updatedTask );
    if (updatedTask) {
      return res.status(201).json({
        error: false,
        message: "task updated successfully !",
        data: validTaskData,
      });
    }
  } catch (error) {
    console.log("error==>", error);
    res.status(404).json({
      error: true,
      message: error.message || "Data not updated!",
      data: null,
    });
  }
});



router.delete("/", async (req, res) => {
  try {
    const { id } = req.body;
    const deleteTask = await TaskModel.deleteOne({ _id: id });
    console.log(deleteTask);
    if (deleteTask?.deletedCount === 0) {
      return res.status(204).json({
        error: true,
        message: "task already deleted!",
      });
    }
    if (deleteTask) {
      return res.status(201).json({
        error: false,
        message: "task deleted successfully !",
        data: deleteTask,
      });
    }
  } catch (error) {
    console.log("error==>", error);
    res.status(404).json({
      error: true,
      message: error.message || "Data not deleted!",
      data: null,
    });
  }
});

export default router;
