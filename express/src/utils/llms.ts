import { Request, Response } from "express";

import * as fs from "fs";
import path from "path";
import axios from "axios";
import sharp from "sharp";

import { OpenAI } from "openai";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";

//import { LLMChain } from "langchain/chains";
//import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatBaiduWenxin } from "@langchain/community/chat_models/baiduwenxin";

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrieverTool } from "langchain/agents/toolkits";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

/*
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { JSONLinesLoader } from 'langchain/document_loaders/fs/json';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured';
*/

import { Document } from "@langchain/core/documents";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { DataDir } from "./const";
import { db, getDbRecord, getDbRecordALL } from "./db";
import { getLLMSSetting, GetSetting, log, isFile } from "./utils";

import dotenv from "dotenv";

dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
const PINECONE_NAME_SPACE = process.env.PINECONE_NAME_SPACE;

let getLLMSSettingData: any = null;
let ChatOpenAIModel: any = null;
let pinecone: any = null;
let ChatBookOpenAIStreamResponse = "";
let ChatGeminiModel: any = null;
let ChatBaiduWenxinModel: any = null;

export function NotUsed() {
  console.log("OpenAI", OpenAI);
  console.log("PromptTemplate", PromptTemplate);
}

export async function initChatBookOpenAI(knowledgeId: number | string) {
  getLLMSSettingData = await getLLMSSetting(knowledgeId);
  const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE;
  const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
  const OPENAI_Temperature = getLLMSSettingData.Temperature;
  if (OPENAI_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
    if (
      OPENAI_API_BASE &&
      OPENAI_API_BASE != "" &&
      OPENAI_API_BASE.length > 16
    ) {
      process.env.OPENAI_BASE_URL = OPENAI_API_BASE;
      process.env.OPENAI_API_KEY = OPENAI_API_KEY;
    }
    ChatOpenAIModel = new ChatOpenAI({
      modelName: getLLMSSettingData.ModelName ?? "gpt-3.5-turbo",
      openAIApiKey: OPENAI_API_KEY,
      temperature: Number(OPENAI_Temperature),
    });
    pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
  }
}

export async function initChatBookOpenAIStream(
  res: Response,
  knowledgeId: number | string
) {
  getLLMSSettingData = await getLLMSSetting(knowledgeId);
  const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE;
  const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
  const OPENAI_Temperature = getLLMSSettingData.Temperature;
  if (OPENAI_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
    if (
      OPENAI_API_BASE &&
      OPENAI_API_BASE != "" &&
      OPENAI_API_BASE.length > 16
    ) {
      process.env.OPENAI_BASE_URL = OPENAI_API_BASE;
      process.env.OPENAI_API_KEY = OPENAI_API_KEY;
    }
    try {
      ChatOpenAIModel = new ChatOpenAI({
        modelName: getLLMSSettingData.ModelName ?? "gpt-3.5-turbo",
        openAIApiKey: OPENAI_API_KEY,
        temperature: Number(OPENAI_Temperature),
        streaming: true,
        callbacks: [
          {
            handleLLMNewToken(token) {
              res.write(token);
              ChatBookOpenAIStreamResponse =
                ChatBookOpenAIStreamResponse + token;
            },
          },
        ],
      });
      pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
    } catch (Error: any) {
      log("initChatBookOpenAIStream Error", Error);
    }
  } else {
    res.write("Not set API_KEY in initChatBookOpenAIStream");
    res.end();
  }
}

export async function chatChatOpenAI(
  res: Response,
  knowledgeId: number | string,
  userId: number | string,
  question: string,
  history: any[]
) {
  ChatBookOpenAIStreamResponse = "";
  await initChatBookOpenAIStream(res, knowledgeId);

  const pastMessages: any[] = [];
  if (history && history.length > 0) {
    history.map((Item) => {
      pastMessages.push(new HumanMessage(Item[0]));
      pastMessages.push(new AIMessage(Item[1]));
    });
  }
  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(pastMessages),
  });
  try {
    const chain = new ConversationChain({
      llm: ChatOpenAIModel,
      memory: memory,
    });
    await chain.call({ input: question });
    const insertChatLog = db.prepare(
      "INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)"
    );
    insertChatLog.run(
      knowledgeId,
      question,
      ChatBookOpenAIStreamResponse,
      userId,
      Date.now(),
      JSON.stringify([]),
      JSON.stringify(history)
    );
    insertChatLog.finalize();
  } catch (error: any) {
    console.log("chatChatOpenAI error", error.message);
    res.write(error.message);
  }
  res.end();
}

export async function chatKnowledgeOpenAI(
  res: Response,
  knowledgeId: number | string,
  userId: number,
  question: string,
  history: any[]
) {
  await initChatBookOpenAIStream(res, knowledgeId);
  if (!ChatOpenAIModel) {
    res.end();
    return;
  }
  const CONDENSE_TEMPLATE: string | unknown = await GetSetting(
    "CONDENSE_TEMPLATE",
    knowledgeId,
    userId
  );
  const QA_TEMPLATE: string | unknown = await GetSetting(
    "QA_TEMPLATE",
    knowledgeId,
    userId
  );

  log("Chat pinecone", pinecone);
  log("Chat knowledgeId", knowledgeId);
  log("Chat CONDENSE_TEMPLATE", CONDENSE_TEMPLATE);
  log("Chat QA_TEMPLATE", QA_TEMPLATE);
  log("Chat PINECONE_INDEX_NAME", PINECONE_INDEX_NAME);

  if (!question) {
    return { message: "No question in the request" };
  }

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll("\n", " ");

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore */

    const PINECONE_NAME_SPACE_USE =
      PINECONE_NAME_SPACE + "_" + String(knowledgeId);
    log("Chat PINECONE_NAME_SPACE_USE", PINECONE_NAME_SPACE_USE);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: getLLMSSettingData.OPENAI_API_KEY,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
      namespace: PINECONE_NAME_SPACE_USE,
    });

    // Use a callback to get intermediate sources from the middle of the chain
    let resolveWithDocuments: any;
    const documentPromise = new Promise((resolve) => {
      resolveWithDocuments = resolve;
    });

    const retriever = vectorStore.asRetriever({
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents);
          },
        },
      ],
    });

    const chain = makeChainOpenAI(
      retriever,
      String(CONDENSE_TEMPLATE),
      String(QA_TEMPLATE)
    );

    const pastMessages = history
      .map((message) => {
        return [`Human: ${message[0]}`, `Assistant: ${message[1]}`].join("\n");
      })
      .join("\n");

    // Ask a question using chat history
    const response = await chain.invoke({
      question: sanitizedQuestion,
      chat_history: pastMessages,
    });

    const sourceDocuments = await documentPromise;

    const insertChatLog = db.prepare(
      "INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)"
    );
    insertChatLog.run(
      Number(knowledgeId),
      question,
      response,
      userId,
      Date.now(),
      JSON.stringify(sourceDocuments),
      JSON.stringify(history)
    );
    insertChatLog.finalize();
    res.end();

    return { text: response, sourceDocuments };
  } catch (error: any) {
    log("Error Chat:", error);

    return { error: error.message || "Something went wrong" };
  }
}

export function makeChainOpenAI(
  retriever: any,
  CONDENSE_TEMPLATE: string,
  QA_TEMPLATE: string
) {
  const condenseQuestionPrompt =
    ChatPromptTemplate.fromTemplate(CONDENSE_TEMPLATE);
  const answerPrompt = ChatPromptTemplate.fromTemplate(QA_TEMPLATE);

  // Rephrase the initial question into a dereferenced standalone question based on
  // the chat history to allow effective vectorstore querying.
  const standaloneQuestionChain = RunnableSequence.from([
    condenseQuestionPrompt,
    ChatOpenAIModel,
    new StringOutputParser(),
  ]);

  // Retrieve documents based on a query, then format them.
  const retrievalChain = retriever.pipe(combineDocumentsFn);

  // Generate an answer to the standalone question based on the chat history
  // and retrieved documents. Additionally, we return the source documents directly.
  const answerChain = RunnableSequence.from([
    {
      context: RunnableSequence.from([
        (input) => input.question,
        retrievalChain,
      ]),
      chat_history: (input) => input.chat_history,
      question: (input) => input.question,
    },
    answerPrompt,
    ChatOpenAIModel,
    new StringOutputParser(),
  ]);

  // First generate a standalone question, then answer it based on
  // chat history and retrieved context documents.
  const conversationalRetrievalQAChain = RunnableSequence.from([
    {
      question: standaloneQuestionChain,
      chat_history: (input) => input.chat_history,
    },
    answerChain,
  ]);

  return conversationalRetrievalQAChain;
}

export function combineDocumentsFn(docs: any[], separator = "\n\n") {
  const serializedDocs = docs.map((doc) => doc.pageContent);

  return serializedDocs.join(separator);
}

export async function debug(res: Response, knowledgeId: number | string) {
  await initChatBookOpenAIStream(res, knowledgeId);
  if (!ChatOpenAIModel) {
    res.end();
    return;
  }
  const pastMessages = [
    new HumanMessage("what is Bitcoin?"),
    new AIMessage("Nice to meet you, Jonas!"),
  ];

  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(pastMessages),
  });

  const chain = new ConversationChain({ llm: ChatOpenAIModel, memory: memory });

  const res2 = await chain.call({ input: "您使用的是哪个模型?" });
  console.log({ res2 });
}

export async function debug_agent(res: Response, knowledgeId: number | string) {
  getLLMSSettingData = await getLLMSSetting(knowledgeId);
  const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE;
  const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
  const OPENAI_Temperature = getLLMSSettingData.Temperature;
  if (OPENAI_API_BASE && OPENAI_API_BASE != "" && OPENAI_API_BASE.length > 16) {
    process.env.OPENAI_BASE_URL = OPENAI_API_BASE;
    process.env.OPENAI_API_KEY = OPENAI_API_KEY;
  }
  const searchTool = new TavilySearchResults();

  //const toolResult = await searchTool.invoke("郑州天气如何?");
  //res.status(200).json(JSON.parse(toolResult));
  //console.log(toolResult);

  const loader = new CheerioWebBaseLoader(
    "https://docs.smith.langchain.com/overview"
  );
  const rawDocs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.splitDocuments(rawDocs);
  const vectorstore = await MemoryVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey: getLLMSSettingData.OPENAI_API_KEY })
  );
  const retriever = vectorstore.asRetriever();
  const retrieverResult = await retriever.getRelevantDocuments(
    "how to upload a dataset"
  );
  console.log("retrieverResult", retrieverResult);

  const retrieverTool = createRetrieverTool(retriever, {
    name: "langsmith_search",
    description:
      "Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",
  });
  console.log("retrieverTool", retrieverTool);

  const tools = [searchTool, retrieverTool];

  const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/openai-functions-agent"
  );
  console.log("prompt", prompt);

  const llm = new ChatOpenAI({
    modelName: getLLMSSettingData.ModelName ?? "gpt-3.5-turbo",
    openAIApiKey: OPENAI_API_KEY,
    temperature: Number(OPENAI_Temperature),
  });

  const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
  });
  console.log("agent", agent);

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  });
  console.log("agentExecutor", agentExecutor);

  const result1 = await agentExecutor.invoke({
    input: "how can langsmith help with testing?!",
  });
  console.log(result1);
}

export async function GenereateImageUsingDallE2(
  res: Response,
  knowledgeId: number | string,
  userId: string,
  question: string,
  size = "1024x1024"
) {
  getLLMSSettingData = await getLLMSSetting(knowledgeId);
  const OPENAI_API_BASE =
    getLLMSSettingData.OPENAI_API_BASE ?? "https://api.openai.com/v1";
  const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
  if (OPENAI_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
    const requestData = {
      model: "dall-e-2",
      prompt: question,
      n: 1,
      size: size,
      style: "vivid",
    };

    //style: natural | vivid
    //256x256, 512x512, or 1024x1024 for dall-e-2
    try {
      const response = await axios.post(
        OPENAI_API_BASE + "/images/generations",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
      const generatedImage = response.data;

      if (
        generatedImage &&
        generatedImage["data"] &&
        generatedImage["data"][0] &&
        generatedImage["data"][0]["url"]
      ) {
        const response = await axios({
          method: "get",
          url: generatedImage["data"][0]["url"],
          responseType: "arraybuffer", // 使用 arraybuffer
        });
        const data = Buffer.from(response.data);
        const DateNow = Date.now();
        const ShortFileName =
          DateNow + "-" + Math.round(Math.random() * 1e9) + "-" + knowledgeId;
        const FileName = DataDir + "/image/" + ShortFileName + ".png";
        const generatedImageTS = {
          ...requestData,
          FileName: FileName,
          type: "image",
          status: "OK",
          timestamp: DateNow,
          ShortFileName: ShortFileName,
        };
        fs.writeFileSync(FileName, data);
        console.log("response", response);

        const insertChatLog = db.prepare(
          "INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)"
        );
        insertChatLog.run(
          knowledgeId,
          question,
          JSON.stringify(generatedImageTS),
          userId,
          Date.now(),
          JSON.stringify([]),
          JSON.stringify([])
        );
        insertChatLog.finalize();
        log("Generated Image:", generatedImageTS);

        await compressPng(ShortFileName);

        return generatedImageTS;
      } else {
        log("Error generating image:", generatedImage);

        return { generatedImage };
      }
    } catch (error) {
      log("Error generating image:", error);

      return { error };
    }
  } else {
    res.write("Not set API_KEY");
    res.end();
  }
}

export async function GenereateAudioUsingTTS(
  res: Response,
  knowledgeId: number | string,
  userId: string,
  question: string,
  voice = "alloy"
) {
  getLLMSSettingData = await getLLMSSetting(knowledgeId);
  const OPENAI_API_BASE =
    getLLMSSettingData.OPENAI_API_BASE ?? "https://api.openai.com/v1";
  const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;

  if (OPENAI_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
    const requestData = {
      model: "tts-1",
      voice: voice,
      input: question,
      response_format: "mp3",
    };
    try {
      const response = await axios.post(
        OPENAI_API_BASE + "/audio/speech",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          responseType: "arraybuffer",
        }
      );
      console.log("Generated Audio:", response.data);
      const generatedAudio = response.data;
      const data = Buffer.from(generatedAudio);
      const DateNow = Date.now();
      const ShortFileName =
        DateNow + "-" + Math.round(Math.random() * 1e9) + "-" + knowledgeId;
      const FileName = DataDir + "/audio/" + ShortFileName + ".mp3";
      fs.writeFileSync(FileName, data);
      const generatedAudioTS = {
        ...requestData,
        FileName: FileName,
        type: "audio",
        status: "OK",
        timestamp: DateNow,
        ShortFileName: ShortFileName,
      };
      const insertChatLog = db.prepare(
        "INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)"
      );
      insertChatLog.run(
        knowledgeId,
        question,
        JSON.stringify(generatedAudioTS),
        userId,
        DateNow,
        JSON.stringify([]),
        JSON.stringify([])
      );
      insertChatLog.finalize();
      log("Generated Audio:", generatedAudioTS);

      return generatedAudioTS;
    } catch (error) {
      log("Error generating Audio:", error);

      return { error };
    }
  } else {
    res.write("Not set API_KEY");
    res.end();
  }
}

export async function outputAudio(res: Response, file: string) {
  try {
    const FileName = DataDir + "/audio/" + file + ".mp3";
    if (isFile(FileName)) {
      const readStream = fs.createReadStream(FileName);
      res.setHeader("Content-Type", "audio/mpeg");
      readStream.pipe(res);
      console.log("FileName Exist: ", FileName);
    } else {
      res.status(200).json({ error: "File not exist" });
    }
  } catch (error) {
    console.error("outputImage Error:", error);
    res.status(200).json({ error: "File not exist" });
  }
}

export async function compressPng(file: string) {
  const FileName = path.join(DataDir, "/image/" + file + ".png");
  const FileNameNew = path.join(DataDir, "/image/" + file + "_thumbnail.png");
  if (!isFile(FileNameNew) && isFile(FileName)) {
    const quality = 80;
    try {
      await sharp(FileName)
        .resize({ fit: "inside", width: 800, withoutEnlargement: true })
        .png({ quality })
        .toFile(FileNameNew);
    } catch (error: any) {
      console.log("compressPng", file, error.message);
    }
  }
}

export async function compressImageForImage(
  file: string,
  width: number | undefined,
  height: number | undefined
) {
  const FileName = path.join(DataDir, "/imageforimage/" + file);
  const FileNameNew = path.join(
    DataDir,
    "/imageforimage/Resize_" +
      (width ? width + "_" + file : height + "_" + file)
  );
  if (!isFile(FileNameNew) && isFile(FileName)) {
    const quality = 80;
    try {
      if (width) {
        await sharp(FileName)
          .resize({ fit: "inside", width: width, withoutEnlargement: true })
          .png({ quality })
          .toFile(FileNameNew);
      } else if (height) {
        await sharp(FileName)
          .resize({ fit: "inside", height: height, withoutEnlargement: true })
          .png({ quality })
          .toFile(FileNameNew);
      }
    } catch (error: any) {
      console.log("compressPng", file, error.message);
    }
    console.log("compressPng", file);
  }
  return FileNameNew;
}

export async function outputImage(res: Response, file: string) {
  try {
    await compressPng(file);
    const FileName = path.join(DataDir, "/image/" + file + "_thumbnail.png");
    if (isFile(FileName)) {
      compressPng(file);
      const readStream = fs.createReadStream(FileName);
      res.setHeader("Content-Type", "image/png");
      readStream.pipe(res);
      console.log("FileName Exist: ", FileName);
    } else {
      res.status(200).json({ error: "File not exist" });
    }
  } catch (error) {
    console.error("outputImage Error:", error);
    res.status(200).json({ error: "File not exist" });
  }
}

export async function outputImageOrigin(res: Response, file: string) {
  try {
    const FileName = path.join(DataDir, "/image/" + file + ".png");
    if (isFile(FileName)) {
      const readStream = fs.createReadStream(FileName);
      res.setHeader("Content-Type", "image/png");
      readStream.pipe(res);
      console.log("FileName Exist: ", FileName);
    } else {
      res.status(200).json({ error: "File not exist" });
    }
  } catch (error) {
    console.error("outputImage Error:", error);
    res.status(200).json({ error: "File not exist" });
  }
}

export async function parseFiles() {
  try {
    const RecordsAll: any[] = (await getDbRecordALL(
      `SELECT * from files where status = '0' order by id asc limit 2`
    )) as any[];
    await Promise.all(
      RecordsAll.map(async (FileItem: any) => {
        const KnowledgeItemId = FileItem.knowledgeId;
        await initChatBookOpenAI(KnowledgeItemId);
        console.log("parseFiles getLLMSSettingData", getLLMSSettingData);
        if (
          getLLMSSettingData.OPENAI_API_KEY &&
          getLLMSSettingData.OPENAI_API_KEY != ""
        ) {
          console.log("KnowledgeItemId", KnowledgeItemId);
          console.log(
            "process.env.OPENAI_BASE_URL",
            process.env.OPENAI_BASE_URL
          );
          const pdfFilePath = DataDir + "/uploadfiles/" + FileItem.newName;
          if (isFile(pdfFilePath)) {
            const pdfLoader = new PDFLoader(pdfFilePath);
            const rawDoc = await pdfLoader.load();

            const textSplitter = new RecursiveCharacterTextSplitter({
              chunkSize: 1000,
              chunkOverlap: 200,
            });
            const SplitterDocs = await textSplitter.splitDocuments(rawDoc);
            log("parseFiles rawDocs docs count: ", rawDoc.length);
            log("parseFiles textSplitter docs count: ", SplitterDocs.length);
            log("parseFiles creating vector store begin ...");

            const embeddings = new OpenAIEmbeddings({
              openAIApiKey: getLLMSSettingData.OPENAI_API_KEY,
            });
            const index = pinecone.Index(PINECONE_INDEX_NAME);

            const PINECONE_NAME_SPACE_USE =
              PINECONE_NAME_SPACE + "_" + String(KnowledgeItemId);
            await PineconeStore.fromDocuments(SplitterDocs, embeddings, {
              pineconeIndex: index,
              namespace: PINECONE_NAME_SPACE_USE,
              textKey: "text",
            });
            log(
              "parseFiles creating vector store finished",
              PINECONE_NAME_SPACE_USE
            );

            const UpdateFileParseStatus = db.prepare(
              "update files set status = ? where id = ?"
            );
            UpdateFileParseStatus.run(1, FileItem.id);
            UpdateFileParseStatus.finalize();
            const destinationFilePath = path.join(
              DataDir + "/parsedfiles/",
              FileItem.newName
            );
            fs.rename(
              DataDir + "/uploadfiles/" + FileItem.newName,
              destinationFilePath,
              (err) => {
                if (err) {
                  log("parseFiles Error moving file:", err, FileItem.newName);
                } else {
                  log("parseFiles File moved successfully.", FileItem.newName);
                }
              }
            );
            log("parseFiles change the files status finished", FileItem);
          } else {
            //File Not Exist
            const UpdateFileParseStatus = db.prepare(
              "update files set status = ? where id = ?"
            );
            UpdateFileParseStatus.run(-1, FileItem.id);
            UpdateFileParseStatus.finalize();
          }

          return;
        }
      })
    );
  } catch (error: any) {
    log("parseFiles Failed to ingest your data", error);
  }
}

export async function initChatBookGeminiStream(
  res: Response,
  knowledgeId: number | string
) {
  getLLMSSettingData = await getLLMSSetting(knowledgeId);
  const OPENAI_API_BASE = getLLMSSettingData.OPENAI_API_BASE;
  const OPENAI_API_KEY = getLLMSSettingData.OPENAI_API_KEY;
  if (OPENAI_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
    process.env.GOOGLE_API_KEY = OPENAI_API_KEY;
    ChatGeminiModel = new ChatGoogleGenerativeAI({
      modelName: getLLMSSettingData.ModelName ?? "gemini-pro",
      maxOutputTokens: 2048,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    });
    pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
  } else {
    res.write("Not set API_KEY");
    res.end();
  }
}

export async function chatChatGemini(
  res: Response,
  knowledgeId: number | string,
  userId: string,
  question: string,
  history: any[]
) {
  await initChatBookGeminiStream(res, knowledgeId);

  const input2 = [
    new HumanMessage({
      content: [
        {
          type: "text",
          text: question,
        },
      ],
    }),
  ];
  try {
    const res3 = await ChatGeminiModel.stream(input2);
    let response = "";
    for await (const chunk of res3) {
      //console.log(chunk.content);
      res.write(chunk.content);
      response = response + chunk.content;
    }
    const insertChatLog = db.prepare(
      "INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)"
    );
    insertChatLog.run(
      knowledgeId,
      question,
      response,
      userId,
      Date.now(),
      JSON.stringify([]),
      JSON.stringify(history)
    );
    insertChatLog.finalize();
  } catch (error: any) {
    console.log("chatChatGemini error", error.message);
    res.write(error.message);
  }
  res.end();
}

export async function initChatBookBaiduWenxinStream(
  res: Response,
  knowledgeId: number | string
) {
  getLLMSSettingData = await getLLMSSetting(knowledgeId);
  const BAIDU_API_KEY =
    getLLMSSettingData.OPENAI_API_KEY ?? "1AWXpm1Cd8lbxmAaFoPR0dNx";
  const BAIDU_SECRET_KEY =
    getLLMSSettingData.OPENAI_API_BASE ?? "TQy5sT9Mz4xKn0tR8h7W6LxPWIUNnXqq";
  const OPENAI_Temperature = 1;
  if (BAIDU_API_KEY && PINECONE_API_KEY && PINECONE_ENVIRONMENT) {
    process.env.BAIDU_API_KEY = BAIDU_API_KEY;
    process.env.BAIDU_SECRET_KEY = BAIDU_SECRET_KEY;
    try {
      ChatBaiduWenxinModel = new ChatBaiduWenxin({
        modelName: getLLMSSettingData.ModelName ?? "ERNIE-Bot-4", // Available models: ERNIE-Bot, ERNIE-Bot-turbo, ERNIE-Bot-4
        temperature: OPENAI_Temperature,
        baiduApiKey: process.env.BAIDU_API_KEY, // In Node.js defaults to process.env.BAIDU_API_KEY
        baiduSecretKey: process.env.BAIDU_SECRET_KEY, // In Node.js defaults to process.env.BAIDU_SECRET_KEY
      });
    } catch (error) {
      console.log("initChatBookBaiduWenxinStream ChatBaiduWenxinModel:", error);
    }
    pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
  } else {
    res.write("Not set API_KEY");
    res.end();
  }
}

export async function chatChatBaiduWenxin(
  res: Response,
  knowledgeId: number | string,
  userId: string,
  question: string,
  history: any[]
) {
  await initChatBookBaiduWenxinStream(res, knowledgeId);
  if (!ChatBaiduWenxinModel) {
    res.end();
    return;
  }
  try {
    const input2 = [new HumanMessage(question)];
    const response = await ChatBaiduWenxinModel.call(input2);
    console.log("response", response.content);
    const insertChatLog = db.prepare(
      "INSERT OR REPLACE INTO chatlog (knowledgeId, send, Received, userId, timestamp, source, history) VALUES (?,?,?,?,?,?,?)"
    );
    insertChatLog.run(
      knowledgeId,
      question,
      response.content,
      userId,
      Date.now(),
      JSON.stringify([]),
      JSON.stringify(history)
    );
    insertChatLog.finalize();

    return response.content;
  } catch (error: any) {
    console.log("chatChatOpenAI error", error.message);
    return error.message;
  }
}
