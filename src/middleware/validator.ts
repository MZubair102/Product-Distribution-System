import { plainToClass } from "class-transformer";
import { validate,ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validator = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // transform request body into DTO class
    /*
    Converts plain JavaScript object into a 
    class instance — required by class-validator to work properly
    */
    const userDto = plainToClass(dtoClass, req.body);

    // run validation
    const errors:ValidationError[] = await validate(userDto);

    if (errors.length > 0) {
      // format errors
      const messages = errors.map(
        (err) => Object.values(err.constraints || {})
      ).flat();

      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        errors: messages
      });
    }

    next();
  };
};
