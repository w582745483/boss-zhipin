import React from 'react'
import { connect } from 'react-redux'
import { NavBar, List, InputItem, Grid, Icon } from 'antd-mobile'


import { sendMsg,readMsg } from '../../redux/actions'
const Item = List.Item
class Chat extends React.Component {
    state = {
        content: '', //是否显示表情列表
        isShow: false,
        selectionStart  :0
        //聊天内容
    }
    componentWillMount() {
        this.emojis = ['😊', '😊', '😊', '😊', '😊', '😊', '❤', '😊', '😊', '😊', '😊', '😊', '😊', '😊',
            '😊', '😊', '😊', '😊', '😊', '😊', '❤', '😊', '😊', '😊', '😊', '😊', '😊', '😊',
            '😊', '😊', '😊', '😊', '😊', '😊', '❤', '😊', '😊', '😊', '😊', '😊', '😊', '😊']
        this.emojis = this.emojis.map(value => ({ text: value }))
        //console.log( this.emojis)
    }

    handleSend = () => {
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content
        this.props.sendMsg({ from, to, content })
        this.setState({
            content: '',
        })
        console.log('content',this.state.content)
    }
    handleChange = (content) => {

        this.setState({ content })
    }
    toggleShow=()=>{

        this.setState({
            isShow:!this.state.isShow
        })
        if(!this.state.isShow){
            // 异步手动派发resize 事件,解决表情列表显示的bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
                }, 0)
        }
    }
    setEmojis=(item)=>{
       const {content,selectionStart}=this.state
        {this.setState({
           // content:this.state.content+item.text,
            content:content.substring(0,selectionStart)+item.text+content.substring(selectionStart,content.length),
            isShow:false
        })}
    }
    handleClick=(e)=>{
        this.setState({
            selectionStart:e.target.selectionStart
        })
       // console.log(456,e.target.selectionStart )
    }
    componentDidMount(){
        window.scrollTo(0,document.body.scrollHeight)
    }
    componentDidUpdate(){
        window.scrollTo(0,document.body.scrollHeight)
    }
    componentWillUnmount(){
        const from=this.props.match.params.userid
        const to=this.props.user._id
       this.props.readMsg(from,to)

    }
    render() {
        

        const { user } = this.props
        const { users, chatMsgs } = this.props.chat
        const meId = user._id
        const targetId = this.props.match.params.userid
        if (!users[targetId]) {
            return null
        }

        const chat_id = [meId, targetId].sort().join('_')

        const msgs = chatMsgs.filter(msg => msg.chat_id === chat_id)

        const targetIcon = users[targetId] ? require(`../../assets/imgs/${users[targetId].header}.png`) : null
        return (
            <div id='chat-page'>
                <NavBar icon={<Icon type='left' onClick={()=>this.props.history.goBack()}/>} className='sticky-header'>{users[targetId].username}</NavBar>
                <List style={{marginBottom:50,marginTop:50}}>
                    {
                        msgs.map(msg => {
                            if (targetId === msg.from) {
                                return (<Item thumb={targetIcon}>{msg.content}</Item>)
                            } else {
                                return (<Item className='chat-me' extra='我'>{msg.content}</Item>)
                            }
                        })
                    }
                </List>
                <div className='am-tab-bar'>
                    <InputItem placeholder='请输入'  onClick={this.handleClick} ref={selectionStart =>this.selectionStart =selectionStart } onFocus={()=>this.setState({isShow:false})} value={this.state.content} onChange={(text) => this.handleChange(text)}
                        extra={
                            <span>
                                <span onClick={this.toggleShow}>😊</span>&nbsp;
                                <span onClick={this.handleSend}>发送</span>
                            </span>

                        }
                    />
                    {
                        this.state.isShow ? (
                            <Grid data={this.emojis} columnNum={8} carouselMaxRow={4} isCarousel={true} onClick={(item)=>this.setEmojis(item)}/>) : null
                    }
                </div>




            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user, chat: state.chat }),
    { sendMsg,readMsg }
)(Chat)