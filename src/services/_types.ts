import { DateTime } from 'luxon';

export type CreatePostType = {
  description?: string;
  name: string;
};

export type PostType = CreatePostType & {
  id: string;
  imageLink: string;
  createdAt: DateTime
};
