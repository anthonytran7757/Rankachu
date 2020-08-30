import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useParams} from 'react-router-dom'
import {Button} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'
import {Navigation} from './Navigation'

export const Home = () =>
    <div>
        <h1>Pokemon Ranking</h1>
    </div>
