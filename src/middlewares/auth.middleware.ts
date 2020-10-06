import { NextFunction, Response } from "express";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // TODO
  next();
}

export default authMiddleware;
