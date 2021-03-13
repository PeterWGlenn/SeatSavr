import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import './SelectArea.css';


export class SelectArea extends Component {
    static displayName = SelectArea.name;

    constructor(props) {
        super(props);
        this.state = {
            areas: [],
            loading: true,
            selectedDate: new Date()
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

                var xLoc = (area.areaLocation.x / 100) * this.layoutWidth;
                var yLoc = (area.areaLocation.y / 100) * this.layoutHeight;
                var isRes = this.isAreaReserved(area);

                SelectArea.drawSeatIcon(context, xLoc, yLoc, isRes);
            });
        }
    }

    async populateAreaData() {
        const response = await fetch('selectarea'); 
        const data = await response.json();
        this.setState({ areas: data, loading: false });
    }

    static drawSeatIcon(context, x, y, isRes) {

        context.beginPath();
        context.arc(x, y, 12, 0, 2 * Math.PI, false);

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

    /*PG -> I'm using the empty h3 to put the date picker below the canvas. There may be a cleaner way to do this.*/
    render() {
        return (
            <div>
                <h3>Please select an area to reserve...</h3>
                <canvas id="layoutCanvas" width={this.layoutWidth} height={this.layoutHeight} className="layout-canvas" />
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
            </div>
        );
    }
}
