
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "@permaweb/aoconnect"

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord } from '../../functions/AoConnect/AoConnect'

import axios from 'axios'
import { jwkToAddress } from '../../functions/ChivesWallets'

export const AoLoadBlueprintChivesServerData = async (currentWalletJwk: any, processTxId: string) => {
    try {
        if(processTxId && processTxId.length != 43) {

            return
        }
        if(typeof processTxId != 'string') {

            return 
        }

        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoWalletWebsite/main/blueprints/chivesserverdata.lua', { timeout: 10000 }).then(res => res.data)
        
        const address = await jwkToAddress(currentWalletJwk)
        if(address && address.length == 43) {
            Data = Data.replaceAll("AoConnectOwner", address)
        }

        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetMyLastMsgResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: Data,
        });
        console.log("AoLoadBlueprintChivesServerData GetMyLastMsg", module, GetMyLastMsgResult)
        
        if(GetMyLastMsgResult && GetMyLastMsgResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetMyLastMsgResult)
            console.log("AoLoadBlueprintChivesServerData MsgContent", module, MsgContent)

            return { status: 'ok', id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const ChivesServerDataGetTokens = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetTokens Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddToken = async (currentWalletJwk: any, MyProcessTxId: string, TokenId: string, TokenSort: string, TokenGroup: string, TokenData: string) => {
    try {
        console.log("ChivesServerDataAddToken TokenId", TokenId)
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
        const GetChivesServerDataAddTokenResult = await message(data);
        console.log("ChivesServerDataAddToken GetChivesServerDataAddTokenResult", GetChivesServerDataAddTokenResult)
        
        if(GetChivesServerDataAddTokenResult && GetChivesServerDataAddTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataAddTokenResult)

            return { status: 'ok', id: GetChivesServerDataAddTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddTokenResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddToken Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelToken = async (currentWalletJwk: any, MyProcessTxId: string, TokenId: string) => {
    try {
        console.log("ChivesServerDataDelToken TokenId", TokenId)
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
        const GetChivesServerDataDelTokenResult = await message(data);
        console.log("ChivesServerDataDelToken GetChivesServerDataDelTokenResult", GetChivesServerDataDelTokenResult)
        
        if(GetChivesServerDataDelTokenResult && GetChivesServerDataDelTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataDelTokenResult)

            return { status: 'ok', id: GetChivesServerDataDelTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelTokenResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelToken Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetFaucets = async (TargetTxId: string, processTxId: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: processTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetFaucets' },
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
        console.error("ChivesServerDataGetFaucets Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddFaucet = async (currentWalletJwk: any, MyProcessTxId: string, FaucetId: string, FaucetSort: string, FaucetGroup: string, FaucetData: string) => {
    try {
        console.log("ChivesServerDataAddFaucet FaucetId", FaucetId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "AddFaucet" },
              { name: "FaucetId", value: FaucetId },
              { name: "FaucetSort", value: FaucetSort ?? '100' },
              { name: "FaucetGroup", value: FaucetGroup },
              { name: "FaucetData", value: FaucetData },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataAddFaucetResult = await message(data);
        console.log("ChivesServerDataAddFaucet GetChivesServerDataAddFaucetResult", GetChivesServerDataAddFaucetResult)
        
        if(GetChivesServerDataAddFaucetResult && GetChivesServerDataAddFaucetResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataAddFaucetResult)

            return { status: 'ok', id: GetChivesServerDataAddFaucetResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddFaucetResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddFaucet Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelFaucet = async (currentWalletJwk: any, MyProcessTxId: string, FaucetId: string) => {
    try {
        console.log("ChivesServerDataDelFaucet FaucetId", FaucetId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "DelFaucet" },
              { name: "FaucetId", value: FaucetId },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataDelFaucetResult = await message(data);
        console.log("ChivesServerDataDelFaucet GetChivesServerDataDelFaucetResult", GetChivesServerDataDelFaucetResult)
        
        if(GetChivesServerDataDelFaucetResult && GetChivesServerDataDelFaucetResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataDelFaucetResult)

            return { status: 'ok', id: GetChivesServerDataDelFaucetResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelFaucetResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelFaucet Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetBlogs = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetBlogs Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddBlog = async (currentWalletJwk: any, MyProcessTxId: string, BlogId: string, BlogSort: string, BlogGroup: string, BlogData: string) => {
    try {
        console.log("ChivesServerDataAddBlog BlogId", BlogId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "AddBlog" },
              { name: "BlogId", value: BlogId },
              { name: "BlogSort", value: BlogSort ?? '100' },
              { name: "BlogGroup", value: BlogGroup },
              { name: "BlogData", value: BlogData },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataAddBlogResult = await message(data);
        console.log("ChivesServerDataAddBlog GetChivesServerDataAddBlogResult", GetChivesServerDataAddBlogResult)
        
        if(GetChivesServerDataAddBlogResult && GetChivesServerDataAddBlogResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataAddBlogResult)

            return { status: 'ok', id: GetChivesServerDataAddBlogResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddBlogResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddBlog Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelBlog = async (currentWalletJwk: any, MyProcessTxId: string, BlogId: string) => {
    try {
        console.log("ChivesServerDataDelBlog BlogId", BlogId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "DelBlog" },
              { name: "BlogId", value: BlogId },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataDelBlogResult = await message(data);
        console.log("ChivesServerDataDelBlog GetChivesServerDataDelBlogResult", GetChivesServerDataDelBlogResult)
        
        if(GetChivesServerDataDelBlogResult && GetChivesServerDataDelBlogResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataDelBlogResult)

            return { status: 'ok', id: GetChivesServerDataDelBlogResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelBlogResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelBlog Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetSwaps = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetSwaps Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddSwap = async (currentWalletJwk: any, MyProcessTxId: string, SwapId: string, SwapSort: string, SwapGroup: string, SwapData: string) => {
    try {
        console.log("ChivesServerDataAddSwap SwapId", SwapId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "AddSwap" },
              { name: "SwapId", value: SwapId },
              { name: "SwapSort", value: SwapSort ?? '100' },
              { name: "SwapGroup", value: SwapGroup },
              { name: "SwapData", value: SwapData },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataAddSwapResult = await message(data);
        console.log("ChivesServerDataAddSwap GetChivesServerDataAddSwapResult", GetChivesServerDataAddSwapResult)
        
        if(GetChivesServerDataAddSwapResult && GetChivesServerDataAddSwapResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataAddSwapResult)

            return { status: 'ok', id: GetChivesServerDataAddSwapResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddSwapResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddSwap Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelSwap = async (currentWalletJwk: any, MyProcessTxId: string, SwapId: string) => {
    try {
        console.log("ChivesServerDataDelSwap SwapId", SwapId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "DelSwap" },
              { name: "SwapId", value: SwapId },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataDelSwapResult = await message(data);
        console.log("ChivesServerDataDelSwap GetChivesServerDataDelSwapResult", GetChivesServerDataDelSwapResult)
        
        if(GetChivesServerDataDelSwapResult && GetChivesServerDataDelSwapResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataDelSwapResult)

            return { status: 'ok', id: GetChivesServerDataDelSwapResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelSwapResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelSwap Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetLotteries = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetLotteries Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddLottery = async (currentWalletJwk: any, MyProcessTxId: string, LotteryId: string, Lotteriesort: string, LotteryGroup: string, LotteryData: string) => {
    try {
        console.log("ChivesServerDataAddLottery LotteryId", LotteryId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "AddLottery" },
              { name: "LotteryId", value: LotteryId },
              { name: "Lotteriesort", value: Lotteriesort ?? '100' },
              { name: "LotteryGroup", value: LotteryGroup },
              { name: "LotteryData", value: LotteryData },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataAddLotteryResult = await message(data);
        console.log("ChivesServerDataAddLottery GetChivesServerDataAddLotteryResult", GetChivesServerDataAddLotteryResult)
        
        if(GetChivesServerDataAddLotteryResult && GetChivesServerDataAddLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataAddLotteryResult)

            return { status: 'ok', id: GetChivesServerDataAddLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddLottery Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelLottery = async (currentWalletJwk: any, MyProcessTxId: string, LotteryId: string) => {
    try {
        console.log("ChivesServerDataDelLottery LotteryId", LotteryId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "DelLottery" },
              { name: "LotteryId", value: LotteryId },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataDelLotteryResult = await message(data);
        console.log("ChivesServerDataDelLottery GetChivesServerDataDelLotteryResult", GetChivesServerDataDelLotteryResult)
        
        if(GetChivesServerDataDelLotteryResult && GetChivesServerDataDelLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataDelLotteryResult)

            return { status: 'ok', id: GetChivesServerDataDelLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelLottery Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}




export const ChivesServerDataGetGuesses = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetGuesses Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddGuess = async (currentWalletJwk: any, MyProcessTxId: string, GuessId: string, Guessesort: string, GuessGroup: string, GuessData: string) => {
    try {
        console.log("ChivesServerDataAddGuess GuessId", GuessId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "AddGuess" },
              { name: "GuessId", value: GuessId },
              { name: "Guessesort", value: Guessesort ?? '100' },
              { name: "GuessGroup", value: GuessGroup },
              { name: "GuessData", value: GuessData },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataAddGuessResult = await message(data);
        console.log("ChivesServerDataAddGuess GetChivesServerDataAddGuessResult", GetChivesServerDataAddGuessResult)
        
        if(GetChivesServerDataAddGuessResult && GetChivesServerDataAddGuessResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataAddGuessResult)

            return { status: 'ok', id: GetChivesServerDataAddGuessResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddGuessResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddGuess Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelGuess = async (currentWalletJwk: any, MyProcessTxId: string, GuessId: string) => {
    try {
        console.log("ChivesServerDataDelGuess GuessId", GuessId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "DelGuess" },
              { name: "GuessId", value: GuessId },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataDelGuessResult = await message(data);
        console.log("ChivesServerDataDelGuess GetChivesServerDataDelGuessResult", GetChivesServerDataDelGuessResult)
        
        if(GetChivesServerDataDelGuessResult && GetChivesServerDataDelGuessResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataDelGuessResult)

            return { status: 'ok', id: GetChivesServerDataDelGuessResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelGuessResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelGuess Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}



export const ChivesServerDataGetChatrooms = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetChatrooms Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddChatroom = async (currentWalletJwk: any, MyProcessTxId: string, ChatroomId: string, ChatroomSort: string, ChatroomGroup: string, ChatroomData: string) => {
    try {
        console.log("ChivesServerDataAddChatroom ChatroomId", ChatroomId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "AddChatroom" },
              { name: "ChatroomId", value: ChatroomId },
              { name: "ChatroomSort", value: ChatroomSort ?? '100' },
              { name: "ChatroomGroup", value: ChatroomGroup },
              { name: "ChatroomData", value: ChatroomData },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataAddChatroomResult = await message(data);
        console.log("ChivesServerDataAddChatroom GetChivesServerDataAddChatroomResult", GetChivesServerDataAddChatroomResult)
        
        if(GetChivesServerDataAddChatroomResult && GetChivesServerDataAddChatroomResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataAddChatroomResult)

            return { status: 'ok', id: GetChivesServerDataAddChatroomResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddChatroomResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelChatroom = async (currentWalletJwk: any, MyProcessTxId: string, ChatroomId: string) => {
    try {
        console.log("ChivesServerDataDelChatroom ChatroomId", ChatroomId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "DelChatroom" },
              { name: "ChatroomId", value: ChatroomId },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataDelChatroomResult = await message(data);
        console.log("ChivesServerDataDelChatroom GetChivesServerDataDelChatroomResult", GetChivesServerDataDelChatroomResult)
        
        if(GetChivesServerDataDelChatroomResult && GetChivesServerDataDelChatroomResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataDelChatroomResult)

            return { status: 'ok', id: GetChivesServerDataDelChatroomResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelChatroomResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}




export const ChivesServerDataGetProjects = async (TargetTxId: string, processTxId: string) => {
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
        console.error("ChivesServerDataGetProjects Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesServerDataAddProject = async (currentWalletJwk: any, MyProcessTxId: string, ProjectId: string, ProjectSort: string, ProjectGroup: string, ProjectData: string) => {
    try {
        console.log("ChivesServerDataAddProject ProjectId", ProjectId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "AddProject" },
              { name: "ProjectId", value: ProjectId },
              { name: "ProjectSort", value: ProjectSort ?? '100' },
              { name: "ProjectGroup", value: ProjectGroup },
              { name: "ProjectData", value: ProjectData },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataAddProjectResult = await message(data);
        console.log("ChivesServerDataAddProject GetChivesServerDataAddProjectResult", GetChivesServerDataAddProjectResult)
        
        if(GetChivesServerDataAddProjectResult && GetChivesServerDataAddProjectResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataAddProjectResult)

            return { status: 'ok', id: GetChivesServerDataAddProjectResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataAddProjectResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataAddProject Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesServerDataDelProject = async (currentWalletJwk: any, MyProcessTxId: string, ProjectId: string) => {
    try {
        console.log("ChivesServerDataDelProject ProjectId", ProjectId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: MyProcessTxId,
            tags: [
              { name: "Action", value: "DelProject" },
              { name: "ProjectId", value: ProjectId },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const GetChivesServerDataDelProjectResult = await message(data);
        console.log("ChivesServerDataDelProject GetChivesServerDataDelProjectResult", GetChivesServerDataDelProjectResult)
        
        if(GetChivesServerDataDelProjectResult && GetChivesServerDataDelProjectResult.length == 43) {
            const MsgContent = await AoGetRecord(MyProcessTxId, GetChivesServerDataDelProjectResult)

            return { status: 'ok', id: GetChivesServerDataDelProjectResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesServerDataDelProjectResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesServerDataDelProject Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

