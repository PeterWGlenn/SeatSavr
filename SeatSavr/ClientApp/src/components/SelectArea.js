import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import './SelectArea.css';
import '../custom.css';

export class SelectArea extends Component {
    static displayName = SelectArea.name;
    static areaRadius = 16;
    static defaultDuration = 1.0;
    static layoutWidth = 888;
    static layoutHeight = 500;

    constructor(props) {
        super(props);
        this.state = {
            layout: null,
            loading: true,
            selectedDate: new Date(),
            selectedTime: new Date(),
            selectedArea: null,
            selectedDuration: SelectArea.defaultDuration,
            reserveAreaDialogOpen: false,
            reservedAreaWarningOpen: false,
            reservedAreaSuccessOpen: false,
            errors: { email: false, first: false, last: false },
            errorMessages: { email: '', first: '', last: '' }
        };
    }

    componentDidMount() {
        this.renderAreas();
    }

    isAreaReserved(area) {

        var isReserved = false;

        area.reservations.forEach(r => {

            var millisecondsInAnHour = 1000 * 60 * 60;

            var startDate = new Date(r.date + "Z");
            var endDate = new Date(startDate);
            endDate.setTime(endDate.getTime() + (r.duration * millisecondsInAnHour));

            var selectedTime = this.state.selectedTime;
            var selectedStartDate = this.state.selectedDate;

            // Set selected date time to selected time
            selectedStartDate.setHours(selectedTime.getHours());
            selectedStartDate.setMinutes(selectedTime.getMinutes());
            selectedStartDate.setSeconds(0.0);
            selectedStartDate.setMilliseconds(0.0);

            var selectedEndDate = new Date(selectedStartDate);
            selectedEndDate.setTime(selectedEndDate.getTime() + (this.state.selectedDuration * millisecondsInAnHour));

            if (selectedStartDate <= endDate && selectedEndDate >= startDate) {
                isReserved = true;
            }
        });

        return isReserved;
    }

    async renderAreas() {
        if (!(await this.populateAreaData()))
            return;

        var canvas = document.getElementById('layoutCanvas');
        if (canvas != null) {
            var context = canvas.getContext('2d');

            var areas = this.state.layout.areas;
            var saveThisObject = this;

            var image = new Image();
            image.onload = function () {

                // Draw Background Image
                context.drawImage(image, 0, 0, SelectArea.layoutWidth, SelectArea.layoutHeight);

                // Draw border
                context.lineWidth = 1;
                context.strokeStyle = "#000000";
                context.strokeRect(0, 0, canvas.width, canvas.height);

                // Draw areas
                areas.forEach(area => {
                    var isRes = saveThisObject.isAreaReserved(area);
                    SelectArea.drawAreaIcon(context, area, isRes);
                });
            };

            if (this.state.layout.layoutImage != null) {
                image.src = "data:image/png;base64," + this.state.layout.layoutImage;
            }
        }
    }

    static convertAreaLocToCanvasLoc(area) {
        var xLoc = (area.areaLocation.x / 100) * SelectArea.layoutWidth;
        var yLoc = (area.areaLocation.y / 100) * SelectArea.layoutHeight;

        return {x: xLoc, y: yLoc};
    }

    async populateAreaData() {
        var selectedAddress = this.props.selectedLayout.address;
        if (selectedAddress == null)
            return false;

        var fetchString = 'selectarea/getlayout/?address=' + selectedAddress;
        const response = await fetch(fetchString, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
            
        const layout = await response.json();
        this.setState({ layout: layout, loading: false });
        return true;
    }

    async postCustomerData(email, firstName, lastName, duration, dateString, areaX, areaY, address, layoutName) {
        var response = await fetch('selectarea/savereservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                email: email,
                firstName: firstName,
                lastName: lastName,
                duration: duration,
                date: dateString,
                areaLocX: areaX,
                areaLocY: areaY,
                address: address,
                layoutName: layoutName
            })
        });

        if (await response.json()) {
            this.openReservedAreaSuccess();
        }

        this.renderAreas();
    }

    static drawAreaIcon(context, area, isRes) {

        var cLoc = SelectArea.convertAreaLocToCanvasLoc(area);

        context.beginPath();
        context.arc(cLoc.x, cLoc.y, SelectArea.areaRadius, 0, 2 * Math.PI, false);

        if (isRes) {
            context.fillStyle = 'rgba(100, 100, 100, 0.75)';
        }
        else {
            context.fillStyle = 'rgba(0, 100, 0, 0.75)';
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

        this.state.layout.areas.forEach(area => {
            var areaLoc = SelectArea.convertAreaLocToCanvasLoc(area);
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

    render() {

        return (
            <div>
                <canvas id="layoutCanvas"
                        width={SelectArea.layoutWidth}
                        height={SelectArea.layoutHeight}
                        onClick={this.canvasClick} />
                <Box maxWidth={SelectArea.layoutWidth}>
                    <Box maxWidth={SelectArea.layoutWidth}>
                        <Typography id="sliderLabel" className="duration-slider-label small">
                            Duration (hours)
                                </Typography>
                        <Slider
                            className="duration-slider"
                            id="durationSlider"
                            aria-label="sliderLabel"
                            defaultValue={SelectArea.defaultDuration}
                            step={0.25}
                            marks
                            min={0.25}
                            max={4.0}
                            valueLabelDisplay="auto"
                            onChange={(e, value) => {
                                this.setState({ selectedDuration: value });
                                this.renderAreas();
                            }}
                            width={100}
                        />
                    </Box>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            id="date-picker-inline"
                            label="Reservation Date"
                            value={this.state.selectedDate}
                            onChange={this.handleDateChanged}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardTimePicker
                            id="time-picker-inline"
                            label="Reservation Time"
                            variant="inline"
                            value={this.state.selectedTime}
                            onChange={this.handleTimeChanged}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Box>
                <Dialog open={this.state.reserveAreaDialogOpen} onClose={this.handleReserveDialogClose} aria-labelledby="reserveAreaDialog">
                    <DialogTitle id="reserveAreaDialog">Reserve Area</DialogTitle>
                    <DialogContent orientation='vertical'>
                        <DialogContentText>
                            To reserve this area, please enter your email address and full name. 
                        </DialogContentText>
                        <TextField
                            id="email"
                            label="Email Address"
                            fullWidth
                            error={this.state.errors.email}
                            helperText={ this.state.errorMessages.email }
                            onChange={() => {
                                var newErrors = this.state.errors
                                var newErrorMessages = this.state.errorMessages;
                                newErrors.email = false;
                                newErrorMessages.email = '';
                                this.setState({ errors: newErrors, errorMessages: newErrorMessages });
                            }}
                        />
                        <TextField
                            id="firstName"
                            label="First Name"
                            fullWidth
                            error={this.state.errors.first}
                            helperText={this.state.errorMessages.first}
                            onChange={() => {
                                var newErrors = this.state.errors;
                                var newErrorMessages = this.state.errorMessages;
                                newErrors.first = false;
                                newErrorMessages.first = '';
                                this.setState({ errors: newErrors, errorMessages: newErrorMessages });
                            }}
                        />
                        <TextField
                            className="last-dialog-text-field"
                            id="lastName"
                            label="Last Name"
                            fullWidth
                            error={this.state.errors.last}
                            helperText={this.state.errorMessages.last}
                            onChange={() => {
                                var newErrors = this.state.errors;
                                var newErrorMessages = this.state.errorMessages;
                                newErrors.last = false;
                                newErrorMessages.last = '';
                                this.setState({ errors: newErrors, errorMessages: newErrorMessages });
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleReserveDialogClose} className='button-nav'>
                            Cancel
                        </Button>
                        <Button onClick={this.handleReserve} className='button-nav' >
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
        var emailElem = document.getElementById('email');
        var firstElem = document.getElementById('firstName');
        var lastElem = document.getElementById('lastName');

        var email = emailElem.value;
        var first = firstElem.value;
        var last = lastElem.value;

        var duration = this.state.selectedDuration;
        var dateStr = this.state.selectedDate.toUTCString();
        var areaLoc = this.state.selectedArea.areaLocation;

        // Validate text fields
        var validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        var eHasError = email == null || email === "" || !email.match(validEmailRegex);
        var fHasError = first == null || first === "";
        var lHasError = last == null || last === "";

        // Do not post or close form if errors exist!
        if (eHasError || fHasError || lHasError) {
            this.setState({
                errors: { email: eHasError, first: fHasError, last: lHasError },
                errorMessages: {
                    email: eHasError ? 'Please enter a valid email.' : '',
                    first: fHasError ? 'First name is a required field.' : '',
                    last: lHasError ? 'Last name is a required field.' : ''
                }
            });
            return;
        }

        this.postCustomerData(email, first, last, duration, dateStr, areaLoc.x, areaLoc.y, this.props.selectedLayout.address, this.props.selectedLayout.name);
        this.setState({ reserveAreaDialogOpen: false });
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

    handleDateChanged = (date) => {
        this.setState({ selectedDate: date });
        this.renderAreas();
    };

    handleTimeChanged = (time) => {
        this.setState({ selectedTime: time });
        this.renderAreas();
    };
}
