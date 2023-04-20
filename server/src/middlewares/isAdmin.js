const { errorHandler } = require("../helpers/responsehandler");
const User = require("../models/users");

const isAdmin = async(req, res,next)=>{
  try {
    if (req.session.userId) {
        const id = req.session.userId;
        const adminData =  await User.findById(id);
        if(adminData?.is_admin === 1){
            next();
        } else{
            errorHandler(res, 401, "you are not an admin")
        }
      
    } else {
      errorHandler(res, 400, "Please login");
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = isAdmin