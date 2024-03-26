import express, { Request, Response } from "express";

import { checkUserToken } from "../utils/user";
import { chatChatOpenAI } from "../utils/chatllm";

const app = express();

app.post("/api/ChatOpenai", async (req: Request, res: Response) => {
  const { knowledgeId, userId, question, history } = req.body;
  const { authorization } = req.headers;

  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if (checkUserTokenData) {
    // chatChatOpenAI内部负责发送响应
    await chatChatOpenAI(res, knowledgeId, userId, question, history);
  } else {
    res
      .status(401)
      .json({ status: "error", msg: "Token is invalid", data: null });
  }
});
