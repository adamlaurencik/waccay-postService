import { CreatePostDto } from './CreatePostDTO';

export class PostDTO extends CreatePostDto {
  id: string;
  imageLink: string;
}
