import { NextFunction, Response } from 'express';
import { EnhancedRequestObject } from 'middlewares/_types';
import { CreatePostDto } from 'dtos/CreatePostDTO';
import { isArray } from 'util';
import PostService from '../services/PostService';
import { DateTime } from 'luxon';
import { isNormalInteger } from '../utils/util';

class PostController {
  public index = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.tokenData);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file = req.files?.post;
      if (!file || isArray(file)) {
        res.sendStatus(400);
      } else {
        await PostService.createPost({
          file,
          createPostDto: req.body as CreatePostDto,
          userId: req.tokenData.uid
        });
        res.sendStatus(200);
      }
    } catch (e) {
      next(e);
    }
  };

  public getMyPosts = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const myPosts = await PostService.getPostsOfUserById({
        userId: req.tokenData.uid
      });
      res.send(myPosts);
    } catch (e) {
      next(e);
    }
  };

  public getPostsOfUser = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const myPosts = await PostService.getPostsOfUserByUserName({
        userName: req.params.userName
      });
      res.send(myPosts);
    } catch (e) {
      next(e);
    }
  };

  public likePost = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await PostService.likePost({
        postId: req.params.postId,
        userId: req.tokenData.uid
      });
      res.send(200);
    } catch (e) {
      next(e);
    }
  };

  public unLikePost = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await PostService.unLikePost({
        postId: req.params.postId,
        userId: req.tokenData.uid
      });
      res.send(200);
    } catch (e) {
      next(e);
    }
  };

  public getMyFeed = async (
    req: EnhancedRequestObject,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.params.cursorTimestamp) {
        if (isNormalInteger(req.params.cursorTimestamp)) {
          const cursorDateTime = DateTime.fromMillis(
            Number(req.params.cursorTimestamp)
          );
          await PostService.getMyFeed({
            userId: req.tokenData.uid,
            limit: 5,
            cursorTimestamp: cursorDateTime
          });
          res.send(200);
        } else {
          res.send(400);
        }
      }
    } catch (e) {
      next(e);
    }
  };
}

export default PostController;
