import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

// async -> because sending email takes time
export const sendEmail = async({email, emailType, userId}:any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10)

    if(emailType === "VERIFY"){
      await User.findByIdAndUpdate(
        userId,{
          $set:{
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 3600000 // Expire after 1 hour
          }
        }
      )
    }
    else if(emailType === 'RESET'){
      await User.findByIdAndUpdate(
        userId,{
          $set:{
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000
          }
        }
      )
    }

    // below transport made from 'mailtrap' website -> from where we will send mails
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "f4ae848a61ecc4", // THIS MUST BE ENVIRONMENT VARIABLE !! 
        pass: "31dea357288b09" // THIS MUST BE ENVIRONMENT VARIABLE !!
        // BECAUSE ANY AUTHENTICATION MUST BE .ENV FILE
      }
    });

    const mailOptions = {
      from: 'ankitvsv0311@gmail.com', // sender address
      to: email, // list of receivers
      subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
      html: emailType === 'VERIFY' ? 
      `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> 
            to verify your email
            or copy and paste the link below in your browser. 
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>` 
      :
      `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> 
            to reset your password
            or copy and paste the link below in your browser. 
            <br> ${process.env.DOMAIN}/resetpassword?token=${hashedToken}
            </p>` 
    }

    const mailResponse = await transport.sendMail(mailOptions)

    return mailResponse
  } catch (error:any) { 
    /* writing 'any' as 'error.message' is giving error that type is not defined,
      so this is a small hack of typescript i.e. using 'any' keyword
    */
    throw new Error(error.message)
  }
}