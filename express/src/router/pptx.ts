  // app.ts
  import express, { Request, Response, NextFunction } from 'express';

  import { checkUserPassword, registerUser, changeUserPasswordByToken, changeUserDetail, changeUserStatus, checkUserToken, getUsers, getUserLogsAll, getUserLogs, getOneUserByToken, updateUserImageFavorite, updateUserVideoFavorite, refreshUserToken } from '../utils/user';

  const app = express();

  app.post('/api/pptx/listtemplate', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData = await checkUserToken(authorization as string);
    res.status(200).json(checkUserTokenData);
    res.end();
  });

  export default app;
