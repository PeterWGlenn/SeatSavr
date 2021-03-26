import React, { Component } from 'react';
import { UserSelectLayout } from './UserSelectLayout';

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div>
                <UserSelectLayout/>
            </div>
        );
    }
}
