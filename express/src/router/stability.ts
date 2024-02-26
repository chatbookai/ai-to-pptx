  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken, checkUserTokenXWE, checkUserTokenXWENotCostAmount } from '../utils/user';

  import { getUserImagesStabilityAi, getUserImagesAll, getUserVideosStabilityAi, getUserVideosStabilityAiAll, generateImageFromTextStabilityAi, generateImageFromImageStabilityAi, generateVideoStabilityAi, getVideoStabilityAi, outputVideo, outputVideoImage, generateImageUpscaleStabilityAi } from '../utils/stability';

  import { uploadImageForVideo, uploadImageForImageGenerateImage } from '../utils/utils';

  const app = express();

  app.post('/api/getUserImagesStabilityAi', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateimageData = await getUserImagesStabilityAi(checkUserTokenData.data.id, pageid, pagesize);
      //console.log("generateimageData", generateimageData);
      res.status(200).json(generateimageData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/getUserImagesAll', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.body;
    const getUserImagesAllData = await getUserImagesAll(pageid, pagesize);
    //console.log("getUserImagesAllData", getUserImagesAllData);
    res.status(200).json(getUserImagesAllData).end();
  });

  app.post('/api/generateImageFromTextStabilityAi', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageFromTextStabilityAiData = await generateImageFromTextStabilityAi(checkUserTokenData, req.body);
      //console.log("generateImageFromTextStabilityAiData", generateImageFromTextStabilityAiData);
      res.status(200).json(generateImageFromTextStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/generateImageFromTextStabilityAiXWE', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserTokenXWE(authorization as string);
    //console.log("checkUserTokenData", checkUserTokenData)
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageFromTextStabilityAiData = await generateImageFromTextStabilityAi(checkUserTokenData, req.body);
      //console.log("generateImageFromTextStabilityAiData", generateImageFromTextStabilityAiData);
      res.status(200).json(generateImageFromTextStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/generateImageStabilityAiXWE', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserTokenXWE(authorization as string);
    //console.log("checkUserTokenData", checkUserTokenData)
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageFromTextStabilityAiData = await generateImageFromTextStabilityAi(checkUserTokenData, req.body);
      //console.log("generateImageFromTextStabilityAiData", generateImageFromTextStabilityAiData);
      res.status(200).json(generateImageFromTextStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/generateImageFromImageStabilityAi', uploadImageForImageGenerateImage().array('image', 10), async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageFromImageStabilityAiData = await generateImageFromImageStabilityAi(checkUserTokenData, req.body, req.files);
      //console.log("generateImageFromImageStabilityAiData", generateImageFromImageStabilityAiData);
      res.status(200).json(generateImageFromImageStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/getUserImagesXWE', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserTokenXWENotCostAmount(authorization as string);
    //console.log("checkUserTokenData", checkUserTokenData)
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateimageData = await getUserImagesStabilityAi(checkUserTokenData.data.id, pageid, pagesize);
      //console.log("generateimageData", generateimageData);
      res.status(200).json(generateimageData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/generateVideoStabilityAi', uploadImageForVideo().array('image', 10), async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateVideoStabilityAiData = await generateVideoStabilityAi(checkUserTokenData, req.body, req.files);
      //console.log("generateVideoStabilityAiData", generateVideoStabilityAiData);
      res.status(200).json(generateVideoStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid in generateVideoStabilityAi", "data": checkUserTokenData}).end();
    }
  });

  app.get('/api/getVideoStabilityAi', async (req: Request, res: Response) => {
    const id = "b8a57ec51f4cf5fb5e98f82e6b6efcd118651797fc90fdb8ef662d25625d5fff"
    const getVideoStabilityAiData = await getVideoStabilityAi(id);
    //console.log("generateVideoStabilityAiData", getVideoStabilityAiData);
    res.status(200).send(getVideoStabilityAiData).end();
  });

  app.post('/api/getUserVideosStabilityAi', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const getUserVideosStabilityAiData = await getUserVideosStabilityAi(checkUserTokenData.data.id, pageid, pagesize);
      //console.log("getUserVideosStabilityAiData", getUserVideosStabilityAiData);
      res.status(200).json(getUserVideosStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/getUserVideosStabilityAiAll', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.body;
    const getUserVideosStabilityAiAllData = await getUserVideosStabilityAiAll(pageid, pagesize);
    //console.log("getUserVideosStabilityAiAllData", getUserVideosStabilityAiAllData);
    res.status(200).json(getUserVideosStabilityAiAllData).end();
  });

  app.post('/api/generateImageUpscaleStabilityAi', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { filename } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageUpscaleStabilityAiData = await generateImageUpscaleStabilityAi(checkUserTokenData, filename, 'stability.ai');
      //console.log("generateImageUpscaleStabilityAiData", generateImageUpscaleStabilityAiData);
      res.status(200).json(generateImageUpscaleStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.post('/api/generateImageUpscaleGetImg', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { filename } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.id && ( checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user') ) {
      const generateImageUpscaleStabilityAiData = await generateImageUpscaleStabilityAi(checkUserTokenData, filename, 'getimg.ai');
      //console.log("generateImageUpscaleStabilityAiData", generateImageUpscaleStabilityAiData);
      res.status(200).json(generateImageUpscaleStabilityAiData).end();
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null}).end();
    }
  });

  app.get('/api/video/:file', async (req: Request, res: Response) => {
    const { file } = req.params;
    outputVideo(res, file);
  });

  app.get('/api/videoimage/:file', async (req: Request, res: Response) => {
    const { file } = req.params;
    outputVideoImage(res, file);
  });

  

  export default app;
