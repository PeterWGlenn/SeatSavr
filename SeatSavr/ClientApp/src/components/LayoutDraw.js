import React from "react";
import { withAuth0 } from '@auth0/auth0-react';
import MenuBar from "./menu-bar";
import Content from "./Content";
import ColorPanel from "./color-panel";

import pencil from "../images/pencil.ico";
import line from "../images/line.ico";
import brush from "../images/brush.ico";
import fill from "../images/fill.ico";
import rectangle from "../images/rectangle.ico";
import text from "../images/text.ico";
import circle from "../images/circle.ico";
import erase from "../images/eraser.ico";
import picker from "../images/picker.ico";

const defaultColor = "black";
const defaultTool = "Pencil";

const toolbarItems = [
    { name: "Pencil", image: pencil },
    { name: "Line", image: line },
    { name: "Brush", image: brush },
    { name: "Fill", image: fill },
    { name: "Text", image: text },
    { name: "Rectangle", image: rectangle },
    { name: "Circle", image: circle },
    { name: "Erase", image: erase },
    { name: "Picker", image: picker }
];

class LayoutDraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: defaultColor,
            selectedItem: defaultTool,
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
                <MenuBar />
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
            </React.Fragment>
        );
    }
} export default withAuth0(LayoutDraw);