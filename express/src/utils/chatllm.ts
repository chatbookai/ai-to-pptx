import { Request, Response } from "express";
import axios from "axios";

interface ChatHistoryItem {
  userMessage: string;
  aiResponse: string;
}

export async function chatChatOpenAI(
  res: Response,
  knowledgeId: number | string,
  userId: number | string,
  question: string,
  history: ChatHistoryItem[]
) {
  try {
    const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY!;
    const OPENAI_API_URL: string = "https://api.openai.com/v1/completions";

    // 构造历史对话
    let prompt: string = "";
    if (history && history.length > 0) {
      history.forEach((item) => {
        prompt += `Human: ${item.userMessage}\nAI: ${item.aiResponse}\n`;
      });
    }

    // 添加当前问题到prompt
    prompt += `Human: ${question}\nAI:`;

    // 发送请求到OpenAI API
    const apiResponse = await axios.post(
      OPENAI_API_URL,
      {
        prompt: prompt,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // 从OpenAI API响应中获取答案
    const aiResponse: string = apiResponse.data.choices[0].text.trim();

    // 将AI的答案发送回客户端
    res.json({
      knowledgeId: knowledgeId,
      question: question,
      answer: aiResponse,
    });
  } catch (error: any) {
    console.error("Error in chatChatOpenAI:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
