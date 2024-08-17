import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"

connect()

export async function GET(request: NextRequest){ // We just need to delete the token while logging out
  try {
    const response = NextResponse.json({
      message: "Logout successfull",
      success: true,
    })

    response.cookies.set("token", "", { // setting our 'token' to empty string.
      httpOnly: true, 
      expires: new Date(0) 
    });

    return response;
  } catch (error:any) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}