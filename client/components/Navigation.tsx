import * as React from 'react';

import {BrowserRouter as Router, Switch, Route, Link, useParams, Redirect} from 'react-router-dom'
import {Navbar, Nav} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'

export const Navigation = () =>
    <Navbar>
        <Navbar.Body>
            <Nav>
                <Nav.Item><Link to='/'> Home </Link></Nav.Item>
                <Nav.Item><Link to='/list'> List </Link></Nav.Item>
            </Nav>
        </Navbar.Body>
    </Navbar>
