import fileUpload from 'express-fileupload';
import FirebaseAdminService from './FirebaseAdminService';
import {
  USER_COLLECTION_KEY,
  FOLLOWERS_COLLECTION_KEY
} from '../utils/constValues';
import { CreateUserDto } from 'dtos/CreateUserDto';

type RegisterUserArgsType = {
  crateUserDto: CreateUserDto;
};

async function registerUser({
  crateUserDto
}: RegisterUserArgsType): Promise<string> {
  const userResponse = await FirebaseAdminService.auth().createUser({
    email: crateUserDto.email,
    password: crateUserDto.password
  });
  await FirebaseAdminService.firestore()
    .collection(USER_COLLECTION_KEY)
    .doc(userResponse.uid)
    .set({
      name: crateUserDto.name,
      surname: crateUserDto.surname,
      userName: crateUserDto.userName
    });
  return userResponse.uid;
}

type FollowUserArgsType = {
  followerId: string;
  followeeId: string;
};

async function follow({
  followeeId,
  followerId
}: FollowUserArgsType): Promise<void> {
  const followerPromise = FirebaseAdminService.firestore()
    .collection(USER_COLLECTION_KEY)
    .doc(followerId)
    .get();
  const followeePromise = FirebaseAdminService.firestore()
    .collection(USER_COLLECTION_KEY)
    .doc(followeeId)
    .get();
  const followPromise = await FirebaseAdminService.firestore()
    .collection(FOLLOWERS_COLLECTION_KEY)
    .where('followerId', '==', followerId)
    .where('followeeId', '==', followeeId)
    .get();

  const [follower, followee, follow] = await Promise.all([
    followerPromise,
    followeePromise,
    followPromise
  ]);

  if (follower.exists && followee.exists && follow.empty) {
    await FirebaseAdminService.firestore()
      .collection(FOLLOWERS_COLLECTION_KEY)
      .add({
        followerId,
        followeeId
      });
  }
  return;
}

async function unFollow({
  followeeId,
  followerId
}: FollowUserArgsType): Promise<void> {
  const snapshot = await FirebaseAdminService.firestore()
    .collection(FOLLOWERS_COLLECTION_KEY)
    .where('followerId', '==', followerId)
    .where('followeeId', '==', followeeId)
    .get();
  if (snapshot.empty) {
    return;
  } else {
    await FirebaseAdminService.firestore()
      .collection(FOLLOWERS_COLLECTION_KEY)
      .doc(snapshot.docs[0].id)
      .delete();
  }
  return;
}

const UserService = {
  registerUser,
  follow,
  unFollow
};

export default UserService;
