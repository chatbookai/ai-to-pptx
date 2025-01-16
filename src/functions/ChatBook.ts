import axios from 'axios'
import { customAlphabet } from 'nanoid';

const ChatChat = "ChatChat"
const ChatChatName = "ChatChatName"
const ChatChatHistory = "ChatChatHistory"
const ChatBookLanguage = "ChatBookLanguage"
const ChatAnonymousUserId = "ChatAnonymousUserId"

export const getNanoid = (size = 12) => {
  return customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', size)();
};

export function ChatChatList(appId: string, WelcomeText: string) {
    const ChatChatText = window.localStorage.getItem(ChatChat + "_" + appId)
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : ChatChatInit(appId, [], WelcomeText)

    return ChatChatList
}

export function ChatChatNameList() {
	const ChatChatText = window.localStorage.getItem(ChatChatName)
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []

    return ChatChatList
}

export function SetChatChatName(Id: number, Name: string) {
	const ChatChatText = window.localStorage.getItem(ChatChatName)
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    ChatChatList[Id] = Name
    window.localStorage.setItem(ChatChatName, JSON.stringify(ChatChatList))
}

export function AddChatChatName(Name: string) {
	const ChatChatText = window.localStorage.getItem(ChatChatName)
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    ChatChatList.push(Name)
    window.localStorage.setItem(ChatChatName, JSON.stringify(ChatChatList))
}

export function DeleteChatChatName(Id: number) {
	const ChatChatText = window.localStorage.getItem(ChatChatName)
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    if (Id >= 0 && Id < ChatChatList.length) {
        ChatChatList.splice(Id, 1);
    }
    window.localStorage.setItem(ChatChatName, JSON.stringify(ChatChatList))
}

export function DeleteChatChat(appId: string) {
    window.localStorage.setItem(ChatChat + "_" + appId, JSON.stringify([]))
}

export function DeleteChatChatByChatlogId(appId: string, chatlogId: string) {
    const ChatChatText = window.localStorage.getItem(ChatChat + "_" + appId)
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    const ChatChatListFilter = ChatChatList.filter((item: any)=>item.chatlogId!=chatlogId)
    window.localStorage.setItem(ChatChat + "_" + appId, JSON.stringify(ChatChatListFilter))
}

export function DeleteChatChatHistory(UserId: number | string, knowledgeId: number | string, appId: string) {
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][appId]) {
        ChatChatHistoryList[UserId][knowledgeId][appId] = []
        window.localStorage.setItem(ChatChatHistory, JSON.stringify(ChatChatHistoryList))
    }
}

export function DeleteChatChatHistoryByChatlogId(UserId: number | string, knowledgeId: number | string, appId: string, chatlogId: string) {
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][appId]) {
        const TempList = ChatChatHistoryList[UserId][knowledgeId][appId]
        const TempListFilter = TempList.filter((item: any)=>item.chatlogId!=chatlogId)
        ChatChatHistoryList[UserId][knowledgeId][appId] = TempListFilter
        window.localStorage.setItem(ChatChatHistory, JSON.stringify(ChatChatHistoryList))
    }
}

export function ChatChatInit(appId: string, MsgList: any, PromptTemplate: string) {
    const ChatLogList: any = []
    if(PromptTemplate && PromptTemplate!= "") {
        ChatLogList.push({
            "message": PromptTemplate,
            "time": Date.now(),
            "senderId": 999999,
            "history": [],
            "responseTime": 0,
            "chatlogId": 0,
            "question": '',
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
        })
    }

    MsgList.map((Item: any)=>{
        ChatLogList.push({
            "message": Item.send,
            "time": Item.timestamp,
            "senderId": Item.userId,
            "chatlogId": Item._id,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
          })
        ChatLogList.push({
            "message": Item.received,
            "time": Item.timestamp,
            "senderId": 999999,
            "history": JSON.parse(Item.history),
            "responseTime": Item.responseTime,
            "chatlogId": Item._id,
            "question": Item.send,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
          })
    })

    window.localStorage.setItem(ChatChat + "_" + appId, JSON.stringify(ChatLogList))

    return ChatLogList
}

export function ChatChatInput(appId: string, chatlogId: string, Question: string, Message: string, UserId: number | string, responseTime: number, History: any[]) {
	const ChatChatText = window.localStorage.getItem(ChatChat + "_" + appId)
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    ChatChatList.push({
      "message": Message,
      "time": Date.now(),
      "responseTime": responseTime,
      "chatlogId": chatlogId,
      "senderId": UserId,
      "history": History,
      "question": Question,
      "feedback": {
          "isSent": true,
          "isDelivered": true,
          "isSeen": true
      }
    })
    window.localStorage.setItem(ChatChat + "_" + appId, JSON.stringify(ChatChatList))
}

export async function ChatAiOutputV1(authConfig: any, app: any, _id: string, Message: string, Token: string, UserId: number | string, chatId: number | string, setProcessingMessage: any, setFinishedMessage: any, setQuestionGuide: any, questionGuideTemplate: string, stopMsg: boolean, setStopMsg: any, temperature: number) {
    const appId = app.id
    const MaxHistory = Number(app.HistoryRecords)
    setStopMsg(false)
    const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)
    const ChatChatList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : []
    const History: any = []
    if(ChatChatList && ChatChatList[UserId] && ChatChatList[UserId][chatId] && ChatChatList[UserId][chatId][appId]) {
        const ChatChatListLast10 = ChatChatList[UserId][chatId][appId].slice(-10)
        ChatChatListLast10.map((Item: any)=>{
            if(Item.question && Item.answer) {
                History.push([Item.question, Item.answer.substring(0, 200)])
            }
        })
    }
    try {
        setProcessingMessage('')
        console.log("chatId", chatId)
        if(chatId && UserId)  {
            const startTime = performance.now()
            const response = await fetch(authConfig.backEndApiAiBaseUrl + `aichat/chatai.php`, {
                method: 'POST',
                headers: {
                    Authorization: Token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: Message,
                    history: MaxHistory == 0 ? [] : History.slice(0-MaxHistory),
                    appId: appId,
                    _id,
                    allowChatLog: 1,
                    temperature: temperature
                }),
            });
            if (!response.body) {
              throw new Error('Response body is not readable as a stream');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let responseText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done || stopMsg) {
                    setProcessingMessage('');
                    break;
                }
                const chunk = decoder.decode(value, { stream: true });
                const filterText = filterDeepSeekAiResultToText(chunk);
                setProcessingMessage((prevText: string) => prevText + filterText);
                responseText += filterText;
                setQuestionGuide(null);
            }

            if(responseText) {
                console.log("OpenAI Response:", UserId, responseText)
                const endTime = performance.now()
                const responseTime = Math.round((endTime - startTime) * 100 / 1000) / 100
                ChatChatInput(appId, _id, Message, responseText, 999999, responseTime, History)
                ChatChatHistoryInput(_id, Message, responseText, UserId, chatId, appId, responseTime, History)
                setFinishedMessage(responseText);

                if(app.SimilarQuestions > 0) {
                    const url = authConfig.backEndApiAiBaseUrl + 'aichat/chataijson.php';
                    const headers = {
                        Authorization: Token,
                        'Content-Type': 'application/json',
                    };
                    History.push([Message, responseText])

                    //questionGuideTemplate define by zh-CN.json language etc files
                    //const questionGuideTemplate = '你是一个AI智能助手，可以回答和解决我的问题。请结合前面的对话记录，帮我生成 3 个问题，引导我继续提问。问题的长度应小于20个字符，要求使用UTF-8编码，按 JSON 格式返回: ["问题1", "问题2", "问题3"]'
                    setQuestionGuide(['Generating, please wait...'])
                    const data = {
                                question: questionGuideTemplate,
                                history: MaxHistory == 0 ? [] : History.slice(0-MaxHistory),
                                appId: appId,
                                temperature: 0.2,
                                _id: _id,
                                allowChatLog: 0
                            };
                    const response = await axios.post(url, data, { headers: headers }).then(res=>res.data);
                    if(response) {
                        if(response && response.length == 3) {
                            setQuestionGuide(response)
                        }
                        else if(response && response.choices && response.choices[0] && response.choices[0]['message'] && response.choices[0]['message']['content']) {
                          const result = extractTextBetween(response.choices[0]['message']['content'], "```json", "```");
                          const JsonArray = JSON.parse(result)
                          console.log("responseresponseresponseresponse", JsonArray)
                          setQuestionGuide(JsonArray)
                        }
                        else if(response.includes('```json')) {
                            const result = extractTextBetween(response, "```json", "```");
                            const JsonArray = JSON.parse(result)
                            console.log("responseresponseresponseresponse", JsonArray)
                            setQuestionGuide(JsonArray)
                        }
                        else {
                            setQuestionGuide(null)
                        }
                    }
                }

                return true
            }
            else {
                return true
            }
        }
        else {
            return false
        }

    }
    catch (error: any) {
        console.log('Error:', error.message);

        return true
    }

}

export function filterDeepSeekAiResultToText(jsonString: string) {
  let ResultText = ''
  const jsonStringList = jsonString.split('data:')
  jsonStringList.map((Item: string)=>{
    const jsonList = Item.split('"choices":[{"index":0,"delta":{"content":"')
    if(jsonList && jsonList[1] && jsonList[1]!='')  {
      const LastPart = jsonList[1].split('"},"logprobs":null,"finish_reason"')
      if(LastPart[0] && LastPart[1])  {
        ResultText += LastPart[0]
      }
    }
  })

  return ResultText
}

function extractTextBetween(text: string, startMarker: string, endMarker: string) {
    // 创建正则表达式模式，使用非贪婪匹配来获取开始和结束标记之间的文本
    const regex = new RegExp(`${startMarker}(.*?)${endMarker}`, 's');

    // 使用正则表达式匹配文本
    const match = text.match(regex);

    // 如果匹配成功，返回匹配组中的文本；否则返回原始文本
    return match ? match[1] : text;
}

export function ChatChatHistoryInput(chatlogId: string, question: string, answer: string, UserId: number | string, knowledgeId: number | string, appId: string, responseTime: number, History: any[]) {

    //console.log("ChatChatHistoryList", question, answer, UserId)
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList && ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][appId]) {
        ChatChatHistoryList[UserId][knowledgeId][appId].push({
            "question": question,
            "time": String(Date.now()),
            "responseTime": responseTime,
            "chatlogId" : chatlogId,
            "history": History,
            "answer": answer,
        })
    }
    else {
        ChatChatHistoryList[UserId] = {}
        ChatChatHistoryList[UserId][knowledgeId] = {}
        ChatChatHistoryList[UserId][knowledgeId][appId] = [{
            "question": question,
            "time": String(Date.now()),
            "responseTime": responseTime,
            "chatlogId" : chatlogId,
            "history": History,
            "answer": answer,
        }]
    }
    window.localStorage.setItem(ChatChatHistory, JSON.stringify(ChatChatHistoryList))
}

export function getChatBookLanguage() {
    const ChatBookLanguageValue = window.localStorage.getItem(ChatBookLanguage) || "en"

    return ChatBookLanguageValue
};

export function setChatBookLanguage(Language: string) {
    window.localStorage.setItem(ChatBookLanguage, Language)

    return true
};

export function getAnonymousUserId() {
    const ChatAnonymousUserIdValue = window.localStorage.getItem(ChatAnonymousUserId)
    if(ChatAnonymousUserIdValue && ChatAnonymousUserIdValue.length == 32) {

        return ChatAnonymousUserIdValue
    }
    else {
        const ChatAnonymousUserIdValueNew = getNanoid(32)
        window.localStorage.setItem(ChatAnonymousUserId, ChatAnonymousUserIdValueNew)

        return ChatAnonymousUserIdValueNew
    }
};



export function GetAllLLMS(): any[] {
    const AllLLMS: any[] = []

    AllLLMS.push({name:"Gemini", id:"Gemini", avatar:"/images/llms/Gemini.webp", summary:'Google Gemini'})

    AllLLMS.push({name:"ChatGPT 3.5", id:"ChatGPT3.5", avatar:"/images/llms/ChatGPT.webp", summary:'OpenAI ChatGPT3.5'})
    AllLLMS.push({name:"ChatGPT 4", id:"ChatGPT4", avatar:"/images/llms/ChatGPT-4.webp", summary:'OpenAI ChatGPT 4'})

    //AllLLMS.push({name:"Llama 2", id:"Llama2", avatar:"/images/llms/llama2.webp", summary:'Facebook Llama 2'})

    AllLLMS.push({name:"Baidu Wenxin", id:"BaiduWenxin", avatar:"/images/llms/BaiduWenxin.png", summary:'Baidu Wenxin'})

    AllLLMS.push({name:"Gemini Mind Map", id:"GeminiMindMap", avatar:"/images/llms/Gemini.webp", summary:'Google Gemini'})

    //AllLLMS.push({name:"Generate Image", id:"Dall-E-2", avatar:"/images/llms/openai-dall-e-2.png", summary:'Openai Dall-E-2 generate image'})
    //AllLLMS.push({name:"Generate Audio", id:"TTS-1", avatar:"/images/llms/openai-dall-e-2.png", summary:'Openai TTS-1 genereate audio'})

    return AllLLMS
}

export function GetAllLLMById(id: string): any[] {
    const GetAllLLMSData = GetAllLLMS()

    return GetAllLLMSData.filter((Item: any)=>Item.id == id)
}

export function CheckPermission(auth: any, router: any, forcelogout: boolean) {
    const roleList = ['admin', 'user']
    if(auth && auth.user && auth.user.loading == '1')  { // User info loaded by browser
        if(auth && auth.user && auth.user.role != undefined && roleList.includes(auth.user.role) ) {
            //Permission Valid
        }
        else if(router && auth && auth.user && auth.user.role == undefined) {
            console.log("auth.user.role /login", auth.user.role)
            console.log("auth.user", auth.user)
            router.replace('/login')
        }
    }
    if(forcelogout) {
        router.replace('/login')
    }
}

interface ReportSection {
    title: string;
    content: string[];
}

export function parseMarkdown(markdownText: string): ReportSection[] {
    const lines = markdownText.trim().split('\n');
    const sections: ReportSection[] = [];
    let currentTitle = '';
    let currentContent = [];
    const linesNew = [];

    for (const line of lines) {
        if(line && line.trim() && line.trim()!='') {
            linesNew.push(line.trim())
        }
    }

    for (const line of linesNew) {
        if (line.startsWith("**")) {
            if (currentTitle != line.replaceAll("**", "").trim()) {
                sections.push({ title: currentTitle, content: currentContent });
                currentTitle = line.replaceAll("**", "").trim();
            }
            currentContent = [];
        }
        else {
            currentContent.push(line.replaceAll("* ", "").trim());
        }
    }

    // Push the last section into the array
    if (currentTitle && currentContent.length>0) {
        sections.push({ title: currentTitle, content: currentContent });
    }

    return sections.filter((Item: any) => Item.title != '');
}

export function generateRandomNumber(min: number, max: number): number {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function downloadJson(JsonData: any, FileName: string) {
    console.log("downloadJson", JsonData);
    const blob = new Blob([JSON.stringify(JsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = FileName + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

export function AppAvatar(backEndApiHost: string, avatar: string) {
    if(avatar.startsWith('http')) {

        return avatar
    }
    else {

        return backEndApiHost + '/images/avatars/' + avatar
    }
}

export const sleep = (ms: number) => {

    return new Promise(resolve => setTimeout(resolve, ms));
}
