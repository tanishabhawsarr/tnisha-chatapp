import { envMode } from "../app.js";

const errorMiddleware=(err,req,res,next)=>{
      err.message ||= "Internal server error";
      err.statusCode ||= 500;
     
      if(err.code===11000){
        const error=Object.keys(err.keyPattern).join(", ");
      err.message = `Duplicate field - ${error}`;
      err.statusCode = 400;
      }
      
      if(err.name==="CastError"){
        const errorPath=err.path;
      err.message = `Invalid format of ${errorPath}`;
      err.statusCode = 400;
      }

      const respone={
        success:false,
        message:err.message,
      }

      if(envMode==="DEVELOPMENT"){
        respone.error=err;
      }

      return res.status(err.statusCode).json(respone);
};

const TryCatch=(passedFunc)=> async(req,res,next) => {
    try {
        await passedFunc(req,res,next)
    } catch (error) {
        next(error);
    }
};

export {errorMiddleware, TryCatch};