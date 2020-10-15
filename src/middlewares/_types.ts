import { Request } from "express";
import admin from "firebase-admin";
import fileUpload from "express-fileupload";

export interface EnhancedRequestObject extends Request {
  tokenData: admin.auth.DecodedIdToken;
  files?: fileUpload.FileArray;
}
