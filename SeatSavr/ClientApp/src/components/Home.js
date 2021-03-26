import React, { Component } from 'react';
import { UserSelectLayout } from './UserSelectLayout';

export class Home extends Component {
    static displayName = Home.name;

    constructor() {
        super();
    }

    render() {
        
    return (
        <div>
            <UserSelectLayout/>
        </div>
    );
  }
}
