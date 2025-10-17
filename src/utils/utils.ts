
import { Response } from "express";
const handleresponse=(res:Response,status:number,message:string,data:any=null)=>{
    res.status(status).json({
        status,
        message,
        data
    })
}
export default handleresponse;