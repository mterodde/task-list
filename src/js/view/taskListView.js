import React from "react";
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from "prop-types";

export  class TaskListView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: props.tasks
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.tasks !== state.tasks) {
            return ({ tasks: props.tasks });
        }
        return null;
    }

    render() {
        return (
            <section id="resultArea" >
                <ListGroup id="taskList" title="List of my current tasks">
                    {this.state.tasks.map(task => { return (
                    <ListGroupItem id={task.id} key={task.id}>
                        { task.description }
                    </ListGroupItem>) })}
                </ListGroup>
            </section>
        )
    }
}

TaskListView.propTypes = {
    show: PropTypes.bool,
    tasks: PropTypes.array
}