  // app.ts
  import express, { Request, Response, NextFunction } from 'express';

  import { checkUserPassword, registerUser, changeUserPasswordByToken, changeUserDetail, changeUserStatus, checkUserToken, getUsers, getUserLogsAll, getUserLogs, getOneUserByToken, updateUserImageFavorite, updateUserVideoFavorite, refreshUserToken } from '../utils/user';

  import { getPPTXContent, getTemplate, getTemplates, getTemplateCovers, getPPTXTemplate, setTitle, setTheme, setViewportRatio, setSlides, setSlide, addSlide, updateSlide } from '../utils/pptx'

  const app = express();

  app.get('/api/pptx/listtemplate', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await getPPTXTemplate()
    res.status(200).json(result);
    res.end();
  });

  app.post('/api/pptx/getPPTXContent', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    console.log("req.body.id", req.body.id)
    const result = await getPPTXContent(req.body.id)
    res.status(200).json(result);
    res.end();
  });

  app.post('/api/pptx/getTemplate', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await getTemplate(req.body.id)
    res.status(200).json(result);
    res.end();
  });

  app.get('/api/pptx/getTemplates', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await getTemplates()
    res.status(200).json(result);
    res.end();
  });

  app.get('/api/pptx/getTemplateCovers', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await getTemplateCovers()
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

  app.post('/api/pptx/setSlide', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await setSlide(req.body)
    res.status(200).json(result);
    res.end();
  });

  app.post('/api/pptx/addSlide', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await addSlide(req.body)
    res.status(200).json(result);
    res.end();
  });

  app.post('/api/pptx/updateSlide', async (req: Request, res: Response) => {
    //const { authorization } = req.headers;
    //const checkUserTokenData = await checkUserToken(authorization as string);
    const result = await updateSlide(req.body)
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
