import * as React from 'react';

import {BrowserRouter as Router, Switch, Route, Link, useParams, Redirect} from 'react-router-dom'
import {Navbar, Nav} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css'

export const Navigation = () =>
    <Navbar>
        <Navbar.Body>
            <Nav>
                <a>
                    <Link to='/'>
                        <Nav.Item> Home </Nav.Item>
                    </Link>
                    <Link to='/list'>
                        <Nav.Item> List </Nav.Item>
                    </Link>
                </a>
            </Nav>
        </Navbar.Body>
    </Navbar>
