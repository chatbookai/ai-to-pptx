
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "@permaweb/aoconnect"

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, AoLoadBlueprintModule } from '../../functions/AoConnect/AoConnect'

export const AoLoadBlueprintMyProcessTxIds = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'myprocesstxids')
}

export const MyProcessTxIdsGetTokens = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetTokens' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return {}
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsGetTokens Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddToken = async (currentWalletJwk: any, MyProcessTxId: string, TokenId: string, TokenSort: string, TokenGroup: string, TokenData: string) => {
    try {
        console.log("MyProcessTxIdsAddToken TokenId", TokenId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "AddToken" },
              { name: "TokenId", value: TokenId },
              { name: "TokenSort", value: TokenSort ?? '100' },
              { name: "TokenGroup", value: TokenGroup },
              { name: "TokenData", value: TokenData },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetMyProcessTxIdsAddTokenResult = await message(data);

        console.log("MyProcessTxIdsAddToken GetMyProcessTxIdsAddTokenResult", GetMyProcessTxIdsAddTokenResult)
        
        if(GetMyProcessTxIdsAddTokenResult && GetMyProcessTxIdsAddTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetMyProcessTxIdsAddTokenResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddTokenResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddToken Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelToken = async (currentWalletJwk: any, MyProcessTxId: string, TokenId: string) => {
    try {
        console.log("MyProcessTxIdsDelToken TokenId", TokenId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "DelToken" },
              { name: "TokenId", value: TokenId },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetMyProcessTxIdsDelTokenResult = await message(data);
        console.log("MyProcessTxIdsDelToken GetMyProcessTxIdsDelTokenResult", GetMyProcessTxIdsDelTokenResult)
        
        if(GetMyProcessTxIdsDelTokenResult && GetMyProcessTxIdsDelTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetMyProcessTxIdsDelTokenResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelTokenResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelToken Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}


export const MyProcessTxIdsGetChatrooms = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetChatrooms' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return {}
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsGetChatrooms Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddChatroom = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, ChatroomId: string, ChatroomSort: string, ChatroomGroup: string) => {
    try {
        console.log("MyProcessTxIdsAddChatroom ChatroomId", ChatroomId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "AddChatroom", ChatroomId = "' + ChatroomId + '", ChatroomSort = "' + ChatroomSort + '", ChatroomGroup = "' + ChatroomGroup + '" })',
        }
        console.log("MyProcessTxIdsAddChatroom Data", Data)
        const GetMyProcessTxIdsAddChatroomResult = await message(Data);
        console.log("MyProcessTxIdsAddChatroom GetMyProcessTxIdsAddChatroomResult", GetMyProcessTxIdsAddChatroomResult)
        
        if(GetMyProcessTxIdsAddChatroomResult && GetMyProcessTxIdsAddChatroomResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsAddChatroomResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddChatroomResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddChatroomResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelChatroom = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, ChatroomId: string) => {
    try {
        console.log("MyProcessTxIdsDelChatroom ChatroomId", ChatroomId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelChatroom", ChatroomId = "' + ChatroomId + '" })',
        }
        console.log("MyProcessTxIdsDelChatroom Data", Data)
        const GetMyProcessTxIdsDelChatroomResult = await message(Data);
        console.log("MyProcessTxIdsDelChatroom GetMyProcessTxIdsDelChatroomResult", GetMyProcessTxIdsDelChatroomResult)
        
        if(GetMyProcessTxIdsDelChatroomResult && GetMyProcessTxIdsDelChatroomResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsDelChatroomResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelChatroomResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelChatroomResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const MyProcessTxIdsGetGuesses = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetGuesses' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return {}
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsGetGuesses Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddGuess = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, GuessId: string, GuessSort: string, GuessGroup: string) => {
    try {
        console.log("MyProcessTxIdsAddGuess GuessId", GuessId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "AddGuess", GuessId = "' + GuessId + '", GuessSort = "' + GuessSort + '", GuessGroup = "' + GuessGroup + '" })',
        }
        console.log("MyProcessTxIdsAddGuess Data", Data)
        const GetMyProcessTxIdsAddGuessResult = await message(Data);
        console.log("MyProcessTxIdsAddGuess GetMyProcessTxIdsAddGuessResult", GetMyProcessTxIdsAddGuessResult)
        
        if(GetMyProcessTxIdsAddGuessResult && GetMyProcessTxIdsAddGuessResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsAddGuessResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddGuessResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddGuessResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddGuess Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelGuess = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, GuessId: string) => {
    try {
        console.log("MyProcessTxIdsDelGuess GuessId", GuessId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelGuess", GuessId = "' + GuessId + '" })',
        }
        console.log("MyProcessTxIdsDelGuess Data", Data)
        const GetMyProcessTxIdsDelGuessResult = await message(Data);
        console.log("MyProcessTxIdsDelGuess GetMyProcessTxIdsDelGuessResult", GetMyProcessTxIdsDelGuessResult)
        
        if(GetMyProcessTxIdsDelGuessResult && GetMyProcessTxIdsDelGuessResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsDelGuessResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelGuessResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelGuessResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelGuess Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const MyProcessTxIdsGetLotteries = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetLotteries' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return {}
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsGetLotteries Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddLottery = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, LotteryId: string, LotterySort: string, LotteryGroup: string) => {
    try {
        console.log("MyProcessTxIdsAddLottery LotteryId", LotteryId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "AddLottery", LotteryId = "' + LotteryId + '", LotterySort = "' + LotterySort + '", LotteryGroup = "' + LotteryGroup + '" })',
        }
        console.log("MyProcessTxIdsAddLottery Data", Data)
        const GetMyProcessTxIdsAddLotteryResult = await message(Data);
        console.log("MyProcessTxIdsAddLottery GetMyProcessTxIdsAddLotteryResult", GetMyProcessTxIdsAddLotteryResult)
        
        if(GetMyProcessTxIdsAddLotteryResult && GetMyProcessTxIdsAddLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsAddLotteryResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddLottery Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelLottery = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, LotteryId: string) => {
    try {
        console.log("MyProcessTxIdsDelLottery LotteryId", LotteryId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelLottery", LotteryId = "' + LotteryId + '" })',
        }
        console.log("MyProcessTxIdsDelLottery Data", Data)
        const GetMyProcessTxIdsDelLotteryResult = await message(Data);
        console.log("MyProcessTxIdsDelLottery GetMyProcessTxIdsDelLotteryResult", GetMyProcessTxIdsDelLotteryResult)
        
        if(GetMyProcessTxIdsDelLotteryResult && GetMyProcessTxIdsDelLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsDelLotteryResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelLottery Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const MyProcessTxIdsGetBlogs = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetBlogs' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return {}
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsGetBlogs Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddBlog = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, BlogId: string, BlogSort: string, BlogGroup: string) => {
    try {
        console.log("MyProcessTxIdsAddBlog BlogId", BlogId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + MyProcessTxId + '", Action = "AddBlog", BlogId = "' + BlogId + '", BlogSort = "' + BlogSort + '", BlogGroup = "' + BlogGroup + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        console.log("MyProcessTxIdsAddBlog SendData", SendData)
        console.log("MyProcessTxIdsAddBlog Data", Data)
        const GetMyProcessTxIdsAddBlogResult = await message(Data);
        console.log("MyProcessTxIdsAddBlog GetMyProcessTxIdsAddBlogResult", GetMyProcessTxIdsAddBlogResult)
        
        if(GetMyProcessTxIdsAddBlogResult && GetMyProcessTxIdsAddBlogResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsAddBlogResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddBlogResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddBlogResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddBlog Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelBlog = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, BlogId: string) => {
    try {
        console.log("MyProcessTxIdsDelBlog BlogId", BlogId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelBlog", BlogId = "' + BlogId + '" })',
        }
        console.log("MyProcessTxIdsDelBlog Data", Data)
        const GetMyProcessTxIdsDelBlogResult = await message(Data);
        console.log("MyProcessTxIdsDelBlog GetMyProcessTxIdsDelBlogResult", GetMyProcessTxIdsDelBlogResult)
        
        if(GetMyProcessTxIdsDelBlogResult && GetMyProcessTxIdsDelBlogResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsDelBlogResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelBlogResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelBlogResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelBlog Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const MyProcessTxIdsGetSwaps = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetSwaps' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return {}
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsGetSwaps Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddSwap = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, SwapId: string, SwapSort: string, SwapGroup: string) => {
    try {
        console.log("MyProcessTxIdsAddSwap SwapId", SwapId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + MyProcessTxId + '", Action = "AddSwap", SwapId = "' + SwapId + '", SwapSort = "' + SwapSort + '", SwapGroup = "' + SwapGroup + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        console.log("MyProcessTxIdsAddSwap SendData", SendData)
        console.log("MyProcessTxIdsAddSwap Data", Data)
        const GetMyProcessTxIdsAddSwapResult = await message(Data);
        console.log("MyProcessTxIdsAddSwap GetMyProcessTxIdsAddSwapResult", GetMyProcessTxIdsAddSwapResult)
        
        if(GetMyProcessTxIdsAddSwapResult && GetMyProcessTxIdsAddSwapResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsAddSwapResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddSwapResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddSwapResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddSwap Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelSwap = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, SwapId: string) => {
    try {
        console.log("MyProcessTxIdsDelSwap SwapId", SwapId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelSwap", SwapId = "' + SwapId + '" })',
        }
        console.log("MyProcessTxIdsDelSwap Data", Data)
        const GetMyProcessTxIdsDelSwapResult = await message(Data);
        console.log("MyProcessTxIdsDelSwap GetMyProcessTxIdsDelSwapResult", GetMyProcessTxIdsDelSwapResult)
        
        if(GetMyProcessTxIdsDelSwapResult && GetMyProcessTxIdsDelSwapResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsDelSwapResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelSwapResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelSwapResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelSwap Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const MyProcessTxIdsGetProjects = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetProjects' },
                { name: 'Target', value: processTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return {}
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsGetProjects Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const MyProcessTxIdsAddProject = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, ProjectId: string, ProjectSort: string, ProjectGroup: string) => {
    try {
        console.log("MyProcessTxIdsAddProject ProjectId", ProjectId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + MyProcessTxId + '", Action = "AddProject", ProjectId = "' + ProjectId + '", ProjectSort = "' + ProjectSort + '", ProjectGroup = "' + ProjectGroup + '" })'
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: SendData,
        }
        console.log("MyProcessTxIdsAddProject SendData", SendData)
        console.log("MyProcessTxIdsAddProject Data", Data)
        const GetMyProcessTxIdsAddProjectResult = await message(Data);
        console.log("MyProcessTxIdsAddProject GetMyProcessTxIdsAddProjectResult", GetMyProcessTxIdsAddProjectResult)
        
        if(GetMyProcessTxIdsAddProjectResult && GetMyProcessTxIdsAddProjectResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsAddProjectResult)

            return { status: 'ok', id: GetMyProcessTxIdsAddProjectResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsAddProjectResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsAddProject Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const MyProcessTxIdsDelProject = async (currentWalletJwk: any, MyProcessTxId: string, myAoConnectTxId: string, ProjectId: string) => {
    try {
        console.log("MyProcessTxIdsDelProject ProjectId", ProjectId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + MyProcessTxId + '", Action = "DelProject", ProjectId = "' + ProjectId + '" })',
        }
        console.log("MyProcessTxIdsDelProject Data", Data)
        const GetMyProcessTxIdsDelProjectResult = await message(Data);
        console.log("MyProcessTxIdsDelProject GetMyProcessTxIdsDelProjectResult", GetMyProcessTxIdsDelProjectResult)
        
        if(GetMyProcessTxIdsDelProjectResult && GetMyProcessTxIdsDelProjectResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetMyProcessTxIdsDelProjectResult)

            return { status: 'ok', id: GetMyProcessTxIdsDelProjectResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyProcessTxIdsDelProjectResult };
        }
    }
    catch(Error: any) {
        console.error("MyProcessTxIdsDelProject Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}