import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";


// errors handling class for errors generated by express-validator package.
export class RequestValidationError extends CustomError {
  statusCode=400;
  constructor(public errors: ValidationError[]) {
    //just for logging purposes
    super('Invalid Request');
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  formattedErrorMessage(){
    return this.errors.map(err => {
      return {
        message:err.msg,
        field:err.param
       };
   });
  }
}