import fileUpload from 'express-fileupload';
import FirebaseAdminService from './FirebaseAdminService';
import {
  USER_COLLECTION_KEY,
  POSTS_COLLECTION_KEY,
  LIKES_COLLECTION_KEY,
  FOLLOWERS_COLLECTION_KEY
} from '../utils/constValues';
import { CreatePostType, PostType } from './_types';
import { DateTime } from 'luxon';
import { firestore } from 'firebase-admin';
import { Overwrite } from 'common';

export type CreatePostArgsType = {
  file: fileUpload.UploadedFile;
  createPostDto: CreatePostType;
  userId: string;
};

function createPost({
  file,
  createPostDto,
  userId
}: CreatePostArgsType): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const doc = await FirebaseAdminService.firestore()
      .collection(POSTS_COLLECTION_KEY)
      .add({
        createdAt: FirebaseAdminService.firestore.FieldValue.serverTimestamp(),
        description: createPostDto.description,
        name: createPostDto.name,
        userId: userId,
      });
    const imageCloudFile = FirebaseAdminService.storage()
      .bucket()
      .file(`userData/${userId}/${doc.id}`);
    const uploadStream = imageCloudFile.createWriteStream({
      resumable: false,
      contentType: file.mimetype
    });
    uploadStream.on('finish', async () => {
      await imageCloudFile.makePublic();
      doc.update({
        imageLink: imageCloudFile.metadata.mediaLink
      });
      resolve();
    });
    uploadStream.on('error', (e) => {
      reject(e);
    });
    uploadStream.end(file.data);
  });
}

export type GetPostsOfUserByIdArgsType = {
  userId: string;
};

type GetPostsOfUserByUserNameArgsType = {
  userName: string;
};

type FirebasePostRawType = Overwrite<
  PostType,
  { createdAt: firestore.Timestamp }
>;
async function getPostsOfUserById({
  userId
}: GetPostsOfUserByIdArgsType): Promise<PostType[]> {
  const snapshot = await FirebaseAdminService.firestore()
    .collection(POSTS_COLLECTION_KEY)
    .where("userId", "==", userId)
    .get();

  return parsePostResult(snapshot);
}

async function getPostsOfUserByUserName({
  userName
}: GetPostsOfUserByUserNameArgsType): Promise<PostType[]> {
  const snapshot = await FirebaseAdminService.firestore()
    .collection(USER_COLLECTION_KEY)
    .where('userName', '==', userName)
    .get();
  if (snapshot.empty) {
    //TODO error handling
  }
  return getPostsOfUserById({ userId: snapshot.docs[0].id });
}

type LikePostArgsType = {
  postId: string;
  userId: string;
};

async function likePost({ postId, userId }: LikePostArgsType) {
  await FirebaseAdminService.firestore()
    .collection(POSTS_COLLECTION_KEY)
    .doc(postId)
    .collection(LIKES_COLLECTION_KEY)
    .doc(userId).create({
      createdAt: FirebaseAdminService.firestore.FieldValue.serverTimestamp();
    });
}


async function unLikePost({ postId, userId }: LikePostArgsType) {
  await FirebaseAdminService.firestore()
    .collection(POSTS_COLLECTION_KEY)
    .doc(postId)
    .collection(LIKES_COLLECTION_KEY)
    .doc(userId)
    .delete()
}


type GetMyFeedArgs = {
  userId: string;
  cursorTimestamp?: DateTime;
  limit: number
}

async function getMyFeed({ userId, cursorTimestamp = new DateTime(), limit }: GetMyFeedArgs) {
  const userFolloweesSnapshot = await FirebaseAdminService.firestore()
    .collection(FOLLOWERS_COLLECTION_KEY)
    .where("followee", "==", userId)
    .get();

  const userFollowees = userFolloweesSnapshot.docs.map(d=>d.data().followerId as string);

  const snapshot = await FirebaseAdminService.firestore()
    .collectionGroup(POSTS_COLLECTION_KEY)
    .where("userId", "in", userFollowees)
    .where("createdAt", "<=", cursorTimestamp)
    .orderBy("createdAt")
    .limit(limit)
    .get();


  return parsePostResult(snapshot);
}

function parsePostResult(snapshot: firestore.QuerySnapshot<firestore.DocumentData>){
  const result = snapshot.docs.map((d) => {
    const { createdAt, ...data } = d.data() as FirebasePostRawType;
    return {
      ...data,
      createdAt: DateTime.fromMillis(createdAt.toMillis())
    };
  });
  return result as PostType[];
}

const PostService = {
  createPost,
  getPostsOfUserById,
  getPostsOfUserByUserName,
  likePost,
  unLikePost,
  getMyFeed
};

export default PostService;
