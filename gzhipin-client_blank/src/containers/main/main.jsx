import React, { Component } from 'react'
import Cookies from 'js-cookie'
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { NavBar } from 'antd-mobile'

import DashenInfo from '../dashen-info/dashen-info'
import LaobanInfo from '../laoban-info/laoban-info'
import { getUser } from '../../redux/actions'
import Laoban from '../laoban/laoban'
import Dashen from '../dashen/dashen'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import {getRedirectPath} from '../../utils'
import Chat from '../chat/chat'


class Main extends Component {
    navList = [
        {
            path: '/laoban',
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神'
        },
        {
            path: '/dashen',
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal', // 路由路径
            component: Personal,
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ]
    componentDidMount() {
        //cookies 中有userid
        // redux 中的user 是空对象
        const userid = Cookies.get('userid')
        const { user } = this.props
        if (userid && !user._id) {
            this.props.getUser()
        }
    }
    render() {
        console.log('chat',this.props.chat)
        const pathname = this.props.location.pathname
        const userid = Cookies.get('userid')
        if (!userid) {//没有值，自动跳转到登录页面
            return <Redirect to='/login' />
        }
        const { user } = this.props
        if (!user._id) {

            return null
        } else {
            //根据请求路径，自动跳转到对应的用户主界面
            if (pathname === '/') {
                const path = getRedirectPath(user.type, user.header)
                return <Redirect to={path} />
            }
        }
        if (user.type === 'laoban') {
            this.navList[1].hide = true
        } else {
            this.navList[0].hide = true
        }
        //得到当前的nav
        const currentNav = this.navList.find(nav => nav.path === pathname)
        return (
            <div>
                {currentNav ? <NavBar className='stick-top'>{currentNav.title}</NavBar> : null}
                <Switch>
                    <Route path='/laobaninfo' component={LaobanInfo}></Route>
                    <Route path='/dasheninfo' component={DashenInfo}></Route>
                    <Route path='/dashen' component={Dashen}></Route>
                    <Route path='/laoban' component={Laoban}></Route>
                    <Route path='/message' component={Message}></Route>
                    <Route path='/personal' component={Personal}></Route>
                    <Route path='/chat/:userid' component={Chat}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
                {currentNav?<NavFooter unReadCount={this.props.chat.unReadCount} navList={this.navList}/>:null}
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user,chat:state.chat }),
    { getUser }
)(Main)