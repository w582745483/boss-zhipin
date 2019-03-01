/*
选择头像的组件
*/
import React,{Component} from 'react'
import {List,Grid} from 'antd-mobile'
import PropTypes from 'prop-types'
export default class HeaderSelector extends Component{
    static propsTypes={
        setHeader:PropTypes.func.isRequired
    }
    state={
        icon:null
    }
    constructor(props){
        super(props)
        this.headerList=[]
        for(var i=0;i<20;i++){
            const text=`头像${i+1}`
            this.headerList.push({text,icon:require(`../../assets/imgs/${text}.png`)})
        }
    }
    selectHeader=({text,icon})=>{
       //更新当前组件
        this.setState({
            icon
        })
        //更新父组件
        this.props.setHeader(text)

    }
    render(){
      
        const {icon}=this.state
        
        const gridHeader=icon?<p>已选择头像：<img src={icon} alt="header"></img></p>:'请选择头像'
        return(
            <List renderHeader={()=>gridHeader}>
                <Grid hasLine={false} data={this.headerList} columnNum={5} onClick={this.selectHeader}/>   
            </List>
        )
    }

}