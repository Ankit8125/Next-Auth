import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from "@/utils/getDataFromToken";

connect()

export async function POST(request: NextRequest){ 
  // extract data from token
  // creating it in a 'util' because it might be possible that i might need data from token
  // in some other route as well.
  const userId = await getDataFromToken(request)
  const user = await User.findOne({_id: userId}).select('-password') // means except password, everything will be passed onto the 'user'
  // check if there is no user
  return NextResponse.json({
    message: 'User found',
    data: user
  })
}