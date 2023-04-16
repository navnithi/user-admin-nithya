const { securePassword } = require("../helpers/bcryptPassword");
const User = require("../models/users");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.fields;
    const { image } = req.files;

    if (!name || !email || !password || !phone || !password)
      return res.status(400).json({
        message: "name, email, phone or password is missing",
      });

       if (password.length < 5)
         return res.status(404).json({
           message: "min length for password should be 5",
         });

          if (image && image.size < 1000000){
            return res.status(400).json({
              message: "max size for image should be 1mb",
            });
          }

     const isExist = await User.findOne({email})
     if(isExist){
        return res.status(400).json({
          message: "user already exist",
        });

     }

     const hashedPassword = await securePassword(password) // store
            

    res.status(201).json({
      message: "user is created",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { registerUser };
