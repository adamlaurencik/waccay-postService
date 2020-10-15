import { RequestHandler } from 'express';
import FirebaseAdminService from '../services/FirebaseAdminService';
import { EnhancedRequestObject } from './_types';

const authMiddleware: RequestHandler = async (
  req: EnhancedRequestObject,
  res,
  next
) => {
  if (req.path === '/user/register') {
    next();
  } else {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7, authHeader.length);
      try {
        const tokenData = await FirebaseAdminService.auth().verifyIdToken(
          token
        );
        req.tokenData = tokenData;
        next();
      } catch (e) {
        console.error(e);
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  }
};

export default authMiddleware;
