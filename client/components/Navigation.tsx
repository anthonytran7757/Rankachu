import * as React from "react";

import { Link } from "react-router-dom";
import { Navbar, Nav } from "rsuite";
import "rsuite/dist/styles/rsuite-default.css";

import { VoteList } from "pokemonRanking-components/VoteList";

export const Navigation = () => (
  <Navbar>
    <Navbar.Body>
      <Nav>
        <a>
          <Link to="/">
            <Nav.Item> Home </Nav.Item>
          </Link>
          <Link to="/list">
            <Nav.Item> List </Nav.Item>
          </Link>
        </a>
        <VoteList />
      </Nav>
    </Navbar.Body>
  </Navbar>
);
