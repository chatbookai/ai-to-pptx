
//Due need to use the node esm mode, so have change the package.json and move the repo to this location. Version: 0.0.53
import { connect, createDataItemSigner }  from "@permaweb/aoconnect"

import { MU_URL, CU_URL, GATEWAY_URL, AoGetRecord, AoLoadBlueprintModule } from '../../functions/AoConnect/AoConnect'

import { getNanoid } from '../../functions/ChivesWallets'
import authConfig from '../../configs/auth'
import axios from 'axios'


export const AoLoadBlueprintChivesChat = async (currentWalletJwk: any, currentAddress: string, processTxId: string) => {
    try {
        let Data = await axios.get('https://raw.githubusercontent.com/chives-network/AoWalletWebsite/main/blueprints/chiveschat.lua', { timeout: 10000 }).then(res => res.data)
        Data = Data.replace("OwnerWalletAddress", currentAddress)
    
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

            return { id: GetMyLastMsgResult, msg: MsgContent };
        }
        else {

            return { id: GetMyLastMsgResult };
        }
    }
    catch(Error: any) {
        console.error("AoLoadBlueprintChatroom Error:", Error)

        // 重新执行函数直到成功为止
        setTimeout(async () => {

            return await AoLoadBlueprintModule(currentWalletJwk, currentAddress, processTxId);
        }, 15000)
    }
}

export const GetChivesChatMembersByOwner = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatMembersByOwnerResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Members',
        });
        console.log("GetChivesChatMembersByOwner GetChivesChatMembersByOwner", GetChivesChatMembersByOwnerResult)
        
        if(GetChivesChatMembersByOwnerResult && GetChivesChatMembersByOwnerResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChivesChatMembersByOwnerResult)

            return { status: 'ok', id: GetChivesChatMembersByOwnerResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatMembersByOwnerResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatMembersByOwner Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const GetChivesChatInvites = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatInvitesResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Invites',
        });
        console.log("GetChivesChatInvites GetChivesChatInvites", GetChivesChatInvitesResult)
        
        if(GetChivesChatInvitesResult && GetChivesChatInvitesResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChivesChatInvitesResult)

            return { status: 'ok', id: GetChivesChatInvitesResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatInvitesResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatInvites Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const GetChivesChatApplicants = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatApplicantsResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Applicants',
        });
        console.log("GetChivesChatApplicants GetChivesChatApplicants", GetChivesChatApplicantsResult)
        
        if(GetChivesChatApplicantsResult && GetChivesChatApplicantsResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChivesChatApplicantsResult)

            return { status: 'ok', id: GetChivesChatApplicantsResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatApplicantsResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatApplicants Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const GetChivesChatAdmins = async (currentWalletJwk: any, processTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const GetChivesChatAdminsResult = await message({
            process: processTxId,
            tags: [ { name: 'Action', value: 'Eval' } ],
            signer: createDataItemSigner(currentWalletJwk),
            data: 'Admins',
        });
        console.log("GetChivesChatAdmins GetChivesChatAdmins", GetChivesChatAdminsResult)
        
        if(GetChivesChatAdminsResult && GetChivesChatAdminsResult.length == 43) {
            const MsgContent = await AoGetRecord(processTxId, GetChivesChatAdminsResult)

            return { status: 'ok', id: GetChivesChatAdminsResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAdminsResult };
        }
    }
    catch(Error: any) {
        console.error("GetChivesChatAdmins Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddAdmin = async (currentWalletJwk: any, chatroomTxId: string, AdminId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "AddAdmin" },
              { name: "AdminId", value: AdminId.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatAddAdmin"
        }
        const GetChivesChatAddAdminResult = await message(Data);
        console.log("ChivesChatAddAdmin GetChivesChatAddAdminResult", GetChivesChatAddAdminResult)
        
        if(GetChivesChatAddAdminResult && GetChivesChatAddAdminResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatAddAdminResult)

            return { status: 'ok', id: GetChivesChatAddAdminResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAddAdminResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddAdmin Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatDelAdmin = async (currentWalletJwk: any, chatroomTxId: string, AdminId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "DelAdmin" },
              { name: "AdminId", value: AdminId.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatDelAdmin"
        }
        const GetChivesChatDelAdminResult = await message(Data);
        console.log("ChivesChatDelAdmin GetChivesChatDelAdminResult", GetChivesChatDelAdminResult)
        
        if(GetChivesChatDelAdminResult && GetChivesChatDelAdminResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatDelAdminResult)

            return { status: 'ok', id: GetChivesChatDelAdminResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatDelAdminResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatDelAdmin Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatApplyJoin = async (currentWalletJwk: any, chatroomTxId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "ApplyJoin" },
              { name: "MemberName", value: MemberName.toString() },
              { name: "MemberReason", value: MemberReason.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatAddMember"
        }
        console.log("ChivesChatApplyJoin Data", Data)
        const GetChivesChatApplyJoinResult = await message(Data);
        console.log("ChivesChatApplyJoin GetChivesChatApplyJoinResult", GetChivesChatApplyJoinResult)
        
        if(GetChivesChatApplyJoinResult && GetChivesChatApplyJoinResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatApplyJoinResult)

            return { status: 'ok', id: GetChivesChatApplyJoinResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatApplyJoinResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatApplyJoin Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatApprovalApply = async (currentWalletJwk: any, chatroomTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const SendData = 'Send({Target = "' + chatroomTxId + '", Action = "ApprovalApply", MemberId = "' + MemberId + '", MemberName = "' + MemberName + '", MemberReason = "' + MemberReason + '" })'
        console.log("SendData", SendData)
        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "ApprovalApply" },
              { name: "MemberId", value: MemberId.toString() },
              { name: "MemberName", value: MemberName.toString() },
              { name: "MemberReason", value: MemberReason.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatApprovalApply"
        }
        console.log("ChivesChatApprovalApply Data", Data)
        const GetChivesChatApprovalApplyResult = await message(Data);
        console.log("ChivesChatApprovalApply GetChivesChatApprovalApplyResult", GetChivesChatApprovalApplyResult)
        
        if(GetChivesChatApprovalApplyResult && GetChivesChatApprovalApplyResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatApprovalApplyResult)

            return { status: 'ok', id: GetChivesChatApprovalApplyResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatApprovalApplyResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatApprovalApply Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatRefuseApply = async (currentWalletJwk: any, chatroomTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "RefuseApply" },
              { name: "MemberId", value: MemberId.toString() },
              { name: "MemberName", value: MemberName.toString() },
              { name: "MemberReason", value: MemberReason.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatRefuseApply"
        }
        console.log("ChivesChatRefuseApply Data", Data)
        const GetChivesChatRefuseApplyResult = await message(Data);
        console.log("ChivesChatRefuseApply GetChivesChatRefuseApplyResult", GetChivesChatRefuseApplyResult)
        
        if(GetChivesChatRefuseApplyResult && GetChivesChatRefuseApplyResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatRefuseApplyResult)

            return { status: 'ok', id: GetChivesChatRefuseApplyResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatRefuseApplyResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatRefuseApply Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddMember = async (currentWalletJwk: any, chatroomTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "AddMember" },
              { name: "MemberId", value: MemberId.toString() },
              { name: "MemberName", value: MemberName.toString() },
              { name: "MemberReason", value: MemberReason.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatAddMember"
        }
        console.log("ChivesChatAddMember Data", Data)
        const GetChivesChatAddMemberResult = await message(Data);
        console.log("ChivesChatAddMember GetChivesChatAddMemberResult", GetChivesChatAddMemberResult)
        
        if(GetChivesChatAddMemberResult && GetChivesChatAddMemberResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatAddMemberResult)

            return { status: 'ok', id: GetChivesChatAddMemberResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAddMemberResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddMember Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddInvite = async (currentWalletJwk: any, chatroomTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "AddInvite" },
              { name: "MemberId", value: MemberId.toString() },
              { name: "MemberName", value: MemberName.toString() },
              { name: "MemberReason", value: MemberReason.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatAddInvite"
        }
        console.log("ChivesChatAddInvite Data", Data)
        const GetChivesChatAddInviteResult = await message(Data);
        console.log("ChivesChatAddInvite GetChivesChatAddInviteResult", GetChivesChatAddInviteResult)
        
        if(GetChivesChatAddInviteResult && GetChivesChatAddInviteResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatAddInviteResult)

            return { status: 'ok', id: GetChivesChatAddInviteResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAddInviteResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddInvite Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddInvites = async (currentWalletJwk: any, chatroomTxId: string, MemberId: string, MemberName: string, MemberReason: string) => {
    try {
        console.log("ChivesChatAddInvites MemberId", MemberId)
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "AddInvites" },
              { name: "MemberId", value: MemberId.toString() },
              { name: "MemberName", value: MemberName.toString() },
              { name: "MemberReason", value: MemberReason.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatAddInvites"
        }
        console.log("ChivesChatAddInvites Data", Data)
        const GetChivesChatAddInviteResult = await message(Data);
        console.log("ChivesChatAddInvites GetChivesChatAddInviteResult", GetChivesChatAddInviteResult)
        
        if(GetChivesChatAddInviteResult && GetChivesChatAddInviteResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatAddInviteResult)

            return { status: 'ok', id: GetChivesChatAddInviteResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAddInviteResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddInvites Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAgreeInvite = async (currentWalletJwk: any, chatroomTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "AgreeInvite" },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatAgreeInvite"
        }
        console.log("ChivesChatAgreeInvite Data", Data)
        const GetChivesChatAgreeInviteResult = await message(Data);
        console.log("ChivesChatAgreeInvite GetChivesChatAgreeInviteResult", GetChivesChatAgreeInviteResult)
        
        if(GetChivesChatAgreeInviteResult && GetChivesChatAgreeInviteResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatAgreeInviteResult)

            return { status: 'ok', id: GetChivesChatAgreeInviteResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatAgreeInviteResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAgreeInvite Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatRefuseInvite = async (currentWalletJwk: any, chatroomTxId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "RefuseInvite" },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatRefuseInvite"
        }
        console.log("ChivesChatRefuseInvite Data", Data)
        const GetChivesChatRefuseInviteResult = await message(Data);
        console.log("ChivesChatRefuseInvite GetChivesChatRefuseInviteResult", GetChivesChatRefuseInviteResult)
        
        if(GetChivesChatRefuseInviteResult && GetChivesChatRefuseInviteResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatRefuseInviteResult)

            return { status: 'ok', id: GetChivesChatRefuseInviteResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatRefuseInviteResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatRefuseInvite Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatDelMember = async (currentWalletJwk: any, chatroomTxId: string, MemberId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "DelMember" },
              { name: "MemberId", value: MemberId.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatDelMember"
        }
        console.log("ChivesChatAddInvites Data", Data)
        const GetChivesChatDelMemberResult = await message(Data);

        console.log("ChivesChatDelMember GetChivesChatDelMemberResult", GetChivesChatDelMemberResult)
        
        if(GetChivesChatDelMemberResult && GetChivesChatDelMemberResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatDelMemberResult)

            return { status: 'ok', id: GetChivesChatDelMemberResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatDelMemberResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatDelMember Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatBlockMember = async (currentWalletJwk: any, chatroomTxId: string, MemberId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "BlockMember" },
              { name: "MemberId", value: MemberId.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatBlockMember"
        }
        console.log("ChivesChatAddInvites Data", Data)
        const GetChivesChatBlockMemberResult = await message(Data);

        console.log("ChivesChatBlockMember GetChivesChatBlockMemberResult", GetChivesChatBlockMemberResult)
        
        if(GetChivesChatBlockMemberResult && GetChivesChatBlockMemberResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatBlockMemberResult)

            return { status: 'ok', id: GetChivesChatBlockMemberResult, msg: MsgContent };
        }
        else {

            return { status: 'ok', id: GetChivesChatBlockMemberResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatBlockMember Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatAddChannel = async (currentWalletJwk: any, chatroomTxId: string, ChannelId: string, ChannelName: string, ChannelGroup: string, ChannelSort: string, ChannelIntro: string, ChannelWritePermission: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "AddChannel" },
              { name: "ChannelId", value: ChannelId.toString() },
              { name: "ChannelName", value: ChannelName.toString() },
              { name: "ChannelGroup", value: ChannelGroup.toString() },
              { name: "ChannelSort", value: ChannelSort.toString() },
              { name: "ChannelIntro", value: ChannelIntro.toString() },
              { name: "ChannelWritePermission", value: ChannelWritePermission.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatAddChannel"
        }
        console.log("ChivesChatAddChannel Data", Data)
        const GetChivesChatAddChannelResult = await message(Data);

        console.log("ChivesChatAddChannel GetChivesChatAddChannelResult", GetChivesChatAddChannelResult)
        
        if(GetChivesChatAddChannelResult && GetChivesChatAddChannelResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatAddChannelResult)

            return { status: 'ok', id: GetChivesChatAddChannelResult, msg: MsgContent };
        }
        else {
            
            return { status: 'ok', id: GetChivesChatAddChannelResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatAddChannel Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatEditChannel = async (currentWalletJwk: any, chatroomTxId: string, ChannelId: string, ChannelName: string, ChannelGroup: string, ChannelSort: string, ChannelIntro: string, ChannelWritePermission: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "EditChannel" },
              { name: "ChannelId", value: ChannelId.toString() },
              { name: "ChannelName", value: ChannelName.toString() },
              { name: "ChannelGroup", value: ChannelGroup.toString() },
              { name: "ChannelSort", value: ChannelSort.toString() },
              { name: "ChannelIntro", value: ChannelIntro.toString() },
              { name: "ChannelWritePermission", value: ChannelWritePermission.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatAddChannel"
        }
        console.log("GetChivesChatEditChannelResult Data", Data)
        const GetChivesChatEditChannelResult = await message(Data);
        console.log("ChivesChatEditChannel GetChivesChatEditChannelResult", GetChivesChatEditChannelResult)
        
        if(GetChivesChatEditChannelResult && GetChivesChatEditChannelResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatEditChannelResult)

            return { status: 'ok', id: GetChivesChatEditChannelResult, msg: MsgContent };
        }
        else {
            
            return { status: 'ok', id: GetChivesChatEditChannelResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatEditChannel Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatDelChannel = async (currentWalletJwk: any, chatroomTxId: string, ChannelId: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "DelChannel" },
              { name: "ChannelId", value: ChannelId.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: "ChivesChatDelChannel"
        }
        console.log("GetChivesChatDelChannelResult Data", Data)
        const GetChivesChatDelChannelResult = await message(Data);
        console.log("ChivesChatDelChannel GetChivesChatDelChannelResult", GetChivesChatDelChannelResult)
        
        if(GetChivesChatDelChannelResult && GetChivesChatDelChannelResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, GetChivesChatDelChannelResult)

            return { status: 'ok', id: GetChivesChatDelChannelResult, msg: MsgContent };
        }
        else {
            
            return { status: 'ok', id: GetChivesChatDelChannelResult };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatDelChannel Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const ChivesChatGetChannels = async (TargetTxId: string, currentAddress: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: currentAddress,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetChannels' },
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
        console.error("AoChatroomBalanceDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return {}
    }
}

export const ChivesChatGetMembers = async (TargetTxId: string, currentAddress: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: currentAddress,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetMembers' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            if(result.Messages[0].Data[0] == '[' || result.Messages[0].Data[0] == '{')  {
                return JSON.parse(result.Messages[0].Data)
            }
            else {
                return [result.Messages[0].Data, '', '']
            }
        }
        else {

            return [[], {}]
        }
    }
    catch(Error: any) {
        console.error("ChivesChatGetMembers Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return [[], {}]
    }
}

export const ChivesChatIsMember = async (TargetTxId: string, currentAddress: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: currentAddress,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'IsMember' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            if(result.Messages[0].Data[0] == '[' || result.Messages[0].Data[0] == '{')  {
                return JSON.parse(result.Messages[0].Data)
            }
            else {
                return [result.Messages[0].Data, '', '']
            }
        }
        else {

            return [[], {}]
        }
    }
    catch(Error: any) {
        console.error("ChivesChatGetMembers Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return [[], {}]
    }
}

export const ChivesChatGetApplicants = async (TargetTxId: string, currentAddress: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const result = await dryrun({
            Owner: currentAddress,
            process: TargetTxId,
            data: null,
            tags: [
                { name: 'Action', value: 'GetApplicants' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Data) {

            return result.Messages[0].Data
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoChatroomBalanceDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

export const ChivesChatGetChatRecords = async (TargetTxId: string, currentAddress: string, ChannelId: string, startIndex: string, endIndex: string) => {
    try {
        const { dryrun } = connect( { MU_URL, CU_URL, GATEWAY_URL } );
        
        const result = await dryrun({
            Owner: currentAddress,
            process: TargetTxId,
            data: "ChivesChatGetChatRecords",
            tags: [
                { name: 'Action', value: 'GetChatRecords' },
                { name: 'ChannelId', value: ChannelId },
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

            return { status: 'error', msg: 'Unknown return data parsed' };
        }
    }
    catch(Error: any) {
        console.error("ChivesChatGetChatRecords Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return { status: 'error', msg: 'Unknown' };
    }
}

export const SendMessageToChivesChat = async (currentWalletJwk: any, chatroomTxId: string, ChannelId: string, Message: string) => {
    try {
        const { message } = connect( { MU_URL, CU_URL, GATEWAY_URL } );

        const currentTimestampWithOffset: number = Date.now();
        const currentTimezoneOffset: number = new Date().getTimezoneOffset();
        const currentTimestampInZeroUTC: number = currentTimestampWithOffset + (currentTimezoneOffset * 60 * 1000);
        
        const NanoId = getNanoid(32)

        const Data = {
            process: chatroomTxId,
            tags: [
              { name: "Action", value: "SendMessage" },
              { name: "ChannelId", value: ChannelId.toString() },
              { name: "Encrypted", value: "V0" },
              { name: "NanoId", value: NanoId },
              { name: "Timestamp", value: currentTimestampInZeroUTC.toString() },
              ],
            signer: createDataItemSigner(currentWalletJwk),
            data: Message
        }
        console.log("SendMessageResult Data", Data)
        const SendMessageResult = await message(Data);
        console.log("SendMessageToChivesChat SendMessage", SendMessageResult)
        
        if(SendMessageResult && SendMessageResult.length == 43) {
            const MsgContent = await AoGetRecord(chatroomTxId, SendMessageResult)

            return { status: 'ok', id: SendMessageResult, msg: MsgContent, NanoId: NanoId };
        }
        else {
            
            return { status: 'ok', id: SendMessageResult };
        }
    }
    catch(Error: any) {
        console.error("SendMessageToChivesChat Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }
    }
  
}

export const GetChatroomAvatar = (Logo: string) => {
    if(Logo && Logo.length == 43)  {
        return authConfig.backEndApi + "/" + Logo
    }
    else {
        return '/icons/icon128.png'
    }
}


export const AoChatroomInfoDryRun = async (TargetTxId: string) => {
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
                { name: 'Action', value: 'Info' },
                { name: 'Data-Protocol', value: 'ao' },
                { name: 'Type', value: 'Message' },
                { name: 'Variant', value: 'ao.TN.1' }
            ]
        });

        if(result && result.Messages && result.Messages[0] && result.Messages[0].Tags) {
            const RS: any[] = []
            result.Messages[0].Tags.map((Item: any)=>{
                RS[Item.name] = Item.value
            })
            
            return RS
        }
        else {

            return 
        }
    }
    catch(Error: any) {
        console.error("AoChatroomInfoDryRun Error:", Error)
        if(Error && Error.message) {

            return { status: 'error', msg: Error.message };
        }

        return 
    }
}

