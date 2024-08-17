import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json();
    const {email, password} = reqBody
    // validation
    console.log(reqBody);

    const user = await User.findOne({email})
    
    if(!user){
      return NextResponse.json({error: "User does not exist"}, {status: 400})
    }
    console.log('User exists');

    const validPassword = await bcryptjs.compare(password, user.password)

    if(!validPassword){
      return NextResponse.json({error:"Invalid password"}, {status: 400})
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    }
    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    })
    // We also want to send cookies, and since we have type as 'NextResponse', we can directly send cookies. Else we have to import and all in Express.js
    response.cookies.set("token", token, {
      httpOnly: true, // The `httpOnly: true` option ensures that the cookie is only accessible via HTTP requests 
    })
    
    return response;

  } catch (error:any) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}