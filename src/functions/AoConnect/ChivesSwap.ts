
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "@permaweb/aoconnect"

import axios from 'axios'

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, BalanceTimes10 } from './AoConnect'

export const AoLoadBlueprintSwap = async (currentWalletJwk: any, processTxId: string, SwapInfo: any) => {
    try {
        if(processTxId && processTxId.length != 43) {

            return
        }
        if(typeof processTxId != 'string') {

            return 
        }

        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoWalletWebsite/main/blueprints/chivesswap.lua', { timeout: 10000 }).then(res => res.data)
        
        //Filter Swap Infor
        if(SwapInfo && SwapInfo.Name) {
            Data = Data.replace("AoConnectSwap", SwapInfo.Name)
        }
        if(SwapInfo && SwapInfo.Logo) {
            Data = Data.replace("dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ", SwapInfo.Logo)
        }

        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetMyLastMsgResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: Data,
        });
        
        console.log("AoLoadBlueprintModule GetMyLastMsg", module, GetMyLastMsgResult)
        
        if(GetMyLastMsgResult && GetMyLastMsgResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetMyLastMsgResult)
            console.log("AoLoadBlueprintModule MsgContent", module, MsgContent)

            return { status: 'ok', id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintSwap Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const ChivesSwapInfo = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result: any = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Info' },
                { name: 'Target', value: TargetTxId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Tags) {
            const Tags: any[] = result.Messages[0].Tags
            const TagsMap: any = {}
            Tags && Tags.map((Tag: any)=>{
                TagsMap[Tag.name] = Tag.value
            })

            return TagsMap
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("ChivesSwapInfo Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesSwapBalance = async (TargetTxId: string, currentAddress: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result: any = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Balance' },
                { name: 'Target', value: currentAddress },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("ChivesSwapBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesSwapBalances = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result: any = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Balances' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("ChivesSwapBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesSwapTotalSupply = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result: any = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Total-Supply' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("ChivesSwapTotalSupply Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesSwapGetOrder = async (TargetTxId: string, OrderId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result: any = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetOrder' },
                { name: 'OrderId', value: OrderId },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("ChivesSwapTotalSupply Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesSwapDebitNotice = async (TargetTxId: string, Recipient: string, Quantity: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result: any = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Debit-Notice' },
                { name: 'Target', value: TargetTxId },
                { name: 'Recipient', value: Recipient },
                { name: 'Quantity', value: Quantity },
                { name: 'Timestamp', value: String(Date.now()) },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return JSON.parse(result.Messages[0].Data)
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("ChivesSwapTotalSupply Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesSwapAddLiquidity = async (currentWalletJwk: any, TargetTxId: string, MinLiquidity: string) => {
    try {
        const currentTimestampWithOffset: number = Date.now();
        const currentTimezoneOffset: number = new Date().getTimezoneOffset();
        const currentTimestampInZeroUTC: number = currentTimestampWithOffset + (currentTimezoneOffset * 60 * 1000);

        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: TargetTxId,
            tags: [
              { name: "Action", value: "AddLiquidity" },
              { name: "MinLiquidity", value: MinLiquidity.toString() },
              { name: "Timestamp", value: currentTimestampInZeroUTC.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ''
        }
        const GetChivesLiquidityResult = await message(data)

        console.log("ChivesLiquidity Data", data)
        console.log("ChivesLiquidity GetChivesLiquidityResult", GetChivesLiquidityResult)
        
        if(GetChivesLiquidityResult && GetChivesLiquidityResult.length == 43) {
            const MsgContent = await AoGetRecord(TargetTxId, GetChivesLiquidityResult)
            console.log("ChivesLiquidity MsgContent", MsgContent)

            return { status: 'ok', id: GetChivesLiquidityResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesLiquidityResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesLiquidity Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesSwapSendTokenToSwap = async (currentWalletJwk: any, tokenTxId: string, sendOutAddress: string, sendOutAmount: number, Denomination = 12, MinAmountOut: string) => {
    try {
        if(tokenTxId && tokenTxId.length != 43) {

            return
        }
        if(sendOutAddress && sendOutAddress.length != 43) {

            return
        }
        if(typeof tokenTxId != 'string' || typeof sendOutAddress != 'string') {

            return 
        }
        
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const data = {
            process: tokenTxId,
            tags: [
                { name: "Action", value: "Transfer" },
                { name: "Recipient", value: sendOutAddress },
                { name: "X-Chives-For", value: 'Swap' },
                { name: "X-Chives-MinAmountOut", value: String(MinAmountOut) },
                { name: "Quantity", value: String(BalanceTimes10(sendOutAmount, Denomination)) },
                ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const SendTokenResult = await message(data);

        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(tokenTxId, SendTokenResult)

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("AoTokenTransfer Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
    
}

export const ChivesSwapRemoveLiquidity = async (currentWalletJwk: any, TargetTxId: string, Quantity: string, MinX: string, MinY: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const data = {
            process: TargetTxId,
            tags: [
                { name: 'Action', value: 'RemoveLiquidity' },
                { name: 'Quantity', value: Quantity },
                { name: 'MinX', value: MinX },
                { name: 'MinY', value: MinY }
                ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const SendTokenResult = await message(data);

        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(TargetTxId, SendTokenResult)

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesSwapRemoveLiquidity Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}