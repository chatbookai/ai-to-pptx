import express, { Request, Response } from "express";
import { checkUserToken } from "../utils/user";
import { getLLMSSetting } from "../utils/utils";
import { chatChatOpenAI } from "../utils/llms";

const app = express();

app.post("/api/ChatOpenai", async (req: Request, res: Response) => {
  const { question, history } = req.body;
  const { authorization } = req.headers;
  const checkUserTokenData: any = await checkUserToken(authorization as string);
  if (checkUserTokenData && checkUserTokenData.data) {
    await chatChatOpenAI(res, 1, checkUserTokenData.data.id, question, history);
    res.end();
  } else {
    res
      .status(200)
      .json({ status: "error", msg: "Token is invalid", data: null });
  }
  res.end();
});
