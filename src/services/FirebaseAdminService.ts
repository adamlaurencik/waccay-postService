import * as FirebaseAdminService from "firebase-admin";

FirebaseAdminService.initializeApp({
  credential: FirebaseAdminService.credential.applicationDefault(),
  databaseURL: "https://waccay.firebaseio.com",
  storageBucket: "staging.waccay.appspot.com"
});

export default FirebaseAdminService;
