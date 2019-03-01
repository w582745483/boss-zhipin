/*
用户个人中心路由组件
*/
import React, { Component } from 'react'
import { Result, List, WhiteSpace, Button, Modal } from 'antd-mobile'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'

import { resetUser } from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief
class Personal extends Component {
    handleLogout = () => {
        Modal.alert('退出', '确认退出登录吗？', [
            {
                text: '取消',
                onPress: () => console.log('cancel')
            },
            {
                text:'确认',
                onPress:()=>{
                    //清楚Cookies
                    Cookies.remove('userid')
                    //重置redux中user状态
                    this.props.resetUser()
                }
            }
        ])
    }
    render() {
        const { username, header, post, info, salary, company } = this.props.user
        return (
            <div style={{ marginTop: 50 }}>
                <Result
                    img={<img src={require(`../../assets/imgs/${header}.png`)} style={{ width: 50 }} alt="header" />}
                    title={username} message={company}
                />
                <List renderHeader={() => '相关信息'}>
                    <Item multipleLine>
                        <Brief>职位：{post}</Brief>
                        <Brief>简介：{info}</Brief>
                        {salary ? <Brief>薪资：{salary}</Brief> : null}
                    </Item>
                    <WhiteSpace />
                </List>
                <List>
                    <Button type='warning' onClick={this.handleLogout}>退出登录</Button>
                </List>
            </div>
        )
    }
}
export default connect(
    state => ({ user: state.user }),
    { resetUser }
)(Personal)