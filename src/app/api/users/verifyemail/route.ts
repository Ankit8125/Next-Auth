import {connect} from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { use } from "react";

connect()

export async function POST(request: NextRequest){
  try {
    const reqBody = await request.json();
    const {token} = reqBody;
    console.log(token);

    // assuming token came

    const user = await User.findOne({
      verifyToken: token, 
      verifyTokenExpiry: {$gt: Date.now()} // expiry must be greater than current date -> property of mongodb
    })

    if(!user){
      return NextResponse.json({error: "Invalid token"}, {status: 400})
    }

    console.log(user);

    user.isVerified = true;
    user.verifyToken = undefined; 
    user.verifyTokenExpiry = undefined // as we don't need these fields

    await user.save() // DB in another continent, so use 'await' so save in original database
    
    return NextResponse.json(
      {message: "Email verified successfully", success: true}, 
      {status: 500}
    )
    
  } catch (error:any) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}