
  // app.ts
  import express, { Request, Response } from 'express';

  import { MenuListAdmin, MenuListUser } from '../utils/const';
  import { checkUserToken } from '../utils/user';
  import { getLogsPage, getTemplate, getLLMSSetting, getFilesPage, getFilesKnowledgeId, getChatLogByKnowledgeIdAndUserId, addKnowledge, setOpenAISetting, setTemplate, getKnowledgePage, wholeSiteStatics, getAllImages } from '../utils/utils';

  const app = express();

  app.post('/api/settemplate', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const setTemplateData: any = await setTemplate({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(setTemplateData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/setopenai', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const setOpenAISettingData: any = await setOpenAISetting({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(setOpenAISettingData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.post('/api/addknowledge', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        console.log("checkUserTokenDatacheckUserTokenDatacheckUserTokenDatacheckUserTokenData", checkUserTokenData)
        const addKnowledgeData: any = await addKnowledge({...req.body, userId: checkUserTokenData.data.id});
        res.status(200).json(addKnowledgeData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/chatlog/:knowledgeId/:userId/:pageid/:pagesize', async (req, res) => {
    const { knowledgeId, userId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getChatLogByKnowledgeIdAndUserIdData: any = await getChatLogByKnowledgeIdAndUserId(knowledgeId, Number(userId), Number(pageid), Number(pagesize));
        res.status(200).json(getChatLogByKnowledgeIdAndUserIdData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/files/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getFilesPageData: any = await getFilesPage(Number(pageid), Number(pagesize));
        res.status(200).json(getFilesPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/files/:knowledgeId/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { knowledgeId, pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getFilesPageData: any = await getFilesKnowledgeId(knowledgeId, Number(pageid), Number(pagesize));
        res.status(200).json(getFilesPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/getopenai/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLLMSSettingData: any = await getLLMSSetting(id);
        res.status(200).json(getLLMSSettingData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/gettemplate/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getTemplateData: any = await getTemplate(id, checkUserTokenData.data.id);
        res.status(200).json(getTemplateData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/knowledge/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && (checkUserTokenData.data.role == 'admin' || checkUserTokenData.data.role == 'user')) {
        const getKnowledgePageData: any = await getKnowledgePage(Number(pageid), Number(pagesize));
        res.status(200).json(getKnowledgePageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/logs/:pageid/:pagesize', async (req: Request, res: Response) => {
    const { pageid, pagesize } = req.params;
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const getLogsPageData: any = await getLogsPage(Number(pageid), Number(pagesize));
        res.status(200).json(getLogsPageData);
    }
    else {
        res.status(200).json({"status":"error", "msg":"Token is invalid", "data": null});
    }
    res.end();
  });
  
  app.get('/api/menu/horizontal', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        const MenuListAdminFilter = MenuListAdmin.filter( Item => Item && Item.title)
        res.status(200).json(MenuListAdminFilter);
    }
    else if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'user') {
        res.status(200).json(MenuListUser);
    }
    else {
        res.status(200).json(MenuListUser);
    }
    res.end();
  });
  
  app.get('/api/menu/vertical', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'admin') {
        res.status(200).json(MenuListAdmin);
    }
    else if(checkUserTokenData && checkUserTokenData.data && checkUserTokenData.data.email && checkUserTokenData.data.role == 'user') {
        res.status(200).json(MenuListUser);
    }
    else {
        res.status(200).json(MenuListUser);
    }
    res.end();
  });

  app.get('/api/static/site', async (req: Request, res: Response) => {
    const wholeSiteStaticsData: any = await wholeSiteStatics();
    res.status(200).json(wholeSiteStaticsData).end();
  });

  app.post('/api/getAllImages', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const { pageid, pagesize } = req.body;
    const checkUserTokenData: any = await checkUserToken(authorization as string);
    const generateimageData = await getAllImages(checkUserTokenData?.data?.id, pageid, pagesize);
    //console.log("generateimageData", generateimageData);
    res.status(200).json(generateimageData).end();
  });

  export default app;
