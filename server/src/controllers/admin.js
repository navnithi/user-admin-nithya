const fs = require("fs");
const jwt = require("jsonwebtoken");

const {
  securePassword,
  comparePassword,
} = require("../helpers/bcryptPassword");
const User = require("../models/users");
const dev = require("../config");
const { sendEmailWithNodeMailer } = require("../helpers/email");
const {errorHandler, successHandler } = require("../helpers/responsehandler");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
       errorHandler(res, 400, "email or password not found");
    }
         

    if (password.length < 5) {
      errorHandler(res, 404, "min length for password should be 5");
    }     
   
   

    const foundUser = await User.findOne({ email });
    if (!foundUser) 
      errorHandler(res,400, "user does not exist with this email please register" );
      
      
    if (foundUser.is_admin === 0) 
    errorHandler(res, 400,"not an admin");

    const isPasswordMatched = await comparePassword(password, foundUser.password);

    if (!isPasswordMatched) {
      errorHandler(res, 400, "password does not match");
    }
    //create session
    req.session.userId = foundUser._id;
    

    res.status(200).json({
      user: {
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        image: foundUser.image,
      },
      message: "login successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const logoutAdmin = (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie("admin_session");
    successHandler(res, 200, "log out successful")
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const getAllUsers = async(req, res) =>{
  try {
    
    const users = await User.find({is_admin : 0})
    
    successHandler(res, 200, "returned all usser", users)
   
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    })
    
  }
}

const deleteUserByAdmin = async(req, res) =>{
  try {
    const {id} = req.params;
    const findUser = await User.findById(id)
    if(!findUser) errorHandler(res, 400, "user not found with this id");

    //isAdmin 
    else
    await User.findByIdAndDelete(id);
    


    res.status(200).json({
      ok:true,
      message: "user deleted"
    })

  } catch (error) {
    res.status(500).json({
      error: error.message
    })
    
  }
}

module.exports = {
  loginAdmin,
  logoutAdmin,
  getAllUsers,
  deleteUserByAdmin
};
