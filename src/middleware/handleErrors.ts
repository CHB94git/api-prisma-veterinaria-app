import { NextFunction, Request, Response } from "express";
import { CustomError } from "../helpers";


export const handleErrorsMiddleware = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof CustomError) {
    const status = error.statusCode || 500
    const message = error.message || 'Something went wrong!'
    res.status(status).json(message)
  }
}