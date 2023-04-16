const nodemailer = require("nodemailer");
const dev = require("../config");
const { info } = require("console");
exports. sendEmailWithNodeMailer = async (emailData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: dev.app.smtpUserName,
        pass: dev.app.smtpPassword,
      },
    });
    const mailOptions = {
      from: dev.app.smtpUserName,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("---SMTP ERROR1---");
        console.log(error);
      } else {
        console.log("message sent:%s", info.response);
      }
    });
  } catch (error) {
    console.log("---SMTP ERROR2---");
    console.log("problem sending Email:", error);
  }
};

/*const nodemailer = require("nodemailer");
const dev = require("../config");
exports.sendEmailWithNodeMailer = async (emailData) => {
    console.log(dev.app.smtpPassword);
    try {
        const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: dev.app.smtpUserName, // generated ethereal user
      pass: dev.app.smtpPassword, // generated ethereal password
    },
  });

    const mailOptions: {

         from: dev.app.smtpUserName , // sender address
        to: emailData.email, // list of receivers
        subject: emailData.subject, // Subject line
        html: emailData.html, // html body

    };
        
    
}


     await transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log("SMTP ERROR 1");
            console.log(error)
        } else{
            console.log("Message sent: %s", info.response)
        }
    
  });
   

  
} catch (error){
    console.log("SMTP ERROR 2");

}
}


main().catch(console.error);

console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...*/
