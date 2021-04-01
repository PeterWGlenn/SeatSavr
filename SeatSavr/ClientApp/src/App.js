import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { AdminSelectLayout } from "./components/AdminSelectLayout";
import AdminProfile from "./components/AdminProfile";

import './custom.css';

import { withAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from './components/protected-route';
import { NavBar } from "./components/NavBar";
import Loading from './components/loading';

class App extends React.Component {
            
    render() {
        const { isLoading } = this.props.auth0;
        if (isLoading) {
            return <Loading />;
        }
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
export default withAuth0(App);
