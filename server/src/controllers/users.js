const fs = require ("fs")
const jwt = require("jsonwebtoken");

const { securePassword, comparePassword } = require("../helpers/bcryptPassword");
const User = require("../models/users");
const dev = require("../config");
const { sendEmailWithNodeMailer } = require("../helpers/email");
const { use } = require("../routes/users");

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

    if (image && image.size < 1000000) {
      return res.status(400).json({
        message: "max size for image should be 1mb",
      });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        message: "user already exist",
      });
    }

    const hashedPassword = await securePassword(password);

    // store
    const token = jwt.sign(
      { name, email, phone, hashedPassword, image },
      dev.app.jwtSecretKey,
      { expiresIn: "10m" }
    );

   

    //prepare email
    const emailData = {
      email,
      subject: "Account activation email",
      html: `
        <h2> Hello ${name}! </h2>
        <p> Please click here to <a href = "${dev.app.clientUrl}/api/users/activate?token =${token}"
        target = "_blank">activate your account </a> </p>`, //html body
    };

    sendEmailWithNodeMailer(emailData);

    // verification email

    res.status(201).json({
      message: "Verification mail sent, please click",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(404).json({
        message: "token is missing",
      });
    }
    jwt.verify(token, dev.app.jwtSecretKey, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          message: "token is expire",
        });
      }
      const { name, email, phone, hashedPassword, image } = decoded;
      const isExist = await User.findOne({ email: email });
      if (isExist) {
        return res.status(400).json({
          message: "user with this email already exist",
        });
      }
      //create user
      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
        is_varified: 1,
      });
      if (image) {
        newUser.image.data = fs.readFileSync(image.path);
        newUser.image.contentType = image.type;
      }
      const user = await newUser.save();
      if (!user) {
        res.status(400).json({
          message: "user was not repeated",
        });
      }
      res.status(201).json({
        //user,
        
        message: "user was created.ready to sign in",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) =>{
  try {
    const {email, password} = req.body;
     if ( !email || !password )
       return res.status(404).json({
         message: " email or password is missing",
       });

     if (password.length < 5){
      return res.status(404).json({
         message: "min length for password should be 5",
       });
     }
       

       const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({
          message: "user does not exist with this email please register",
        });
      }

      const isPasswordMatched =  await comparePassword(password, user.password)

      if (!isPasswordMatched) {
        return res.status(400).json({
          message: "email or password does not match",
        });
      }
      //create session
      req.session.userId = user._id;

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image
      },
      message: "login successful",
    });
    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  } 

}

const logOutUser = (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie("user_session");
    res.status(200).json({
      
      ok: true,
      message: "log out successful",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const userProfile = async (req, res) => {
  try {

    const userData = await User.findById(req.session.userId, {password : 0})
    res.status(200).json({
      ok: true,
      message: "profile returned",
      user: userData
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.session.userId);
    res.status(200).json({
      ok: true,
      message: "user deleted",
      
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//forget password
const forgetPassword = async (req, res) => {
  try {
    const {email, password} = req.body;

     if (!email || !password)
       return res.status(400).json({
         message: "email or password is missing",
       });

     if (password.length < 5)
       return res.status(404).json({
         message: "min length for password should be 5",
       });

       const user = await User.findOne({email: email });
       if(!user) return res.status(400).json({message: "user not found"});

        const hashedPassword = await securePassword(password);

        // store
        const token = jwt.sign(
          { email, hashedPassword },
          dev.app.jwtSecretKey,
          { expiresIn: "10m" }
        );

        //prepare email
        const emailData = {
          email,
          subject: "Account activation email",
          html: `
        <h2> Hello ${user.name}! </h2>
        <p> Please click here to <a href = "${dev.app.clientUrl}/api/users/reset-password?token =${token}"
        target = "_blank">reset password </a> </p>`, //html body
        };

        sendEmailWithNodeMailer(emailData);
    
    res.status(200).json({
      ok: true,
      message: "eamil send to reset password",
      token: token, 
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(404).json({
        message: "token is missing",
      });
    }
    jwt.verify(token, dev.app.jwtSecretKey, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          message: "token is expire",
        });
      }
      const { email, hashedPassword} = decoded;
      const isExist = await User.findOne({ email: email });
      if (!isExist) {
        return res.status(400).json({
          message: "user with this email does exist",
        });
      }
      //update password
      const updateData = await User.updateOne({email: email},
        {
          $set : {
            password: hashedPassword
          }
        })
        if(!updateData){
          res.status(400).json({
        
        message: "reset password not done",
      });
        }
      

      
      
      res.status(202).json({
        
        message: "reset password succesfull",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    if(!req.fields.password){
      /*res.status(400).json({
        ok: false,
        message: "no password found ",
      });*/
      
    }
    const hashedPassword = await securePassword(req.fields.password);
    const updatedData = await User.findByIdAndUpdate(req.session.userId, 
      {...req.fields, password: hashedPassword}, 
      {new: true}
      );

      if(!updatedData){
        res.status(400).json({
          ok: false,
          message: "user not updated",
        });

      }

      if(req.files.image){
        const {image} = req.files;
        updatedData.image.data = fs.readFileSync(image.path);
        updatedData.image.contentType = image.type;
      }
      
      await updatedData.save();

    res.status(200).json({
      ok: true,
      message: "user updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = { registerUser, verifyEmail, loginUser, logOutUser, userProfile, deleteUser, updateUser, forgetPassword, resetPassword};

/*const verifyEmail = async (req, res) =>{
  try {
     const {token} = req.body
     if(!token){
      return res.status(404).json({
        message: "Token is missing",
      });

     }

     jwt.verify(token, dev.app.jwtSecretKey, async function (err, decoded) {
       if(err){

         return res.status(401).json({
           message: "Token is expired",
         });

       }
       const { name, email, hashedPassword, phone, image } = decoded;
        const isExist = await User.findOne({ email:email });
    if (isExist) {
      return res.status(400).json({
        message: "user already exist",
      });
    }
       //create user
       const newUser = new User ({
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone
       })
       if(image){
        newUser.image.data = fs.readFileSync(image.path)
        newUser.image.contentType = image.type

       }

       //save user
       const user = await newUser.save()
       if(!user){
        res.status(400).json({
          message: "user not repeated",
        });

       }
       res.status(200).json({
         message: "user created ready to sigin",
       });
     });

    res.status(200).json({
      message: "email is verified",
    });
  
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }

}*/




