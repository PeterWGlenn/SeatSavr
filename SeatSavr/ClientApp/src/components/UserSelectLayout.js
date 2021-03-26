import React, { Component } from 'react';
import { SelectArea } from './SelectArea';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export class UserSelectLayout extends Component {
    static displayName = UserSelectLayout.name;

    constructor(props) {
        super(props);
        this.state = {
            availableLayouts: [],
            loading: true,
            selectedLayout: null
        };
    }

    componentDidMount() {
        this.populateLayoutData();
    }

    async populateLayoutData() {
        const response = await fetch('userselectlayout/getlayouts', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const layouts = await response.json();
        this.setState({ availableLayouts: layouts, loading: false });
    }

    render() {
        if (this.state.loading) {
            return (<h3>Loading layouts...</h3>);
        }

        if (this.state.selectedLayout == null) {
            return (
                <div>
                <h3>Please select a layout:</h3>
                    <List id='layoutList'>
                        {this.state.availableLayouts.map(layout =>
                            <ListItem key={layout.address} button onClick={() => { this.setState({ selectedLayout: layout }); }}>
                                <ListItemText primary={layout.name} secondary={layout.address} />
                            </ListItem>
                        )}
                    </List>
                </div>
            );
        }

        return (
            <div>
                <SelectArea selectedLayoutAddress={this.state.selectedLayout.address}/>
            </div>
        );
    }
}
