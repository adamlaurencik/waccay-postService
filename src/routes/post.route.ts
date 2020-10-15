import { Router } from 'express';
import PostsController from '../controllers/posts.controller';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import { CreatePostDto } from '../dtos/CreatePostDTO';

class PostRoute implements Route {
  public path = 'post';
  public router = Router();
  public controller = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, this.controller.index);

    this.router.post(
      `${this.path}/create`,
      validationMiddleware(CreatePostDto),
      this.controller.createPost
    );

    this.router.get(`${this.path}/my`, this.controller.getMyPosts);

    this.router.get(`${this.path}/:userName`, this.controller.getPostsOfUser);

    this.router.put(`${this.path}/like/:postId`, this.controller.likePost);

    this.router.delete(`${this.path}/like/:postId`, this.controller.unLikePost);

    this.router.get(`${this.path}/feed`, this.controller.getMyFeed);
  }
}

export default PostRoute;
