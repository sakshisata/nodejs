import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

import { User } from '../models/userModel.js'

const generateAccessAndRefereshTokens = async(userId)=>
  {
      try {
          const user = await User.findById(userId)
          const accessToken = user.generateAccessToken()
          const refreshToken = user.generateRefreshToken()
  
          user.refreshToken = refreshToken
          await user.save({validateBeforeSave: false})
  
          return {accessToken, refreshToken}
  
      } catch (error) {
          throw new ApiError(500,"refresh and access token not generated successfully")
      }
  }


const registerUser = asyncHandler(async (req,res) => {
    const {
        username,
        password,
    } = req.body;
    console.log(username,password);

    const user = await User.create({
        username,
        password,
    })
    
    return res.status(201).json(
        new ApiResponse(200, user, "User registered successfully")
    )
})


const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    throw new ApiError(400, "Username Required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Logged in successfully"
      )
    );
});

const userProfile = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json({
        status: 200,
        data: req.user,
        message: "User profile fetched successfully"
    })
})


export {
  loginUser, registerUser, userProfile
}
