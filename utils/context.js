import jwt from "jsonwebtoken"



function generateJWT(data){
  let secret = process.env.JWT_SECRET_KEY
  return jwt.sign(data,secret)
}
export default {
  generateJWT,
 
}