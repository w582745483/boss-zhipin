import React, { Component } from 'react'
import { NavBar, WingBlank, List, InputItem, WhiteSpace, Button } from 'antd-mobile'
import Logo from '../../components/logo/logo'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {login} from '../../redux/actions'
class Login extends Component {

    state={
        username:'',
        password:''
    }

    hangleChange=(name,val)=>{
        this.setState({
            [name]:val
        })
    }
    toRegister=()=>{
        this.props.history.replace('/register')
    }
    login=()=>{
        this.props.login(this.state)
        //console.log(JSON.stringify(this.state))
    }
    render() {
        const{redirectTo,msg}=this.props

        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>Boss直聘</NavBar>
                <Logo></Logo>
                <WingBlank>
                {msg ? <p className='error-msg'>{msg}</p> : null}
                    <List>
                    <InputItem  placeholder="输入用户名" onChange={val=>{this.hangleChange('username',val)}}>用户名：</InputItem>
                    <InputItem  type="password"placeholder="输入密码" onChange={val=>{this.hangleChange('password',val)}}>密&nbsp;&nbsp;&nbsp;码</InputItem>
                    <WhiteSpace/>
                    <Button type="primary" onClick={this.login}>登&nbsp;&nbsp;&nbsp;陆</Button>
                    <WhiteSpace/>
                    <Button onClick={this.toRegister}>还没有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state=>state.user,
    {login}
)(Login)