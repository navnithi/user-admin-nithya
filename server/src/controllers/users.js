const jwt = require("jsonwebtoken")

const { securePassword } = require("../helpers/bcryptPassword");
const User = require("../models/users");
const dev = require("../config");
const { sendEmailWithNodeMailer } = require("../helpers/email");

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

     const hashedPassword = await securePassword(password) 
     
     // store
     const token = jwt.sign({ name, email, phone, hashedPassword, image }, 
      dev.app.jwtSecretKey, {expiresIn: "5m"});

      //prepare email
      const emailData = {
        email, 
        subject: "Account activation email",
        html: `
        <h2> Hello ${name}! </h2>
        <p> Please click here to <a href = "${dev.app.clientUrl}/api/users/activate/${token}"
        target = "_blank">activate your account </a> </p>`, //html body
      };

      sendEmailWithNodeMailer(emailData);

    // verification email

    res.status(201).json({
      message: "Verification mail sent, please click",
      token : token
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { registerUser };
