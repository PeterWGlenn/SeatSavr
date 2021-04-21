import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import './CancelReservation.css'
import '../custom.css'

export class CancelReservation extends Component {
    static displayName = CancelReservation.name;

    constructor(props, id) {
        super(props);
        this.state = {
            reservationId: id,
            reservation: null,
            userCancelled: false
        };
    }

    componentDidMount() {
        var searchSplit = this.props.location.search.split('id=');

        console.log(searchSplit);

        if (searchSplit.length >= 2) {
            this.getReservation(searchSplit[1]);
        }
    }

    async getReservation(id) {
        var fetchString = 'cancelreservation/getreservation/?id=' + id;

        console.log(fetchString)

        const response = await fetch(fetchString, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const reservation = await response.json();

        if (reservation.id != null) {
            this.setState({ reservation: reservation });
        }
    }

    async postCancelationData(id) {
        var fetchString = 'cancelreservation/cancel/?id=' + id;

        const response = await fetch(fetchString, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const didSucceed = await response.json();

        if (didSucceed) {
            this.setState({ userCancelled: true });
        }
    }

    render() {

        if (this.state.reservation == null) {
            return (
                <div>
                    <p>
                        This reservation has already been cancelled or does not exist.
                    </p>
                </div>
            );
        }

        if (this.state.userCancelled) {
            return (
                <div>
                    <p>
                        You have successfully cancelled your reservation! 
                    </p>
                </div>
            );
        }

        return (
            <div className="text-div">
                <h1>Reservation Information</h1>
                <p>
                    Reservee: {this.state.reservation.customer.firstName} {this.state.reservation.customer.lastName}<br />
                    Layout: {this.state.reservation.reservedAreaName}<br />
                    Address: {this.state.reservation.reservedAreaAddress}<br />
                    Date: {this.state.reservation.date}<br />
                    Duration: {this.state.reservation.duration} hour(s)<br />
                </p>
                <Button onClick={() => { this.postCancelationData(this.state.reservation.id) }} className="form-buttons">
                    Cancel Reservation
                </Button>
            </div>
        );
    }
}
