import React from "react";
import { withAuth0 } from '@auth0/auth0-react';
import Content from "./Content";
import ColorPanel from "./color-panel";
//import Snackbar from '@material-ui/core/Snackbar';


const defaultColor = "black";


const toolbarItems = [
    { name: "Pencil" },
    { name: "Line" },
    { name: "Brush" },
    // TODO { name: "Fill"},
    // TODO{ name: "Text" },
    { name: "Rectangle" },
    //TODO { name: "Circle" },
    //TODO { name: "Erase" },
    //TODO { name: "Picker" }
];

export class LayoutDraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: defaultColor,
            toolbarItems: toolbarItems,
            canvasImageDataURL: null,
            saveDrawOpen: false
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
            <><React.Fragment>
                

                <Content
                    items={this.state.toolbarItems}
                    activeItem={this.state.selectedItem}
                    handleClick={this.changeTool}
                    color={this.state.color} />
                <ColorPanel
                    selectedColor={this.state.color}
                    handleClick={this.changeColor} />

            </React.Fragment>
                </>
        );
    }

    
} export default withAuth0(LayoutDraw);