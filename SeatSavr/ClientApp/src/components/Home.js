import { Button } from 'bootstrap';
import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import AuthService from '../AuthService';
import { Link } from 'react-router-dom';


export class Home extends Component {

    constructor() {
        super();
        this.state = { bookList: [] };
        this.authService = new AuthService;
    }

    
    static displayName = Home.name;

    
    LoginButton() {
        return <button onClick={() => this.authService.login()}>Login</button>;
    }

    render() {
        
    return (
      <div>
            <h1>Welcome to SeatSavr</h1>
            <p>Managing your reservations in the modern world</p>
            <p>
                <button onClick={() => this.authService.login()}>Login for Administrators</button>
                <Link to="/select-area" type= "btn btn=primary"> Continue as Guest</Link>
                </p>
      </div>
    );
  }
}
