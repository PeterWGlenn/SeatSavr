import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import AuthService from '../AuthService';
import { withAuth0 } from "@auth0/auth0-react";

import { Button } from '@material-ui/core';
import "../custom.css";


class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor (props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
            adminExists: false
        };
        this.authService = new AuthService();
    }

    startSession(history) {
        this.authService.handleAuthentication(history);
        return <div><p>Starting session...</p></div>;
    }

    toggleNavbar () {
        this.setState({
          collapsed: !this.state.collapsed
        });
    }

    getCorrectNavMenuButtons() {
        const auth0 = this.props.auth0;

        return auth0.isAuthenticated ?
            <>
                <button className='button-nav' onClick={() => auth0.logout({
                    returnTo: window.location.origin,
                })}>Logout of Admin Account</button>
                <button className='button-nav' onClick={() => window.location.href = "/admin-profile"}>Profile</button>
                <button className='button-nav'onClick={() => window.location.href = "/admin-layouts"}>My Layouts</button>
                <button className='button-nav' onClick={() => window.location.href = "/draw-layout"}>Draw Layout</button>
            </> :
            <button className='button-nav' onClick={() => auth0.loginWithRedirect()}> Login to Admin Account</button>
    }

    async addNewAdminIfNeeded() {
        var auth0 = this.props.auth0;

        if (auth0.isAuthenticated && !this.state.adminExists) {
            var userEmail = auth0.user.email;

            var response = await fetch('navmenu/createadmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    email: userEmail,
                    privilege: 1
                })
            });

            if (await response.json()) {
                this.setState({ adminExists: true });
            }
        }
    }

    render() {

        this.addNewAdminIfNeeded();

        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    <Container>
                        <NavbarBrand className='button-nav' tag={Link} to="/">SeatSavr</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                            {this.getCorrectNavMenuButtons()}
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}
export default withAuth0(NavMenu);
