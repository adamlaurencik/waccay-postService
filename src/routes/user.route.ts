import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import { CreateUserDto } from '../dtos/CreateUserDto';
import UserController from '../controllers/users.controller';

class UserRoute implements Route {
  public path = '/user';
  public router = Router();
  public controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.controller.register
    );
    this.router.put(
      `${this.path}/follow/:followerId`,
      this.controller.register
    );
    this.router.delete(
      `${this.path}/follow/:followerId`,
      this.controller.register
    );
  }
  
}

export default UserRoute;
