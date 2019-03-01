/*
对话消息列表组件
*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief
/*
得到所有聊天的最后msg 组成的数组
[msg1, msg2, msg3..]
// 1. 使用{}进行分组(chat_id), 只保存每个组最后一条msg: {chat_id1: lastMsg1, chat_id2:
lastMsg2}
// 2. 得到所有分组的lastMsg 组成数组: Object.values(lastMsgsObj) [lastMsg1, lastMsg2]
// 3. 对数组排序(create_time, 降序)
*/
function getLastMsgs(chatMsgs, userid) {
    // 1. 使用{}进行分组(chat_id), 只保存每个组最后一条msg: {chat_id1: lastMsg1,chat_id2: lastMsg2}
    const lastMsgObj = {}
    chatMsgs.map(msg => {
        msg.unReadCount = 0

        const chatId = msg.chat_id
        const lastMsg = lastMsgObj[chatId]
        if (!lastMsg) {
            lastMsgObj[chatId] = msg
            if (!msg.read && userid == msg.to) {
                msg.unReadCount = 1
            }
        } else if (lastMsg.create_time < msg.create_time) {
            lastMsgObj[chatId] = msg
            msg.unReadCount = lastMsg.unReadCount
            if (!msg.read && userid === msg.to) {
                msg.unReadCount++
            }
        }
    })
    const lastMsgs = Object.values(lastMsgObj)
    lastMsgs.sort(function (a, b) {
        return b.create_time - a.create_time
    })
    return lastMsgs
}

class Message extends Component {
 

    render() {
        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        const lastMsgs = getLastMsgs(chatMsgs, user._id)
       
        return (
            <div style={{ marginTop: 50, marginBottom: 50 }}>
                <List>
                    {
                        lastMsgs.map(msg => {
                            const TargetId = msg.from===user._id?msg.to:msg.from
                            const Targetuser=users[TargetId]
                            const headerImg=Targetuser.header?require(`../../assets/imgs/${Targetuser.header}.png`):null
                            return(
                                <Item
                                    thumb={headerImg}
                                    arrow='horizontal'
                                    extra={<Badge text={msg.unReadCount} />}
                                    onClick={()=>this.props.history.push(`/chat/${TargetId}`)}
                                    >
                                    <Brief>{Targetuser.username}</Brief>
                                    {msg.content}
                                 </Item>
                            )  
                        })
                    }


                </List>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user, chat: state.chat }),
)(Message)