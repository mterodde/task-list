import React from "react";
import { Form, Button, ButtonToolbar, FormGroup } from "react-bootstrap";
import PropTypes from "prop-types";

export default class FilterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: true
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() !== false) {
            event.stopPropagation();
            this.props.handleLogin(
                {
                    canceled: false,
                    email: form.elements.namedItem("formGroupEmail").value,
                    password: form.elements.namedItem("formGroupPassword").value
                });
            this.setState({ validated: true });
        }
    }


    render(){
        return(
            <Form
            noValidate
            validate={validated}
            onSubmit={e => this.handleSubmit(e)}
            >
                <Form.Group controlId="formGroupFilter">
                    <Form.Control type="string" placeholder="Enter search string"/>
                    <Button variant="primary" type="submit">
                        Search
                    </Button>
                </Form.Group>
            </Form>
        );
    }
}

FilterForm.PropTypes = {
    handleFilter: PropTypes.func
}
