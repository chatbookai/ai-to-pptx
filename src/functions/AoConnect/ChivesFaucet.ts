
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "@permaweb/aoconnect"

import axios from 'axios'

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord } from '../../functions/AoConnect/AoConnect'
import { AoTokenTransfer, AoTokenInfoDryRun } from '../../functions/AoConnect/Token'


export const AoLoadBlueprintFaucet = async (currentWalletJwk: any, processTxId: string, TokenIdInFaucet: string, FAUCET_SEND_AMOUNT: string, FAUCET_SEND_RULE: string) => {
    try {
        if(processTxId && processTxId.length != 43) {

            return
        }
        if(typeof processTxId != 'string') {

            return 
        }

        const TokenGetMap: any = await AoTokenInfoDryRun(TokenIdInFaucet)
        if(TokenGetMap && Number(TokenGetMap.Denomination) >= 0 && TokenGetMap.Name != "" && TokenGetMap.Ticker != "") {
            
        }
        else {

            return  //Not a token
        }

        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoWalletWebsite/main/blueprints/chivesfaucet.lua', { timeout: 20000 }).then(res => res.data)

        if(Data == undefined) {
            console.log("AoLoadBlueprintModule chivesfaucet.lua", module)

            return
        }

        console.log("AoLoadBlueprintModule TokenGetMap", TokenGetMap)
        

        //Filter Faucet Infor
        if(TokenGetMap && TokenGetMap.Name) {
            Data = Data.replace("AoConnectFaucet", TokenGetMap.Name)
        }
        if(TokenGetMap && TokenGetMap.Logo) {
            Data = Data.replace("dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ", TokenGetMap.Logo)
        }
        if(TokenGetMap && TokenGetMap.Denomination) {
            Data = Data.replace("12", TokenGetMap.Denomination)
        }
        if(TokenIdInFaucet) {
            Data = Data.replace("Yot4NNkLcwWly8OfEQ81LCZuN4i4xysZTKJYuuZvM1Q", TokenIdInFaucet)
        }
        if(Number(FAUCET_SEND_AMOUNT) > 0) {
            Data = Data.replace("168", String(FAUCET_SEND_AMOUNT))
        }
        if(FAUCET_SEND_RULE == "EveryDay" || FAUCET_SEND_RULE == "OneTime") {
            Data = Data.replace("EveryDay", FAUCET_SEND_RULE)
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

            return { status: 'ok', id: GetMyLastMsgResult, msg: MsgContent, Token: TokenGetMap };
        }
        else {

            return { status: 'ok', id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintFaucet Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const AoFaucetGetFaucet = async (currentWalletJwk: any, FaucetTxId: string) => {
    try {
        if(FaucetTxId && FaucetTxId.length != 43) {

            return
        }
        if(typeof FaucetTxId != 'string') {

            return 
        }
        
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const data = {
            process: FaucetTxId,
            tags: [
              { name: "Action", value: "GetFaucet" },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: ""
        }
        const SendTokenResult = await message(data);
        console.log("AoFaucetGetFaucet SendTokenResult:", SendTokenResult)

        if(SendTokenResult && SendTokenResult.length == 43) {
            const MsgContent = await AoGetRecord(FaucetTxId, SendTokenResult)

            return { status: 'ok', id: SendTokenResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendTokenResult };
        }

    }
    catch(Error: any) {
        console.error("AoFaucetGetFaucet Error:", Error)
    }

}

export const AoFaucetDepositToken = async (currentWalletJwk: any, FAUCET_TOKEN_ID: string, FaucetTxIdAsReceivedAddress: string, DepositAmount: number, Denomination: number) => {
    
    return await AoTokenTransfer(currentWalletJwk, FAUCET_TOKEN_ID, FaucetTxIdAsReceivedAddress, DepositAmount, Denomination)
}

export const AoFaucetDepositBalances = async (TargetTxId: string, startIndex: string, endIndex: string) => {
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
                { name: 'Action', value: 'depositBalances' },
                { name: 'Target', value: TargetTxId },
                { name: 'startIndex', value: startIndex },
                { name: 'endIndex', value: endIndex },
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
        console.error("AoFaucetDepositBalances Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoFaucetCreditBalances = async (TargetTxId: string, startIndex: string, endIndex: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        if(typeof TargetTxId != 'string') {

            return 
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'creditBalances' },
                { name: 'Target', value: TargetTxId },
                { name: 'startIndex', value: startIndex },
                { name: 'endIndex', value: endIndex },
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
        console.error("AoFaucetCreditBalances Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoFaucetGetFaucetBalance = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'CheckFaucetBalance' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[1] && result.Messages[1].Data) {

            return result.Messages[1].Data
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoFaucetGetFaucetBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const AoFaucetInfo = async (TargetTxId: string) => {
    try {
        if(TargetTxId && TargetTxId.length != 43) {

            return
        }
        
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: TargetTxId,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'Info' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        console.log("result", result)

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
        console.error("AoFaucetGetFaucetBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}


