import React from 'react'
import ReactDOM from 'react-dom'
import {Button} from 'antd-mobile'
import {HashRouter,Switch,Route,BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'

import Login from './containers/login/login'
import Register from './containers/register/register'
import Main from './containers/main/main'
import store from './redux/store'
import HeaderSelector from './components/header-selector/header-selector'
import LaobanInfo from './containers/laoban-info/laoban-info'
import DashenInfo from './containers/dashen-info/dashen-info'
import './assets/css/index.less'
//import './test/socketio_test'
ReactDOM.render(
(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login}></Route>
                <Route path='/register' component={Register}></Route>
                <Route path='/header' component={HeaderSelector}></Route>
                {/* <Route path='/laoban' component={LaobanInfo}></Route>
                <Route path='/dashen' component={DashenInfo}></Route> */}
                <Route component={Main}></Route>
            </Switch>
        </HashRouter>
    </Provider>
   
)
,document.getElementById('root'));

