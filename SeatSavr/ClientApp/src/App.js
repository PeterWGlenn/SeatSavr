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
        //this.authService = new AuthService();
    }


    
    render() {
        //this.authService.login();
        //let logoutButton = this.createLogoutButton();

     return (
         <Layout>
             <Switch>
                 
                 <Route exact path='/' component={Home} />
                 <Route path='/select-area' component={SelectArea} />
                 <Route path='/fetch-admin-data' component={FetchAdminData} />
             </Switch>
      </Layout>
    );
  }
}
