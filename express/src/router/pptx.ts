  // app.ts
  import express, { Request, Response, NextFunction } from 'express';

  import { checkUserPassword, registerUser, changeUserPasswordByToken, changeUserDetail, changeUserStatus, checkUserToken, getUsers, getUserLogsAll, getUserLogs, getOneUserByToken, updateUserImageFavorite, updateUserVideoFavorite, refreshUserToken } from '../utils/user';

  import { getPPTXTemplate, setTitle, setTheme, setViewportRatio, setSlides } from '../utils/pptx'

  const app = express();

  app.get('/api/pptx/listtemplate', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = getPPTXTemplate()
    res.status(200).json(result);
    res.end();
  });

  app.post('/api/pptx/setTitle', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await setTitle(req.body)
    res.status(200).json(result);
    res.end();
  });

  app.post('/api/pptx/setTheme', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await setTheme(req.body)
    res.status(200).json(result);
    res.end();
  });

  app.post('/api/pptx/setViewportRatio', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await setViewportRatio(req.body)
    res.status(200).json(result);
    res.end();
  });

  app.post('/api/pptx/setSlides', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await setSlides(req.body)
    res.status(200).json(result);
    res.end();
  });

  export default app;
