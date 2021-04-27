import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Button, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { LayoutEditor } from './LayoutEditor';
import { withAuth0 } from '@auth0/auth0-react';
import { AdminViewer } from './AdminViewer';

import './AdminSelectLayout.css';
import AdminLayoutStats from './AdminLayoutStats';

class AdminSelectLayout extends Component {
    static displayName = AdminSelectLayout.name;

    constructor(props) {
        super(props);
        this.state = {
            allLayouts: [],
            displayedLayouts: [],
            loading: true,
            selectedLayout: null,
            createLayoutDialogOpen: false,
            deleteLayoutDialogOpen: false,
            layoutCreatedOpen: false,
            layoutDeletedOpen: false,
            errors: { layoutName: false, layoutAddress: false },
            errorMessages: { layoutName: '', layoutAddress: '' },
            layoutOpenMode: 'NONE'
        };
    }

    componentDidMount() {
        this.populateLayoutData();
    }

    async populateLayoutData() {
        var selectedEmail = this.props.auth0.user.email;
        if (selectedEmail == null)
            return false;

        var fetchString = 'adminselectlayout/getlayouts/?email=' + selectedEmail;
        const response = await fetch(fetchString, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const layouts = await response.json();
        this.setState({ allLayouts: layouts, displayedLayouts: layouts, loading: false });
    }

    getListTitleHTML() {
        return (
            <div>
                <h1>Your Layouts</h1>
            </div>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    {this.getListTitleHTML()}
                    <h3>Loading layouts...</h3>
                </div>
            );
        }

        if (this.state.selectedLayout == null || this.state.deleteLayoutDialogOpen) {
            return (
                <div>
                    {this.getListTitleHTML()}
                    <Button className="layout-buttons" onClick={() => { this.setState({ createLayoutDialogOpen: true }); }}>Create Layout</Button>
                    <TextField
                        id='layoutListFilter'
                        label="Search Layouts"
                        variant="outlined"
                        fullWidth
                        onChange={() => {
                            var newLayouts = [];
                            var filter = document.getElementById('layoutListFilter').value.toLowerCase();

                            this.state.allLayouts.forEach((layout) => {
                                if (layout.address.toLowerCase().includes(filter) || layout.name.toLowerCase().includes(filter)) {
                                    newLayouts.push(layout);
                                }
                            });
                            this.setState({ displayedLayouts: newLayouts });
                        }} />
                    <List id='layoutList'>
                        {this.state.displayedLayouts.map(layout =>
                            <ListItem key={layout.address} button onClick={() => { this.setState({ layoutSelectedDialogOpen: true, selectedLayout: layout }); }}>
                                <ListItemText primary={layout.name} secondary={layout.address} />
                                <ListItemSecondaryAction>
                                    <Button onClick={() => this.setState({ layoutOpenMode: 'STATS', selectedLayout: layout })}>Stats</Button>
                                    <Button onClick={() => this.setState({ layoutOpenMode: 'EDIT', selectedLayout: layout })}>Edit</Button>
                                    <Button onClick={() => this.setState({ deleteLayoutDialogOpen: true, selectedLayout: layout })}>Delete</Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )}
                    </List>
                    <Dialog
                        open={this.state.createLayoutDialogOpen}
                        onClose={() => {
                            this.setState({ createLayoutDialogOpen: false });
                        }}
                        aria-labelledby="createLayoutDialog">
                        <DialogTitle id="createLayoutDialog">Create Layout</DialogTitle>
                        <DialogContent orientation='vertical'>
                            <DialogContentText>
                                Please enter the new layout's name and the address where the layout's building is located.
                            </DialogContentText>
                            <TextField
                                id="name"
                                label="Name"
                                fullWidth
                                error={this.state.errors.layoutName}
                                helperText={this.state.errorMessages.layoutName}
                                onChange={() => {
                                    var newErrors = this.state.errors
                                    var newErrorMessages = this.state.errorMessages;
                                    newErrors.layoutName = false;
                                    newErrorMessages.layoutName = '';
                                    this.setState({ errors: newErrors, errorMessages: newErrorMessages });
                                }}
                            />
                            <TextField
                                id="address"
                                label="Address"
                                fullWidth
                                error={this.state.errors.layoutAddress}
                                helperText={this.state.errorMessages.layoutAddress}
                                onChange={() => {
                                    var newErrors = this.state.errors
                                    var newErrorMessages = this.state.errorMessages;
                                    newErrors.layoutAddress = false;
                                    newErrorMessages.layoutAddress = '';
                                    this.setState({ errors: newErrors, errorMessages: newErrorMessages });
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    this.setState({ createLayoutDialogOpen: false });
                                }}
                                color="primary">
                                Cancel
                        </Button>
                            <Button onClick={this.handleCreateLayout} color="primary">
                                Create Layout
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={this.state.deleteLayoutDialogOpen}
                        onClose={() => {
                            this.setState({ deleteLayoutDialogOpen: false, selectedLayout: null  });
                        }}
                        aria-labelledby="deleteLayoutDialog">
                        <DialogTitle id="deleteLayoutDialog">Delete Layout</DialogTitle>
                        <DialogContent orientation='vertical'>
                            <DialogContentText>
                                Are you sure you want to delete this layout? All layout data will be deleted. This cannot be undone!
                            </DialogContentText>
                            
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    this.setState({ deleteLayoutDialogOpen: false, selectedLayout: null  });
                                }}
                                color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleDeleteLayout} color="primary">
                                Delete Layout
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
                        open={this.state.layoutCreatedOpen}
                        autoHideDuration={3000}
                        onClose={() => {
                            this.setState({ layoutCreatedOpen: false });
                        }}>
                        <Alert severity="success">
                            Layout successfully created!
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={this.state.layoutDeletedOpen}
                        autoHideDuration={3000}
                        onClose={() => {
                            this.setState({ layoutDeletedOpen: false });
                        }}>
                        <Alert severity="success">
                            Layout successfully deleted!
                        </Alert>
                    </Snackbar>
                </div>
            );
        }

        var name = "No layout selected";
        var address = "";
        if (this.state.selectedLayout != null) {
            name = this.state.selectedLayout.name;
            address = this.state.selectedLayout.address;
        }

        var layoutComponentType = <AdminViewer selectedLayout={this.state.selectedLayout} />
        if (this.state.layoutOpenMode === 'EDIT') {
            layoutComponentType = <LayoutEditor selectedLayoutAddress={this.state.selectedLayout.address} />
        } else if (this.state.layoutOpenMode === 'STATS') {
            layoutComponentType = <AdminLayoutStats selectedLayout={this.state.selectedLayout} />
        } 

        return (
            <div>
                <h2>
                    {name}
                    <Button onClick={() => { this.setState({ selectedLayout: null, displayedLayouts: this.state.allLayouts, layoutOpenMode: 'NONE' }); }}>(Change Layout)</Button>
                </h2>
                <h5>{address}</h5>
                {layoutComponentType}
            </div>
        );
    }

    handleDrawLayout = () => {
        var nameElem = document.getElementById('name');
        var addressElem = document.getElementById('address');

        var name = nameElem.value;
        var address = addressElem.value;

        var nHasError = name == null || name === "";
        var aHasError = address == null || address === "";

        // Do not post or close form if errors exist!
        if (nHasError || aHasError) {
            this.setState({
                errors: { layoutName: nHasError, layoutAddress: aHasError },
                errorMessages: {
                    layoutName: nHasError ? 'Layout name is a required field.' : '',
                    layoutAddress: aHasError ? 'Layout address is a required field.' : ''
                }
            });
            return;
        }

        this.postLayoutData(name, address);
        this.setState({ createLayoutDialogOpen: false });
    }

    handleCreateLayout = () => {
        this.handleCreateLayoutAsync();
    }

    async handleCreateLayoutAsync() {
        var nameElem = document.getElementById('name');
        var addressElem = document.getElementById('address');

        var name = nameElem.value;
        var address = addressElem.value;

        var nErrorMessage = '';
        if (name == null || name === "") {
            nErrorMessage = 'Layout name is a required field.';
        }

        var aErrorMessage = '';
        if (address == null || address === "") {
            aErrorMessage = 'Layout address is a required field.';
        }
        else if (address.includes("'")) {
            aErrorMessage = 'Layout address cannot contain \''
        }

        // Validate against ALL layouts
        const response = await fetch('userselectlayout/getlayouts', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const getAllLayoutsForValidation = await response.json();
        getAllLayoutsForValidation.forEach((l) => {
            if (l.address === address) {
                aErrorMessage = 'This layout address already exists!';
            }
            if (l.name === name) {
                nErrorMessage = 'This layout name is already taken!';
            }
        });

        var nHasError = nErrorMessage.length > 0;
        var aHasError = aErrorMessage.length > 0;

        // Do not post or close form if errors exist!
        if (nHasError || aHasError) {
            this.setState({
                errors: { layoutName: nHasError, layoutAddress: aHasError },
                errorMessages: {
                    layoutName: nHasError ? nErrorMessage : '',
                    layoutAddress: aHasError ? aErrorMessage : ''
                }
            });
            return;
        }

        this.postLayoutData(name, address);
        this.setState({ createLayoutDialogOpen: false });
    }

    handleDeleteLayout = () => {
        var saveSelectedLayout = this.state.selectedLayout;
        this.setState({ deleteLayoutDialogOpen: false, selectedLayout: null }, () => { this.postDeleteLayout(saveSelectedLayout) });
    }

    async postLayoutData(name, address) {
        var selectedEmail = this.props.auth0.user.email;

        var response = await fetch('adminselectlayout/createlayout?email=' + selectedEmail, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                name: name,
                address: address
            })
        });

        if (await response.json()) {
            this.setState({ layoutCreatedOpen: true });
        }

        this.populateLayoutData();
    }

    async postDeleteLayout(layout) {
        var response = await fetch('adminselectlayout/deletelayout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                name: layout.name,
                address: layout.address
            })
        });

        if (await response.json()) {
            this.setState({ layoutDeletedOpen: true });
        }

        this.populateLayoutData();
    }
}
export default withAuth0(AdminSelectLayout);
