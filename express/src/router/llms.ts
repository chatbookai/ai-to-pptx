  // app.ts
  import express, { Request, Response } from 'express';

  import { checkUserToken } from '../utils/user';

  import { getLLMSSetting, uploadfiles, uploadfilesInsertIntoDb } from '../utils/utils';
  import { outputImage, outputImageOrigin, outputAudio, chatChatBaiduWenxin, chatChatGemini, chatChatOpenAI, chatKnowledgeOpenAI, GenereateImageUsingDallE2, GenereateAudioUsingTTS, parseFiles } from '../utils/llms';

  const app = express();

  app.get('/api/parsefiles', async (req: Request, res: Response) => {
    parseFiles();
    res.status(200).send("Execute finished, logs in the console or the log page");
    res.end();
  });
  
  app.post('/api/uploadfiles', uploadfiles().array('files', 10), async (req, res) => {
    uploadfilesInsertIntoDb(req.files as any[], req.body.knowledgeId, '999');
    res.json({"status":"ok", "msg":"Uploaded Success"}).end(); 
  });
  
  app.post('/api/DallE2Openai', async (req: Request, res: Response) => {
    const question: string = req.body.question
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLLMSSettingData = await getLLMSSetting("Dall-E-2");   
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          const GenereateImageUsingDallE2Data = await GenereateImageUsingDallE2(res, "Dall-E-2", checkUserTokenData.data.id, question, '1024x1024');
          res.status(200).json(GenereateImageUsingDallE2Data);
        }
        else {        
          res.status(200).json({"status":"error", "msg":"Not set API_KEY", "data": null});
        }
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/ChatOpenaiKnowledge', async (req: Request, res: Response) => {
    const { knowledgeId, question, history } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getLLMSSettingData = await getLLMSSetting(knowledgeId);   
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          await chatKnowledgeOpenAI(res, knowledgeId, checkUserTokenData.data.id, question, history);
          res.end();
        }
        else {        
          res.status(200).json({"status":"error", "msg":"Not set API_KEY", "data": null});
        }
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/ChatOpenai', async (req: Request, res: Response) => {
    const { knowledgeId, question, history } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getLLMSSettingData = await getLLMSSetting(knowledgeId);   
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          await chatChatOpenAI(res, knowledgeId, checkUserTokenData.data.id, question, history);
          res.end();
        }
        else {        
          res.status(200).json({"status":"error", "msg":"Not set API_KEY", "data": null});
        }
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/ChatGemini', async (req: Request, res: Response) => {
    const { knowledgeId, question, history } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getLLMSSettingData = await getLLMSSetting(knowledgeId);   
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          await chatChatGemini(res, knowledgeId, checkUserTokenData.data.id, question, history);
          res.end();
        }
        else {        
          res.status(200).json({"status":"error", "msg":"Not set API_KEY", "data": null});
        }
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/ChatBaiduwenxin', async (req: Request, res: Response) => {
    const { knowledgeId, question, history } = req.body;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
      const chatChatBaiduWenxinData: any = await chatChatBaiduWenxin(res, knowledgeId, checkUserTokenData.data.id, question, history);    
      res.status(200).json(chatChatBaiduWenxinData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.post('/api/TTS-1', async (req: Request, res: Response) => {
    const question: string = req.body.question
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLLMSSettingData = await getLLMSSetting("TTS-1");   
        if(getLLMSSettingData && getLLMSSettingData.OPENAI_API_KEY && getLLMSSettingData.OPENAI_API_KEY != "") {
          const GenereateAudioUsingTTSData = await GenereateAudioUsingTTS(res, "TTS-1", checkUserTokenData.data.id, question, 'alloy');
          res.status(200).json(GenereateAudioUsingTTSData);
        }
        else {        
          res.status(200).json({"status":"error", "msg":"Not set API_KEY", "data": null});
        }
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });

  app.get('/api/audio/:file', async (req: Request, res: Response) => {
    const { file }= req.params;
    outputAudio(res, file);
  });

  app.get('/api/image/:file', async (req: Request, res: Response) => {
    const { file } = req.params;
    outputImage(res, file);
  });

  app.get('/api/imageorigin/:file', async (req: Request, res: Response) => {
    const { file } = req.params;
    outputImageOrigin(res, file);
  });
  

  export default app;
