import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {Navigation} from './Navigation'

import {ListPage} from './ListPage'
import {Home} from './Home'


export const App = () =>{
    return(
        <Router>
            <div>
                <img alt="vanity" src="../assets/pikapng.png"/>
                <Navigation/>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/list' component={ListPage}/>
                </Switch>
            </div>
        </Router>
    )
}
