import React,{Component} from 'react'
import{NavBar,WingBlank,List,InputItem,WhiteSpace,Radio,Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import Logo from '../../components/logo/logo'
import{register} from '../../redux/actions'
class Register extends Component{

    state={
        username:'',
        password:'',
        password2:'',
        type:'dashen'
    }
    register=()=>{
       this.props.register(this.state)
    }
    toLogin=()=>{
       this.props.history.replace('/login')
    }
    handleChange=(name,val)=>{    
       this.setState({
        [name]:val
       })
    }
    render(){
        const {redirectTo,msg}=this.props 
        if(redirectTo){
            return  <Redirect to={redirectTo}/>
        }
       
        return(
            <div>
                <NavBar>Boss直聘</NavBar>
                <Logo></Logo>
                <WingBlank>
                    {msg?<p className='error-msg'>{msg}</p>:null}
                <List>
                    <InputItem placeholder="输入用户名"  onChange={val=>this.handleChange('username',val)}>用户名：</InputItem>
                    <InputItem placeholder="输入密码" type="password" onChange={val=>this.handleChange('password',val)}>密&nbsp;&nbsp;&nbsp;码</InputItem>
                    <WhiteSpace></WhiteSpace>
                    <InputItem placeholder="输入确认密码" type="password" onChange={val=>this.handleChange('password2',val)}>确认密码</InputItem>
                    <List.Item>
                        <span style={{marginRight:10}}>用户类型：</span>
                        <Radio style={{marginRight:20}} checked={this.state.type=='dashen'} onClick={()=>{this.handleChange("type","dashen")}}>求职者</Radio>
                        <Radio checked={this.state.type=='laoban'} onClick={()=>this.handleChange("type","laoban")}>Boss</Radio>
                    </List.Item>
                    <WhiteSpace></WhiteSpace>
                    <Button type='primary' onClick={this.register}>注&nbsp;&nbsp;&nbsp;册</Button>
                    <Button onClick={this.toLogin}>已经有账号</Button>
                </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state=>state.user,
    {register}
)(Register)