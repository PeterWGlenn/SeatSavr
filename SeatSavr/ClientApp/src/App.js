import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { SelectArea } from './components/SelectArea';
import { FetchAdminData } from './components/FetchAdminData';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/select-area' component={SelectArea} />
        <Route path='/fetch-admin-data' component={FetchAdminData} />
      </Layout>
    );
  }
}
