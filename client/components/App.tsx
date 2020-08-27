import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useParams} from 'react-router-dom'
import {Button} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'

import {ListPage} from './ListPage'
import {Home} from './Home'

export const App = () =>
    <Router>
        <div>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path= '/list' component={ListPage}/>
            </Switch>
        </div>
    </Router>
