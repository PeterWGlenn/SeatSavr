import React from "react";
import { withAuth0 } from "@auth0/auth0-react";
import LinearProgress from '@material-ui/core/LinearProgress';
import { Line } from 'react-chartjs';
import moment from "moment";

import '../custom.css'

const plotOptions = {
    scales: {
        xAxes: [{
            type: 'time',
            time: {
                unit: 'day'
            }
        }]
    }
}

class AdminLayoutStats extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            layout: props.selectedLayout,
            reservationsPlotData: {
                labels: [],
                datasets: [
                    {
                        label: 'Reservations',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: '#FF9200',
                        borderColor: '#57291F',
                        borderWidth: 1,
                        data: []
                    }
                ]
            }
        };

        this.setReservationPlotData();
    }

    setReservationPlotData() {

        var numReservations = 0;
        var dataPoints = []

        this.state.layout.areas.forEach(a => {
            a.reservations.forEach(r => {
                var resDate = moment(r.date + "Z");
                numReservations = numReservations + 1;

                dataPoints.push({ x: resDate, y: numReservations });
            });
        });

        dataPoints.sort(function (a, b) {
            var keyA = a.x;
            var keyB = b.x;

            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;

            return 0;
        });

        dataPoints.forEach(point => {
            this.state.reservationsPlotData.labels.push(point.x);
            this.state.reservationsPlotData.datasets[0].data.push(point.y);
        });
    }

    getCapacityPercentage() {
        var l = this.state.layout;
        if (l == null) {
            return 0;
        }

        var numAreas = 0;
        l.areas.forEach(a => numAreas = numAreas + 1);

        var numCurrRes = 0;
        l.areas.forEach(a => {
            a.reservations.forEach(r => {
                var millisecondsInAnHour = 1000 * 60 * 60;

                var resStartDate = new Date(r.date + "Z");
                var resEndDate = new Date(resStartDate);

                resEndDate.setTime(resEndDate.getTime() + (r.duration * millisecondsInAnHour));

                var currDate = new Date();

                if (currDate <= resEndDate && currDate >= resStartDate) {
                    numCurrRes = numCurrRes + 1;
                }
            });
        });

        return (numCurrRes / numAreas) * 100;
    }

    render() {

        var currCapPer = this.getCapacityPercentage();

        return (
            <div>
                <div className="card h-100">
                    <div className="card-body">
                        <p>Current Capacity Percentage: ({currCapPer.toFixed(2)}%)</p>
                        <LinearProgress variant="determinate" value={currCapPer} />
                    </div>
                </div>
                <div className="card h-100">
                    <div className="card-body">
                        <Line
                            data={this.state.reservationsPlotData}
                            options={plotOptions}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default withAuth0(AdminLayoutStats);




