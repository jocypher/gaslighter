import { NextFunction,Request,Response } from "express";
import { User } from "../../../../../db/entities/User";
import appConstants from "../../../../../core/constants/appConstants";

export default async function GetProfileController(
    req:Request,
    res:Response,
    next:NextFunction
){
try{
    //TODO:optimize to use token authentication
    const email = req.body

    const user = await User.findOne({
        where:{
            email: email
        },
        select:{
            id: true,
            email:true,
            userName:true,
            createdDate:true
        }
    })

    if(!user){
        
        return res.status(appConstants.statusCode.SUCCESS).json({
            success:false,
            message:"User does not exist"
        })
    }



    

    }catch(error){
        next(error)
    }
}