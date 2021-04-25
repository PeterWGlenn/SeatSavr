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
                tooltipFormat: 'MM/DD/YYYY',
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
                        label: 'Reservations Per Day',
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

    sameDay(d1, d2) {

        d1 = new Date(d1);
        d2 = new Date(d2);

        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    setReservationPlotData() {

        var reservationDates = []
        this.state.layout.areas.forEach(a => {
            a.reservations.forEach(r => {
                var resDate = moment(r.date + "Z");
                reservationDates.push(resDate);
            });
        });
        reservationDates.sort((a, b) => a - b);

        var considerDate = moment().subtract(30, 'days');
        for (let day = 0; day < 30; day++) {
            considerDate = considerDate.add(1, 'days');

            var numResOnDay = 0;
            reservationDates.forEach(date => {
                if (this.sameDay(considerDate, date)) {
                    numResOnDay = numResOnDay + 1;
                }
            });

            this.state.reservationsPlotData.labels.push(new Date(considerDate));
            this.state.reservationsPlotData.datasets[0].data.push(numResOnDay);
        }
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




