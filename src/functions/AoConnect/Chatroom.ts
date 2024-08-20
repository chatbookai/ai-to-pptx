
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "@permaweb/aoconnect"

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, AoLoadBlueprintModule } from '../../functions/AoConnect/AoConnect'

export const AoLoadBlueprintChatroom = async (currentWalletJwk: any, processTxId: string) => {
    return await AoLoadBlueprintModule (currentWalletJwk, processTxId, 'chatroom')
}

export const GetChatroomMembers = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChatroomMembersResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Members',
        });
        console.log("GetChatroomMembers GetChatroomMembers", GetChatroomMembersResult)
        
        if(GetChatroomMembersResult && GetChatroomMembersResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChatroomMembersResult)

            return { status: 'ok', id: GetChatroomMembersResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChatroomMembersResult };
        }
    }
    catch(Error: any) {
        console.error("GetChatroomMembers Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const RegisterChatroomMember = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChatroomMembersResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({ Target = "' + chatroomTxId + '", Action = "Register" })',
        });
        console.log("GetChatroomMembers GetChatroomMembers", GetChatroomMembersResult)
        
        if(GetChatroomMembersResult && GetChatroomMembersResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, GetChatroomMembersResult)

            return { status: 'ok', id: GetChatroomMembersResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChatroomMembersResult };
        }
    }
    catch(Error: any) {
        console.error("GetChatroomMembers Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const SendMessageToChatroom = async (currentWalletJwk: any, chatroomTxId: string, myAoConnectTxId: string, Message: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const SendMessageResult = await message({
            process: myAoConnectTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Send({Target = "' + chatroomTxId + '", Action = "Broadcast", Data = "' + Message + '" })',
        });
        console.log("SendMessageToChatroom SendMessage", SendMessageResult)
        
        if(SendMessageResult && SendMessageResult.length == 43) {
            const MsgContent = await AoGetRecord(myAoConnectTxId, SendMessageResult)

            return { status: 'ok', id: SendMessageResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: SendMessageResult };
        }
    }
    catch(Error: any) {
        console.error("SendMessageToChatroom Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}
