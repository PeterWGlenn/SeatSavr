import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import AdminSelectLayout from "./components/AdminSelectLayout";
import AdminProfile from "./components/AdminProfile";
import LayoutDraw from "./components/LayoutDraw";
import { CancelReservation } from './components/CancelReservation';

import './custom.css';

import { withAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from './components/protected-route';
import Loading from './components/loading';

class App extends React.Component {
            
    render() {
        const { isLoading } = this.props.auth0;
        if (isLoading) {
            return <Loading />;
        }
        return (
            <Layout className="custom-app-styling">
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/cancel-reservation' component={CancelReservation} />
                    <ProtectedRoute path='/admin-layouts' component={AdminSelectLayout} />
                    <ProtectedRoute path='/admin-profile' component={AdminProfile} />
                    <ProtectedRoute path='/draw-layout' component={LayoutDraw} />
                </Switch>
            </Layout>
        );
    }
}
export default withAuth0(App);
