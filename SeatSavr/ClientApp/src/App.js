import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { LayoutEditor } from "./components/LayoutEditor";
import { AdminProfile } from "./components/AdminProfile";

import './custom.css'
import AuthService from './AuthService';
//import { useAuth0 } from '@auth0/auth0-react';



class App extends Component {
  static displayName = App.name;
    constructor() {
        super();
        this.authService = new AuthService();
        
    }
    
    render() {
        return (
            <Layout>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/layout-editor' component={LayoutEditor} />
                    <Route path='/admin-profile' component={AdminProfile} />
                </Switch>
            </Layout>
        );
    }
}
export default App;
