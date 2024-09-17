import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import mongoose, { isValidObjectId } from "mongoose";
import { Task } from "../models/taskModel.js";
import { User } from "../models/userModel.js";

const createTask = asyncHandler(async (req, res) => {
  const { task } = req.body;

  if(!task){
    throw new ApiError(400,"Taskname is require");
  }

  const newtask = await Task.create({
    task,
    createdBy: req.user?._id,
  });

  if (!newtask) {
    throw new ApiError(500, "Something went wrong while creating task");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newtask, "Task created Successfully"));
});

const getAllTask = asyncHandler(async(req,res)=>{
  const alltasks = await Task.find();

  return res
  .status(200)
  .json({
      status: 200,
      message: `All task data fetched successfully`,
      data: alltasks,
  })
})

export { createTask, getAllTask };
