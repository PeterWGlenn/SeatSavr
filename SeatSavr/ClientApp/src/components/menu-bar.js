import React from "react";

const MenuItem = props => {
    return <div className="menu-item">{props.text}</div>;
};

export default class MenuBar extends React.Component {
    
    render() {
        return (
            <div className="menu-bar">
                <MenuItem text="Image" />
                <MenuItem text="Colors" />
            </div>
        );
    }
}