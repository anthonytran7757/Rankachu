import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useParams} from 'react-router-dom'
import {Button} from 'rsuite';
import {Navigation} from './Navigation'
import 'rsuite/dist/styles/rsuite-default.css'

import {ListPage} from './ListPage'
import {Home} from './Home'

export const App = () =>{
    return(
        <Router>
            <div>
                <img src="../assets/pikapng.png"/>
                <Navigation/>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/list' render={() => <ListPage/>}/>
                </Switch>
            </div>
        </Router>
    )
}







