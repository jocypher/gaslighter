import jwt from "jsonwebtoken"
import envConstants from "../../constants/envConstants"

interface IJwtPayLoad {
    id: string,
    email:string
}
export class JwtService{


    // generate token
     static generateToken(payload:IJwtPayLoad){
        return jwt.sign(payload, envConstants.JWT.SECRET, {expiresIn:envConstants.JWT.EXPIRES_IN} as any)

    }
    // verify token
   static verifyToken(token:string):IJwtPayLoad {
        return jwt.verify(token,envConstants.JWT.SECRET) as IJwtPayLoad
    }


}