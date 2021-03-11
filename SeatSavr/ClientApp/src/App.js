import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { SelectArea } from './components/SelectArea';
import { FetchAdminData } from './components/FetchAdminData';

import './custom.css'
import AuthService from './AuthService';

export default class App extends Component {
  static displayName = App.name;
    constructor() {
        super();
        this.authService = new AuthService();
    }

    createLogoutButton() {
        let button = null;
        if (this.authService.isAuthenticated()) {
            button = <button onClick={() => this.authService.logout()}>Logout</button>;
        }
        return button;
    }
    renderHome() {
        let resultComponent = <Home auth={this.authService} />;

        if (!this.authService.isAuthenticated()) {
            this.authService.login();
            resultComponent = <div><p>Redirecting to the authentication service...</p></div>
        }
        return resultComponent;
    }

    startSession(history) {
        this.authService.handleAuthentication(history);
        return <div><p>Starting session...</p></div>;
    }
    render() {
        //this.authService.login();
        let logoutButton = this.createLogoutButton();

     return (
         <Layout>
             <header className="App-header">
                 {logoutButton}
                 <h1 className="App-title">SeatSavr</h1>
             </header>
             <Switch>
                 <Route exact path='/' component={Home} />
                 <Route path='/select-area' component={SelectArea} />
                 <Route path='/fetch-admin-data' component={FetchAdminData} />
             </Switch>
      </Layout>
    );
  }
}
