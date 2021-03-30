import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { LayoutEditor } from "./components/LayoutEditor";
import { AdminProfile } from "./components/AdminProfile";
import { AdminSelectLayout } from "./components/AdminSelectLayout";

import './custom.css'
import AuthService from './AuthService';
import {  withAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from './components/protected-route';
import { NavBar } from "./components/NavBar"




class App extends Component {
  static displayName = App.name;
    constructor() {
        super();
        this.authService = new AuthService();
        
    }
    
    render() {
        const { isLoading } = this.props.auth0;
        return (
            <Layout>
                <NavBar />
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/admin-layouts' component={AdminSelectLayout} />
                    <ProtectedRoute path='/admin-profile' component={AdminProfile} />
                </Switch>
            </Layout>
        );
    }
}
export default withAuth0( App);
