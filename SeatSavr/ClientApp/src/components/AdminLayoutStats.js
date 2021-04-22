import React from "react";
import { withAuth0 } from "@auth0/auth0-react";
import LinearProgress from '@material-ui/core/LinearProgress';

import '../custom.css'

class AdminLayoutStats extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            capacityPercentage: 0
        };
    }

    getCapacityPercentage() {
        var l = this.props.selectedLayout;
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
            <div className="card h-100">
                <div className="card-body">
                    <p>Current Capacity Percentage: ({currCapPer.toFixed(2)}%)</p>
                    <LinearProgress variant="determinate" value={currCapPer} />
                </div>
            </div>
        );
    }
}
export default withAuth0(AdminLayoutStats);




