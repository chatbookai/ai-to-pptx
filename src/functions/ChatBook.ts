import authConfig from '@/configs/auth'
import axios from 'axios'
import { getNanoid } from '@/functions/ChivesWallets';

const ChatKnowledge = "ChatKnowledge"
const ChatChat = "ChatChat"
const ChatChatName = "ChatChatName"
const ChatKnowledgeHistory = "ChatKnowledgeHistory"
const ChatChatHistory = "ChatChatHistory"
const ChatBookLanguage = "ChatBookLanguage"
const ChatAnonymousUserId = "ChatAnonymousUserId"

export async function GetLLMS() {
    const response = await axios.get(authConfig.backEndApiChatBook + '/api/llms', { }).then(res=>res.data)
    
    return response
}

export async function GetAllMyDataset(token: string) {
    const response = await axios.post(authConfig.backEndApiChatBook + '/api/getdatasetpage/0/100',
        {},
        {
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        },
        params: {}
    }).then(res=>res.data);
    
    return response
}


export function ChatKnowledgeInit(MsgList: any) {
    const ChatLogList: any = []
    MsgList.map((Item: any)=>{
        ChatLogList.push({
            "message": Item.send,
            "Timestamp": Item.timestamp,
            "Sender": Item.userId,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
          })
        ChatLogList.push({
            "message": Item.received,
            "Timestamp": Item.timestamp,
            "Sender": 9999999999,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
          })
    })
    window.localStorage.setItem(ChatKnowledge, JSON.stringify(ChatLogList))

    return ChatLogList
}

export function ChatKnowledgeInput(Message: string, UserId: number, knowledgeId: number) {
	const ChatKnowledgeText = window.localStorage.getItem(ChatKnowledge)      
    const ChatKnowledgeList = ChatKnowledgeText ? JSON.parse(ChatKnowledgeText) : []
    ChatKnowledgeList.push({
      "message": Message,
      "Timestamp": String(Date.now()),
      "Sender": UserId,
      "knowledgeId": knowledgeId,
      "feedback": {
          "isSent": true,
          "isDelivered": true,
          "isSeen": true
      }
    })
    window.localStorage.setItem(ChatKnowledge, JSON.stringify(ChatKnowledgeList))
}

export async function ChatKnowledgeOutput(Message: string, Token: string, UserId: number, knowledgeId: number, setProcessingMessages:any) {
    const ChatKnowledgeHistoryText = window.localStorage.getItem(ChatKnowledgeHistory)      
    const ChatKnowledgeList = ChatKnowledgeHistoryText ? JSON.parse(ChatKnowledgeHistoryText) : []
    const History: any = []
    if(ChatKnowledgeList && ChatKnowledgeList[UserId] && ChatKnowledgeList[UserId][knowledgeId]) {
        const ChatKnowledgeListLast10 = ChatKnowledgeList[UserId][knowledgeId].slice(-10)
        ChatKnowledgeListLast10.map((Item: any)=>{
            if(Item.question && Item.answer) {
                History.push([Item.question,Item.answer.substring(0, 200)])
            }
        })
    }
    try {
        setProcessingMessages('')
        const response = await fetch(authConfig.backEndApiChatBook + `/api/ChatOpenaiKnowledge`, {
          method: 'POST',
          headers: {
            Authorization: Token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: Message, history: History, knowledgeId: knowledgeId }),
        });
        if (!response.body) {
          throw new Error('Response body is not readable as a stream');
        }
        const reader = response.body.getReader();
        let responseText = "";
        while (true) {
          const { done, value } = await reader.read();
          const text = new TextDecoder('utf-8').decode(value);
          setProcessingMessages((prevText: string) => prevText + text);
          responseText = responseText + text;
          if (done) {
            setProcessingMessages('')
            break;
          }
        }
        if(responseText) {
            console.log("OpenAI Response:", responseText)
            ChatKnowledgeInput(responseText, 999999, knowledgeId)
            ChatKnowledgeHistoryInput(Message, responseText, UserId, knowledgeId)
            setProcessingMessages(responseText);

            return true
        }
        else {
            return false
        }

    } 
    catch (error: any) {
        console.log('Error:', error.message);
        
        return false
    }
}

export function ChatKnowledgeHistoryInput(question: string, answer: string, UserId: number, knowledgeId: number) {
    console.log("ChatKnowledgeHistoryList", question, answer, UserId)
	const ChatKnowledgeHistoryText = window.localStorage.getItem(ChatKnowledgeHistory)      
    const ChatKnowledgeHistoryList = ChatKnowledgeHistoryText ? JSON.parse(ChatKnowledgeHistoryText) : {}
    if(ChatKnowledgeHistoryList && ChatKnowledgeHistoryList[UserId] && ChatKnowledgeHistoryList[UserId][knowledgeId]) {
        ChatKnowledgeHistoryList[UserId][knowledgeId].push({
            "question": question,
            "Timestamp": String(Date.now()),
            "answer": answer,
        })
    }
    else {
        ChatKnowledgeHistoryList[UserId] = {}
        ChatKnowledgeHistoryList[UserId][knowledgeId] = [{
            "question": question,
            "Timestamp": String(Date.now()),
            "answer": answer,
        }]
    }
    console.log("ChatKnowledgeHistoryList", ChatKnowledgeHistoryList)
    window.localStorage.setItem(ChatKnowledgeHistory, JSON.stringify(ChatKnowledgeHistoryList))
}

export function ChatChatList() {
    const ChatChatText = window.localStorage.getItem(ChatChat)      
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    
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

export function DeleteChatChat() {
    window.localStorage.setItem(ChatChat, JSON.stringify([]))
}

export function DeleteChatChatByHashId(HashId: string) {
    const ChatChatText = window.localStorage.getItem(ChatChat)
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    const ChatChatListFilter = ChatChatList.filter((item: any)=>item.HashId!=HashId)
    window.localStorage.setItem(ChatChat, JSON.stringify(ChatChatListFilter))
}

export function DeleteChatChatHistory(UserId: number | string, knowledgeId: number | string, appId: string) {
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][appId]) {
        ChatChatHistoryList[UserId][knowledgeId][appId] = []
        window.localStorage.setItem(ChatChatHistory, JSON.stringify(ChatChatHistoryList))
    }
}

export function DeleteChatChatHistoryByHashId(UserId: number | string, knowledgeId: number | string, appId: string, HashId: string) {
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][appId]) {
        const TempList = ChatChatHistoryList[UserId][knowledgeId][appId]
        const TempListFilter = TempList.filter((item: any)=>item.HashId!=HashId)
        ChatChatHistoryList[UserId][knowledgeId][appId] = TempListFilter
        window.localStorage.setItem(ChatChatHistory, JSON.stringify(ChatChatHistoryList))
    }
}

export function ChatChatInit(MsgList: any, PromptTemplate: string, ChatroomTxId: string) {
    const ChatLogList: any = []
    if(PromptTemplate && PromptTemplate!= "") {
        ChatLogList.push({
            "message": PromptTemplate,
            "Timestamp": Date.now(),
            "Sender": ChatroomTxId,
            "Id": '0',
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
            "message": Item.Content,
            "Timestamp": Item.Timestamp,
            "Id": Item.Id,
            "Sender": Item.From,
            "Item": Item,
            "feedback": {
                "isSent": true,
                "isDelivered": true,
                "isSeen": true
            }
          })
    })
    console.log("MsgList", MsgList)

    return ChatLogList
}

export function ChatChatInput(HashId: string, Question: string, Message: string, UserId: number | string, responseTime: number, History: any[]) {
	const ChatChatText = window.localStorage.getItem(ChatChat)      
    const ChatChatList = ChatChatText ? JSON.parse(ChatChatText) : []
    ChatChatList.push({
      "message": Message,
      "Timestamp": Date.now(),
      "responseTime": responseTime,
      "HashId": HashId,
      "Sender": UserId,
      "history": History,
      "question": Question,
      "feedback": {
          "isSent": true,
          "isDelivered": true,
          "isSeen": true
      }
    })
    window.localStorage.setItem(ChatChat, JSON.stringify(ChatChatList))
}

export async function ChatAiAudioV1(Message: string, Token: string, voice: string, appId: string, userType: string) {
    try {
        const anonymousUserId = getAnonymousUserId()
        const response = await axios.post(authConfig.backEndApiChatBook + '/api/app/audio', {
                            question: Message,
                            voice: voice,
                            appId: appId,
                            userType: userType
                        }, {
                            headers: {
                                Authorization: userType=='User' ? Token : anonymousUserId,
                                'Content-Type': 'application/json',
                            }
                        }).then(res=>res.data);
        
        return response;
    } 
    catch (error: any) {
        console.log('Error:', error.message);
        
        return
    }
      
}

export async function ChatAiOutputV1(_id: string, Message: string, Token: string, UserId: number | string, chatId: number | string, appId: string, publishId: string, setProcessingMessages: any, template: string, setFinishedMessage: any, userType: string, allowQuestionGuide: boolean, setQuestionGuide: any, questionGuideTemplate: string, stopMsg: boolean, setStopMsg: any, GetModelFromAppValue: any, DatasetIdList: string[], DatasetPrompt: any) {
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
        setProcessingMessages('')
        console.log("chatId", chatId)
        if(chatId && UserId)  {
            const anonymousUserId = getAnonymousUserId()
            const startTime = performance.now()
            const response = await fetch(authConfig.backEndApiChatBook + `/api/` + (userType=='User' ? 'ChatApp' : 'ChatAppAnonymous'), {
                method: 'POST',
                headers: {
                    Authorization: userType=='User' ? Token : anonymousUserId,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    question: Message, 
                    history: History, 
                    appId: appId, 
                    publishId, 
                    template: template, 
                    _id, 
                    allowChatLog: 1, 
                    temperature: GetModelFromAppValue?.LLMModel?.temperature || 0.6,
                    datasetId: DatasetIdList,
                    DatasetPrompt
                }),
            });
            if (!response.body) {
            throw new Error('Response body is not readable as a stream');
            }
            const reader = response.body.getReader();
            let responseText = "";
            while (true) {
                const { done, value } = await reader.read();
                const text = new TextDecoder('utf-8').decode(value);
                setProcessingMessages((prevText: string) => prevText + text);
                responseText = responseText + text;
                setQuestionGuide(null)
                if (done || stopMsg) {
                    setProcessingMessages('')
                    break;
                }
            }
            if(responseText) {
                console.log("OpenAI Response:", UserId, responseText)
                const endTime = performance.now()
                const responseTime = Math.round((endTime - startTime) * 100 / 1000) / 100
                ChatChatInput(_id, Message, responseText, 999999, responseTime, History)
                ChatChatHistoryInput(_id, Message, responseText, UserId, chatId, appId, responseTime, History)
                setFinishedMessage(responseText);

                //allowQuestionGuide
                if(allowQuestionGuide) {
                    const url = authConfig.backEndApiChatBook + '/api/' + (userType === 'User' ? 'ChatApp' : 'ChatAppAnonymous');
                    const headers = {
                        Authorization: userType === 'User' ? Token : anonymousUserId,
                        'Content-Type': 'application/json',
                    };
                    History.push([Message, responseText])
                    console.log("questionGuideTemplate", questionGuideTemplate)

                    //questionGuideTemplate define by zh-CN.json language etc files
                    //const questionGuideTemplate = '你是一个AI智能助手，可以回答和解决我的问题。请结合前面的对话记录，帮我生成 3 个问题，引导我继续提问。问题的长度应小于20个字符，要求使用UTF-8编码，按 JSON 格式返回: ["问题1", "问题2", "问题3"]'
                    setQuestionGuide(['Generating, please wait...'])
                    const data = {
                                question: questionGuideTemplate,
                                history: History,
                                appId: appId,
                                publishId: publishId,
                                template: template,
                                temperature: 0.1,
                                _id: _id,
                                allowChatLog: 0
                            };
                    const response = await axios.post(url, data, { headers: headers }).then(res=>res.data);
                    if(response) {
                        if(response && response.length == 3) {
                            setQuestionGuide(response)
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

function extractTextBetween(text: string, startMarker: string, endMarker: string) {
    
    // 创建正则表达式模式，使用非贪婪匹配来获取开始和结束标记之间的文本
    const regex = new RegExp(`${startMarker}(.*?)${endMarker}`, 's');
    
    // 使用正则表达式匹配文本
    const match = text.match(regex);
    
    // 如果匹配成功，返回匹配组中的文本；否则返回原始文本
    return match ? match[1] : text;
}

export function ChatChatHistoryInput(HashId: string, question: string, answer: string, UserId: number | string, knowledgeId: number | string, appId: string, responseTime: number, History: any[]) {
    
    //console.log("ChatChatHistoryList", question, answer, UserId)
	const ChatChatHistoryText = window.localStorage.getItem(ChatChatHistory)      
    const ChatChatHistoryList = ChatChatHistoryText ? JSON.parse(ChatChatHistoryText) : {}
    if(ChatChatHistoryList && ChatChatHistoryList[UserId] && ChatChatHistoryList[UserId][knowledgeId] && ChatChatHistoryList[UserId][knowledgeId][appId]) {
        ChatChatHistoryList[UserId][knowledgeId][appId].push({
            "question": question,
            "Timestamp": String(Date.now()),
            "responseTime": responseTime,
            "HashId" : HashId,
            "history": History,
            "answer": answer,
        })
    }
    else {
        ChatChatHistoryList[UserId] = {}
        ChatChatHistoryList[UserId][knowledgeId] = {}
        ChatChatHistoryList[UserId][knowledgeId][appId] = [{
            "question": question,
            "Timestamp": String(Date.now()),
            "responseTime": responseTime,
            "HashId" : HashId,
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
    const blob = new Blob([JSON.stringify(JsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = FileName + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

export function downloadCsv(JsonData: any, FileName: string) {
    const blob = new Blob([JsonData], { type: 'application/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = FileName + '.csv';
    a.click();
    URL.revokeObjectURL(url);
}