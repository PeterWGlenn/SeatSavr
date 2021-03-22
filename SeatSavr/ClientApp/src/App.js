import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { SelectArea } from './components/SelectArea';
import { EditorLayout } from "./components/EditorLayout";
import { Profile } from "./components/Profile";
import { TestingDeploymentFetch } from "./components/TestingDeploymentFetch";


import './custom.css'
import AuthService from './AuthService';


export default class App extends Component {
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
                 <Route path='/select-area' component={SelectArea} />
                 <Route path='/editorLayout' component={EditorLayout} />
                 <Route path='/profile' component={Profile} />
                 <Route path='/testingdeploymentfetch' component={TestingDeploymentFetch} />
             </Switch>
      </Layout>
    );
  }
}
