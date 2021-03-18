import React, { Component } from 'react';
import AuthService from '../AuthService';
import { Link } from 'react-router-dom';


export class Home extends Component {
    static displayName = Home.name;

    constructor() {
        super();
        this.state = { bookList: [] };
        this.authService = new AuthService();
    }

    startSession(history) {
        this.authService.handleAuthentication(history);
        return <div><p>Starting session...</p></div>;
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
