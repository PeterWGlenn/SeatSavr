import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import './SelectArea.css';

export class SelectArea extends Component {
    static displayName = SelectArea.name;
    static areaRadius = 12;

    constructor(props) {
        super(props);
        this.state = {
            areas: [],
            loading: true,
            selectedDate: new Date(),
            selectedArea: null,
            reserveAreaDialogOpen: false,
            reservedAreaWarningOpen: false,
            reservedAreaSuccessOpen: false
        };

        this.layoutWidth = 888;
        this.layoutHeight = 500;
    }

    handleDateChanged = (date) => {
        this.setState({ selectedDate: date });
        this.renderAreas();
    };

    componentDidMount() {
        this.renderAreas();
    }

    isAreaReserved(area) {

        var isReserved = false;

        area.reservations.forEach(r => {
            var startDate = new Date(r.date);
            var endDate = new Date(startDate);

            var millisecondsInAnHour = 1000 * 60 * 60;
            endDate.setTime(endDate.getTime() + (r.duration * millisecondsInAnHour));

            if (this.state.selectedDate >= startDate && this.state.selectedDate <= endDate) {
                isReserved = true;
            }
        });

        return isReserved;
    }

    async renderAreas() {
        await this.populateAreaData();

        var canvas = document.getElementById('layoutCanvas');
        if (canvas != null) {
            var context = canvas.getContext('2d');

            // Draw border
            context.lineWidth = 1;
            context.strokeStyle = "#000000";
            context.strokeRect(0, 0, canvas.width, canvas.height);

            // Draw areas
            this.state.areas.forEach(area => {

                var cLoc = this.convertAreaLocToCanvasLoc(area);
                var isRes = this.isAreaReserved(area);

                SelectArea.drawAreaIcon(context, cLoc.x, cLoc.y, isRes);
            });
        }
    }

    convertAreaLocToCanvasLoc(area) {
        var xLoc = (area.areaLocation.x / 100) * this.layoutWidth;
        var yLoc = (area.areaLocation.y / 100) * this.layoutHeight;

        return {x: xLoc, y: yLoc};
    }

    async populateAreaData() {
        const response = await fetch('selectarea'); 
        const data = await response.json();
        this.setState({ areas: data, loading: false });
    }

    async postCustomerData(email, firstName, lastName, dateString, areaX, areaY) {
        await fetch('selectarea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                firstName: firstName,
                lastName: lastName,
                date: dateString,
                areaLocX: areaX,
                areaLocY: areaY
            })
        });
        this.renderAreas();
    }

    static drawAreaIcon(context, x, y, isRes) {

        context.beginPath();
        context.arc(x, y, SelectArea.areaRadius, 0, 2 * Math.PI, false);

        if (isRes) {
            context.fillStyle = 'gray';
        }
        else {
            context.fillStyle = 'green';
        }

        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#000000';
        context.stroke();
    }

    canvasClick = (e) => {
        var canvasRect = document.getElementById('layoutCanvas').getBoundingClientRect();

        var x = e.clientX - canvasRect.left;
        var y = e.clientY - canvasRect.top;

        this.state.areas.forEach(area => {
            var areaLoc = this.convertAreaLocToCanvasLoc(area);
            if (this.isNumberWithin(x, areaLoc.x, SelectArea.areaRadius) && this.isNumberWithin(y, areaLoc.y, SelectArea.areaRadius)) {
                if (!this.isAreaReserved(area)) {
                    this.setState({ selectedArea: area });
                    this.openReserveDialog();
                }
                else {
                    this.openReservedAreaWarning();
                }
            }
        });
    }

    isNumberWithin(x, n, r) {
        return x > (n - r) && x < (n + r); 
    }

    /*PG -> I'm using the empty h3 to put the date picker below the canvas. There may be a cleaner way to do this.*/
    render() {
        return (
            <div>
                <h3>Please select an area to reserve...</h3>
                <canvas id="layoutCanvas"
                        width={this.layoutWidth}
                        height={this.layoutHeight}
                        className="layout-canvas"
                        onClick={this.canvasClick} />
                <h3></h3>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Reservation Date"
                        value={this.state.selectedDate}
                        onChange={this.handleDateChanged}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
                <Dialog open={this.state.reserveAreaDialogOpen} onClose={this.handleClose} aria-labelledby="reserveAreaDialog">
                    <DialogTitle id="reserveAreaDialog">Reserve Area</DialogTitle>
                    <DialogContent orientation='vertical'>
                        <DialogContentText>
                            To reserve this seat, please enter your email address and full name. 
                        </DialogContentText>
                        <TextField
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                        />
                        <TextField
                            id="firstName"
                            label="First Name"
                            fullWidth
                        />
                        <TextField
                            id="lastName"
                            label="Last Name"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleReserveDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleReserve} color="primary">
                            Reserve
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={this.state.reservedAreaWarningOpen} autoHideDuration={3000} onClose={this.handleReservedAreaWarningClose}>
                    <Alert onClose={this.handleReservedAreaWarningClose} severity="warning">
                        This area has already been reserved at this time!
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.reservedAreaSuccessOpen} autoHideDuration={6000} onClose={this.handleReservedAreaSuccessClose}>
                    <Alert onClose={this.handleReservedAreaSuccessClose} severity="success">
                        You have successfully reserved an area! Be on the lookout for a confirmation email shortly.
                    </Alert>
                </Snackbar>
            </div>
        );
    }

    openReserveDialog() {
        this.setState({ reserveAreaDialogOpen: true });
    }

    handleReserveDialogClose = () => {
        this.setState({ reserveAreaDialogOpen: false });
    }

    handleReserve = () => {
        this.setState({ reserveAreaDialogOpen: false });

        var email = document.getElementById('email').value;
        var first = document.getElementById('firstName').value;
        var last = document.getElementById('lastName').value;

        var dateStr = this.state.selectedDate.toUTCString();
        var areaLoc = this.state.selectedArea.areaLocation;

        this.postCustomerData(email, first, last, dateStr, areaLoc.x, areaLoc.y);

        this.openReservedAreaSuccess();
    }

    openReservedAreaWarning() {
        this.setState({ reservedAreaWarningOpen: true });
    }

    handleReservedAreaWarningClose = () => {
        this.setState({ reservedAreaWarningOpen: false });
    }

    openReservedAreaSuccess() {
        this.setState({ reservedAreaSuccessOpen: true });
    }

    handleReservedAreaSuccessClose = () => {
        this.setState({ reservedAreaSuccessOpen: false });
    }
}
