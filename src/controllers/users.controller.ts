import { NextFunction, Response } from 'express';
import { EnhancedRequestObject } from 'middlewares/_types';
import { CreateUserDto } from '../dtos/CreateUserDto';
import UserService from '../services/UserService';
class UserController {
  public register = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await UserService.registerUser({
        crateUserDto: req.body as CreateUserDto
      });
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
  public follow = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await UserService.follow({
        followeeId: req.tokenData.uid,
        followerId: req.params.followeeId
      });
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
  public unFollow = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await UserService.unFollow({
        followeeId: req.tokenData.uid,
        followerId: req.params.followeeId
      });
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
