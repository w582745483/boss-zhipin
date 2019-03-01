import React,{Component} from 'react'
import {NavBar, InputItem,TextareaItem,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import HeaderSelector from '../../components/header-selector/header-selector'
import {UpdateUser} from '../../redux/actions'
class LaobanInfo extends Component{
    state={
        post:'',
        company:'',
        salary:'',
        header:'',
        info:''
    }
    setHeader=(header)=>{
        this.setState({
            header
        })
    }
    handleChange=(name,val)=>{
        this.setState({
            [name]:val
        })
    }
    save=()=>{
        this.props.UpdateUser(this.state)
    }
    render(){
        const user=this.props
        if(user.header){
            return <Redirect to='laoban'/>
        }
        return(
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <InputItem onChange={val=>this.handleChange('post',val)}>招聘职位：</InputItem>
                <InputItem onChange={val=>this.handleChange('company',val)}>公司名称：</InputItem>
                <InputItem onChange={val=>this.handleChange('salary',val)}>职位薪资：</InputItem>
                <TextareaItem title="职位要求" placeholder="请输入职位描述" row={3} onChange={val=>this.handleChange('info',val)}></TextareaItem>
                <Button type="primary" onClick={this.save} >保存</Button>
            </div>
        )
    }
}
export default connect(
    state=>state.user,
    {UpdateUser}
)(LaobanInfo)