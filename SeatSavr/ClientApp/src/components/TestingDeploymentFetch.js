import React, { Component } from 'react';

export class TestingDeploymentFetch extends Component {
    static displayName = TestingDeploymentFetch.name;

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true
        };
    }

    componentDidMount() {
        this.populateData();
    }

    async populateData() {
        const response = await fetch('testdeploymentfetch', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const dataObj = await response.json();
        this.setState({ data: dataObj, loading: false });
    }

    render() {
        return (
            <div>
                <h3>Testing this!</h3>
                <h1>{ this.state.data }</h1>
            </div>
        );
    }
}
