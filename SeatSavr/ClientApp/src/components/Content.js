import React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import Toolbox from "./toolbox";

export default class Content extends React.Component {
    static displayName = Content.name;
    static areaRadius = 16;

    static layoutScale = 0.95;

    static layoutWidth = 888 * this.layoutScale;
    static layoutHeight = 500 * this.layoutScale;

    constructor(props) {
        super(props);
        this.state = {
            isDrawing: false,
            offsetX: 0,
            offsetY: 0,
            startX: 0,
            startY: 0,
            canvasImageDataURL: null,
            layout: null,
            loading: true
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.canvasRef = React.createRef();

        this.canvasOverlayRef = React.createRef();
        this.ctx = null;
        this.overlayCtx = null;
    }

    //componentWillMount() {
    //    this.renderContent();
    //}

    async renderContent() {
        if (this.state.loading === true) {
            await this.populateContent;
        }
    }



    componentDidMount() {
        this.renderContent();
        let canvasRef = this.canvasRef.current;
        let canvasOverlayRef = this.canvasOverlayRef.current;
        let canvasRect = canvasRef.getBoundingClientRect();
        this.ctx = canvasRef.getContext("2d");
        this.ctxOverlay = canvasOverlayRef.getContext("2d");
        this.setState({ offsetX: canvasRect.left, offsetY: canvasRect.top, loading: false });
    }


    handleMouseDown(e) {
        let ctx = this.ctx;
        let ctxOverlay = this.ctxOverlay;
        let activeItem = this.props.activeItem;

        this.setState({ isDrawing: true });
        ctx.beginPath();
        ctx.strokeStyle = this.props.color;
        ctx.lineWidth = 1;
        ctx.lineJoin = ctx.lineCap = "round";

        if (activeItem === "Pencil" || activeItem === "Brush") {
            ctx.moveTo(
                e.clientX - this.state.offsetX,
                e.clientY - this.state.offsetY
            );
            if (activeItem === "Brush") ctx.lineWidth = 5;
        } else if (activeItem === "Line" || activeItem === "Rectangle" || activeItem === "Erase") {
            ctxOverlay.strokeStyle = this.props.color;
            ctxOverlay.lineWidth = 1;
            ctxOverlay.lineJoin = ctx.lineCap = "round";
            this.setState({
                startX: e.clientX - this.state.offsetX,
                startY: e.clientY - this.state.offsetY
            });
        }
    }

    handleMouseMove(e) {
        let ctx = this.ctx;
        let ctxOverlay = this.ctxOverlay;

        if (this.state.isDrawing) {
            if (
                this.props.activeItem === "Pencil" ||
                this.props.activeItem === "Brush"
            ) {
                ctx.lineTo(
                    e.clientX - this.state.offsetX,
                    e.clientY - this.state.offsetY
                );
                ctx.stroke();
            }
            if (this.props.activeItem === "Line") {
                ctxOverlay.clearRect(0, 0, 600, 480);
                ctxOverlay.beginPath();
                ctxOverlay.moveTo(this.state.startX, this.state.startY);
                ctxOverlay.lineTo(
                    e.clientX - this.state.offsetX,
                    e.clientY - this.state.offsetY
                );
                ctxOverlay.stroke();
                ctxOverlay.closePath();
            }
            if (this.props.activeItem === "Rectangle" || this.props.activeItem === "Erase") {
                ctxOverlay.clearRect(0, 0, 600, 480);
                let width = e.clientX - this.state.offsetX - this.state.startX;
                let height = e.clientY - this.state.offsetY - this.state.startY;
                ctxOverlay.strokeRect(
                    this.state.startX,
                    this.state.startY,
                    width,
                    height
                );
            }
        }
    }

    handleMouseUp(e) {
        let ctx = this.ctx;

        if (this.props.activeItem === "Line") {
            this.ctxOverlay.clearRect(0, 0, 600, 480);
            ctx.moveTo(this.state.startX, this.state.startY);
            ctx.lineTo(
                e.clientX - this.state.offsetX,
                e.clientY - this.state.offsetY
            );
            ctx.stroke();
        }

        if (this.props.activeItem === "Rectangle") {
            let width = e.clientX - this.state.offsetX - this.state.startX;
            let height = e.clientY - this.state.offsetY - this.state.startY;
            this.ctxOverlay.clearRect(0, 0, 600, 480);
            ctx.strokeRect(this.state.startX, this.state.startY, width, height);
        }

        if (this.props.activeItem === "Erase") {
            let width = e.clientX - this.state.offsetX - this.state.startX;
            let height = e.clientY - this.state.offsetY - this.state.startY;
            this.ctxOverlay.clearRect(0, 0, 600, 480);
            ctx.clearRect(this.state.startX, this.state.startY, width, height);
        }

        ctx.closePath();
        this.setState({ isDrawing: false });

    }


    render() {
        return (
            <><div className="content">
                <Toolbox
                    items={this.props.items}
                    activeItem={this.props.activeItem}
                    handleClick={this.props.handleClick} />
                <div className="canvas">
                    <canvas
                        className="canvas-actual"
                        id="background"
                        width="600px"
                        height="480px"
                        ref={this.canvasRef}
                        onMouseDown={this.handleMouseDown}
                        onMouseMove={this.handleMouseMove}
                        onMouseUp={this.handleMouseUp} />
                    <canvas
                        className="canvas-overlay"
                        id="overlay"
                        width="600px"
                        height="480px"
                        ref={this.canvasOverlayRef} />
                </div>
            </div>
                <button onClick={this.onContinue} className="form-buttons">Continue to Place Areas </button>
                <button onClick={this.onSaveLayout} className="form-buttons">Save Layout</button>
                <Snackbar open={this.state.saveDrawOpen} autoHideDuration={3000} onClose={this.handleSaveDrawClose}>
                    <Alert onClose={this.handleReservedAreaWarningClose} severity="success">
                        You have successfully saved your personal drawing of a layout
                    </Alert>
                </Snackbar></>

        );
    }

    onContinue() {

    }

    openSaveDialog() {
        this.setState({ saveDrawOpen: true });
    }

    handleSaveDrawClose = () => {
        this.setState({ saveDrawOpen: false });
    }

    onSaveLayout = () => {
        this.saveLayout();
    }

    async saveLayout() {
        await this.postLayout();
        this.openSaveDialog();
    }

    async postLayout() {
        var canvas = document.getElementById('background');
        this.state.canvasImageDataURL = canvas.toDataURL();
        console.log("Canvas Url");
        console.log(this.state.canvasImageDataURL);

        if (this.state.loading)
            return;

        var layout = this.state.layout;

        await fetch('layouteditor/savelayout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                name: this.props.layout.name,
                address: this.props.layout.address,
                layoutImage: this.state.canvasImageDataURL
                //newAreaLocations: this.state.newAreaLocations
            })
        });
    }
}