import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || '';
  
    const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!);
    
    return decodedToken.id; // we are getting info from 'login', so we are using '.id' and not '._id'
    // generally '._id' used when getting data from mongodb.
''  
  } catch (error: any) {
    throw new Error(error.message);
  }
}