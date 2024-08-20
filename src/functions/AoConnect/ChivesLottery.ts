
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "@permaweb/aoconnect"

import axios from 'axios'

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, BalanceTimes10 } from '../../functions/AoConnect/AoConnect'
import { AoTokenTransfer } from '../../functions/AoConnect/Token'


export const AoLoadBlueprintLottery = async (currentWalletJwk: any, processTxId: string, LotteryInfo: any) => {
    try {
        if(processTxId && processTxId.length != 43) {

            return
        }
        if(typeof processTxId != 'string') {

            return 
        }

        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoWalletWebsite/main/blueprints/chiveslottery.lua', { timeout: 10000 }).then(res => res.data)
        
        //Filter Lottery Infor
        if(LotteryInfo && LotteryInfo.Name) {
            Data = Data.replace("AoConnectLottery", LotteryInfo.Name)
        }
        if(LotteryInfo && LotteryInfo.Logo) {
            Data = Data.replace("dFJzkXIQf0JNmJIcHB-aOYaDNuKymIveD2K60jUnTfQ", LotteryInfo.Logo)
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
        console.error("AoLoadBlueprintLottery Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
}

export const AoLotteryCheckBalance = async (currentWalletJwk: any, LotteryTxId: string, myAoConnectTxId: string) => {
    try {
        if(LotteryTxId && LotteryTxId.length != 43) {

            return
        }
        if(myAoConnectTxId && myAoConnectTxId.length != 43) {

            return
        }
        if(typeof LotteryTxId != 'string' || typeof myAoConnectTxId != 'string') {

            return 
        }
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendLotteryResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + LotteryTxId + '", Action = "CheckBalance", Tags = { Target = ao.id } })',
        });
        console.log("AoLotteryCheckBalance Balance", SendLotteryResult)
        
        if(SendLotteryResult && SendLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, SendLotteryResult)
            console.log("AoLotteryCheckBalance MsgContent", MsgContent)

            return { status: 'ok', id: SendLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("AoLotteryBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const AoLotteryUpdateBalance = async (currentWalletJwk: any, LotteryTxId: string, myAoConnectTxId: string) => {
    try {
        if(LotteryTxId && LotteryTxId.length != 43) {

            return
        }
        if(myAoConnectTxId && myAoConnectTxId.length != 43) {

            return
        }
        if(typeof LotteryTxId != 'string' || typeof myAoConnectTxId != 'string') {

            return 
        }
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendLotteryResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + LotteryTxId + '", Action = "UpdateBalance", Tags = { Target = ao.id } })',
        });
        console.log("AoLotteryUpdateBalance Balance", SendLotteryResult)
        
        if(SendLotteryResult && SendLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, SendLotteryResult)
            console.log("AoLotteryUpdateBalance MsgContent", MsgContent)

            return { status: 'ok', id: SendLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("AoLotteryBalance Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const AoLotteryCredit = async (currentWalletJwk: any, LotteryTxId: string, myLotteryProcessTxId: string, sendOutProcessTxId: string, sendOutAmount: number, Denomination = 12) => {
    try {
        if(LotteryTxId && LotteryTxId.length != 43) {

            return
        }
        if(myLotteryProcessTxId && myLotteryProcessTxId.length != 43) {

            return
        }
        if(sendOutProcessTxId && sendOutProcessTxId.length != 43) {

            return
        }
        if(typeof LotteryTxId != 'string' || typeof myLotteryProcessTxId != 'string' || typeof sendOutProcessTxId != 'string') {

            return 
        }
        
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendLotteryResult = await message({
            process: myLotteryProcessTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + LotteryTxId + '", Action = "Credit", Recipient = "' + sendOutProcessTxId + '", Quantity = "' + BalanceTimes10(sendOutAmount, Denomination) + '"})',
        });
        console.log("AoLotteryCredit Credit", SendLotteryResult)
        
        if(SendLotteryResult && SendLotteryResult.length == 43) {
            const MsgContent = await AoGetRecord(myLotteryProcessTxId, SendLotteryResult)

            return { status: 'ok', id: SendLotteryResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendLotteryResult };
        }
    }
    catch(Error: any) {
        console.error("AoLotteryCredit Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const AoLotteryDeposit = async (currentWalletJwk: any, LotteryTxId: string, myLotteryProcessTxId: string, sendOutProcessTxId: string, sendOutAmount: number) => {

    return await AoTokenTransfer(currentWalletJwk, LotteryTxId, sendOutProcessTxId, sendOutAmount)
}

