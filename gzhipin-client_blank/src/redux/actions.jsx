//包含所有action creator
import{AUTH_SUCCESS,ERROR_MSG,RECEIVE_USER,RESET_USER,RECEIVE_USER_LIST,RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ} from './action-types'
import io from 'socket.io-client'
import {reqRegister,reqLogin,reqUpdateUser,reqUser,reqUserList,reqChatMsgList,reqReadChatMsg} from '../api'

const errorMsg=msg=>({type:ERROR_MSG,data:msg})
const authSuccess=user=>({type:AUTH_SUCCESS,data:user})
const receieveUser=user=>({type:RECEIVE_USER,data:user})
const receiveUserList=(users)=>({type:RECEIVE_USER_LIST,data:users})
const receiveMsgList=(users,chatMsgs,userid)=>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})// 接收消息列表的同步action
const receiveMsg=(chatMsg,userid)=>({type:RECEIVE_MSG,data:{chatMsg,userid}})// 接收消息的同步action
const msgRead = ({from, to, count}) => ({type: MSG_READ, data: {from, to, count}})// 读取了消息的同步action

export const resetUser=msg=>({type:RESET_USER,data:msg})

export function register({username,password,password2,type}){
    if(!username||!password||!type){
        return errorMsg('用户名密码必须输入')
    }
    if(password!==password2){
        return errorMsg('密码和确认密码不同')
    }
    return async dispatch=>{
        const response=await reqRegister({username,password,type})
        const result=response.data
        if(result.code===0){
            getMsgList(dispatch,result.data._id)
            dispatch(authSuccess(result.data))
        }else{
            dispatch(errorMsg(result.msg))
        }
    }
}
export const login=({username,password})=>{
  
    if(!username||!password){
        return errorMsg('用户密码必须输入')
    }
    return async dispatch=>{
        const response=await reqLogin({username,password})
    
        const result=response.data
        if(result.code===0){
            getMsgList(dispatch,result.data._id)
            dispatch(authSuccess(result.data))
        }else{
            dispatch(errorMsg(result.msg))
        }
    }
}
export const UpdateUser=user=>{
    return async dispatch=>{
        const response=await reqUpdateUser(user)
       
        const result=response.data
        if(result.code===0){
            dispatch(receieveUser(result.data))
        }else{
            dispatch(errorMsg(result.msg))
        }

    }
}
export const getUser=()=>{
    return async dispatch=>{
        const response=await reqUser()
        const result=response.data
        if(result.code===0){
            getMsgList(dispatch,result.data._id)
            dispatch(receieveUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}
export const getUserList=(type)=>{
    return async dispatch=>{
        const response=await reqUserList(type)
        const result=response.data
        if(result.code===0){
            dispatch(receiveUserList(result.data))
        }
    }
}
/*
初始化客户端socketio
1. 连接服务器
2. 绑定用于接收服务器返回chatMsg 的监听
*/
function initIO(dispatch,userid){
    if(!io.socket){
        io.socket=io('ws://localhost:4000')
        io.socket.on('receiveMessage',(chatMsg)=>{
            if(chatMsg.from===userid||chatMsg.to===userid){
                //console.log('chatMsg',chatMsg)
                dispatch(receiveMsg(chatMsg,userid))
            }
        })
    }
}
/*
获取当前用户相关的所有聊天消息列表
(在注册/登陆/获取用户信息成功后调用)
*/
async function getMsgList(dispatch,userid){
    initIO(dispatch,userid)
    const response=await reqChatMsgList()
    const result=response.data
    if(result.code===0){
        const {chatMsgs,users}=result.data
        dispatch(receiveMsgList(users,chatMsgs,userid))
    }
}
/*
发送消息的异步action
*/
export const sendMsg=({from,to,content})=>{
    return async dispatch=>{
        io.socket.emit('sendMsg',{from,to,content})
        console.log('浏览器向服务器发送消息',{from,to,content})
    }
}
/*
更新读取消息的异步action
*/
export const readMsg=(from,to)=>{
    return async dispatch=>{
        const response=await reqReadChatMsg(from)
        const result=response.data
        if(result.code===0){
            const count=result.data
            dispatch(msgRead({from,to,count}))
        }
    }
}

