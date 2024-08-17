import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/utils/mailer";

connect()

export async function POST(request: NextRequest){
  // type -> request: NextRequest
  try {
    const reqBody = await request.json()
    // Shows red line on below 3 variables
    // Error : Property 'username' does not exist on type 'Promise<any>'
    // So adding 'await' in above line since it's a promise
    const {username, email, password} = reqBody
    console.log(reqBody);

    const user = await User.findOne({email})

    if(user){
      return NextResponse.json({error: "User already exists"}, {status:400})
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()
    console.log(savedUser);

    // saved verification email
    await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})
    
    return NextResponse.json({
      message: 'User registered successfully',
      success: true,
      savedUser
    })

  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status:500})
  }
}

