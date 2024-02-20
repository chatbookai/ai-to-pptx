  // app.ts
  import express, { Request, Response, NextFunction } from 'express';

  import { checkUserPassword, registerUser, changeUserPasswordByToken, changeUserDetail, changeUserStatus, checkUserToken, getUsers, getUserLogsAll, getUserLogs, getOneUserByToken, updateUserImageFavorite, updateUserVideoFavorite, refreshUserToken } from '../utils/user';

  import { getPPTXTemplate } from '../utils/pptx'

  const app = express();

  app.get('/api/pptx/listtemplate', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = getPPTXTemplate()
    res.status(200).json(result);
    res.end();
  });

  export default app;
