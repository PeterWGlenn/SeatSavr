import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import AuthService from '../AuthService';
import { withAuth0 } from "@auth0/auth0-react";

import { Button } from '@material-ui/core';


class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor (props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
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
                <Button onClick={() => auth0.logout({
                    returnTo: window.location.origin,
                })}>Logout of Admin Account</Button>
                <Button onClick={() => window.location.href = "/admin-profile"}>Profile</Button>
                <Button onClick={() => window.location.href = "/admin-layouts"}>My Layouts</Button>
            </> :
            <Button onClick={() => auth0.loginWithRedirect()}>Login to Admin Account</Button>
    }

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                    <Container>
                    <NavbarBrand tag={Link} to="/">SeatSavr</NavbarBrand>
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
