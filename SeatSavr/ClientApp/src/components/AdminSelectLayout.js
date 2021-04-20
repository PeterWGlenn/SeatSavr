import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { LayoutEditor } from './LayoutEditor';
//import { LayoutDraw } from './LayoutDraw';
import { withAuth0 } from '@auth0/auth0-react';

import './AdminSelectLayout.css';

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
            editLayoutDialogOpen: false,
            layoutCreatedOpen: false,
            redirect: "none",
            name: "No layout selected",
            address: "",
            errors: { layoutName: false, layoutAddress: false },
            errorMessages: { layoutName: '', layoutAddress: '' },

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

        if (this.state.selectedLayout == null) {
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
                            <ListItem key={layout.address} button onClick={() => { this.setState({ selectedLayout: layout }); }}>
                                <ListItemText primary={layout.name} secondary={layout.address} />
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
                                Upload Image
                        </Button>
                            <Button onClick={this.handleDrawLayout} color="primary">
                                Draw Layout
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
                </div>
            );
        }

        
        if (this.state.selectedLayout != null) {
            this.name = this.state.selectedLayout.name;
            this.address = this.state.selectedLayout.address;
            return(
                <Dialog
                    open={this.state.editLayoutDialogOpen}
                    onClose={() => {
                        this.setState({ editLayoutDialogOpen: false });
                    }}
                    aria-labelledby="editLayoutDialog">
                 <DialogTitle id="ediLayoutDialog">Edit Layout</DialogTitle>
                    <DialogContent orientation='vertical'>
                        <DialogContentText>
                            Please choose how you would like to edit your layout.
                    </DialogContentText>
                        <DialogActions>
                            <Button
                                onClick={this.handleEditRedirect}
                                color="primary">
                                Upload Photo
                        </Button>
                            <Button onClick={this.handleDrawRedirect} color="primary">
                                Draw Image
                        </Button>
                        </DialogActions>
                    </DialogContent>
                    </Dialog>
            );
            
        }

        
    }

    handleEditRedirect = () => {
        this.setState({ editLayoutDialogOpen: false });
        console.log(this.state.redirect);
        return (
            <div>
                <h2>
                    {this.name}
                    <Button onClick={() => { this.setState({ selectedLayout: null }); }}>(Change Layout)</Button>
                </h2>
                <h5>{this.address}</h5>
                <LayoutEditor selectedLayoutAddress={this.state.selectedLayout.address} />
            </div>
        );

    }

    handleDrawRedirect = () => {
        this.redirect = "draw";
        this.setState({ editLayoutDialogOpen: false });
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
}
export default withAuth0(AdminSelectLayout);
