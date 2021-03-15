import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import AuthService from '../AuthService';


export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
      };
      this.authService = new AuthService();
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
    }

    LogoutButton() {
        return <button onClick={() => this.authService.logout()}>Logout</button>;
    }

    LoginButton() {
        return <button onClick={() => this.authService.login()}>Login</button>;
    }

  
    startSession(history) {
        this.authService.handleAuthentication(history);
        return <div><p>Starting session...</p></div>;
    }

    render() {
        
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">SeatSavr</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/select-area">Select Area </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/fetch-admin-data">Fetch Admin Data</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} className="text-dark" to="/editorLayout">Edit Layout</NavLink>
                            </NavItem>
                            <div>
                                    <button onClick={() => this.authService.login()}>Login</button>
                                    <button onClick={() => this.authService.logout()}>Logout</button>
                            </div>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
