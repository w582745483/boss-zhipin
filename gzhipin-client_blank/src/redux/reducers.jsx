import { combineReducers } from 'redux'

import { AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST,RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ } from './action-types'
import { getRedirectPath } from '../utils'
import { stat } from 'fs';

const initUser = {
    username: '',
    header: ''
}
const initUserList = []
const initChat={
    chatMsgs:[],// 消息数组[{from: id1, to: id2}{}]
    users:{},// 所有用户的集合对象{id1: user1, id2: user2}
    unReadCount:0// 未读消息的数量
}
function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS://认证成功
            const redirectTo = getRedirectPath(action.data.type, action.data.header)
            return { ...action.data, redirectTo}
        case ERROR_MSG:
            return { ...state, msg: action.data }
        case RECEIVE_USER:
            return action.data//接受用户
        case RESET_USER://重置用户
            return { ...initUser, msg: action.data }
        default:
            return state
    }
}
function userList(state = initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}
// 管理聊天相关信息数据的reducer
function chat(state=initChat,action){
    switch(action.type){
        case RECEIVE_MSG:// chatMsg
        const {chatMsg,userid}=action.data
            return {
                users:state.users,
                chatMsgs:[...state.chatMsgs,chatMsg],
                unReadCount:state.unReadCount+(!chatMsg.read&&chatMsg.to===userid?1:0)
            }
        case RECEIVE_MSG_LIST: //{users,chatMsg}
        const {users,chatMsgs}=action.data
            return {
                users,
                chatMsgs,
                unReadCount:state.unReadCount+chatMsgs.reduce((preTotal,msg)=>preTotal+(!msg.unReadCount&&msg.to===action.data.userid),0)
            }
        case MSG_READ:
        const {from,to,count}=action.data
            return{
                users:state.users,
                chatMsgs:state.chatMsgs.map(msg=>{
                    if(msg.from===from&&msg.to===to&&!msg.read){
                        return {...msg,read:true}
                    }else{
                        return msg
                    }
                }),
                unReadCount:state.unReadCount-count
            }
            
        default:
            return state
    }
}
export default combineReducers({
    user,
    userList,
    chat
})