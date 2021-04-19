import React from "react";
import { withAuth0 } from '@auth0/auth0-react';
import MenuBar from "./menu-bar";
import Content from "./Content";
import ColorPanel from "./color-panel";





const defaultColor = "black";


const toolbarItems = [
    { name: "Pencil" },
    { name: "Line" },
    { name: "Brush" },
    { name: "Fill"},
    { name: "Text" },
    { name: "Rectangle" },
    { name: "Circle" },
    { name: "Erase" },
    { name: "Picker" }
];

class LayoutDraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: defaultColor,
            toolbarItems: toolbarItems
        };
        this.changeColor = this.changeColor.bind(this);
        this.changeTool = this.changeTool.bind(this);
    }

    changeColor(event) {
        this.setState({ color: event.target.style.backgroundColor });
    }

    changeTool(event, tool) {
        this.setState({ selectedItem: tool });
    }

    render() {
        return (
            <React.Fragment>
                                
                <Content
                    items={this.state.toolbarItems}
                    activeItem={this.state.selectedItem}
                    handleClick={this.changeTool}
                    color={this.state.color}
                />
                <ColorPanel
                    selectedColor={this.state.color}
                    handleClick={this.changeColor}
                />
                <button onClick={this.onSaveLayout} className="form-buttons">Save Layout</button>
            </React.Fragment>
        );
    }

    onSaveLayout = () => {
        this.saveLayout();
    }

    async saveLayout() {
        await this.postLayout();
        this.renderAreas();
    }

    async postLayout() {

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
                name: layout.name,
                address: layout.address,
                layoutImage: this.state.canvasImageDataURL,
                newAreaLocations: this.state.newAreaLocations
            })
        });
    }
} export default withAuth0(LayoutDraw);