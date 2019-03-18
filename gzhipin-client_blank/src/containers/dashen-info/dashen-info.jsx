import React ,{ Component } from "react";
import {NavBar, InputItem,TextareaItem,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import HeaderSlector from '../../components/header-selector/header-selector'
import {UpdateUser} from '../../redux/actions'
class DashenInfo extends Component{
    state={
        header:'',//头像
        info:'',//个人简介
        post:''//求职岗位
    }
    setHeader=(header)=>{
        this.setState({
            header
        })
    }
    save=()=>{
       
        this.props.UpdateUser(this.state)
        console.log()
    }
    handleChange=(name,val)=>{
        this.setState({
            [name]:val
        })
    }
    render(){
        const user=this.props
        if(user.header){
            return <Redirect to='dashen'/>
        }
        return(
            <div>
                <NavBar>求职者信息完善</NavBar>
                <HeaderSlector setHeader={this.setHeader}/>
                <InputItem onChange={val=>this.handleChange('post',val)}>求职岗位：</InputItem>
                <TextareaItem title="个人介绍" rows={3} onChange={val=>this.handleChange('info',val)}></TextareaItem>
                <Button type='primary' onClick={this.save}>保存</Button>
            </div>
        )
    }
}
export default connect(
    state=>state.user,
    {UpdateUser}
)(DashenInfo)