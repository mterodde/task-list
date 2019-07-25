import React from "react";
import { Form, Button, ButtonToolbar } from "react-bootstrap";
import PropTypes from "prop-types";

export function DataMaintenanceView(props) {

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        props.handleNewTask({ description: form.elements.namedItem("formGroupNewTask").value })
    };

    return (
        <section id="inputArea">
            <Form
                noValidate
                onSubmit={e => handleSubmit(e)}
            >
                <Form.Group controlId="formGroupNewTask">
                    <Form.Label>New Task</Form.Label>
                    <Form.Control required type="text" placeholder="Enter task description" />
                </Form.Group>
                <ButtonToolbar>
                    <Button variant="primary" type="submit">
                        Create
                        </Button>
                </ButtonToolbar>
            </Form>
        </section>
    )
}

DataMaintenanceView.propTypes = {
    handleNewTask: PropTypes.func
}