import React from "react";
import { Form, Button, ButtonToolbar } from "react-bootstrap";
import PropTypes from "prop-types";

export default class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            validated: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.show !== state.show) {
            return ({ show: props.show });
        }
        return null;
    }

    validatePassword(form) {
        const password1 = form.elements.namedItem("formGroupPassword").value;
        const password2 = form.elements.namedItem("formGroupPasswordConfirmation").value;

        if (password1 !== password2) {
            form.elements.namedItem("formGroupPasswordConfirmation").setCustomValidity("Passwords don't match");
        } else {
            form.elements.namedItem("formGroupPasswordConfirmation").setCustomValidity("");

        }
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        this.validatePassword(form);
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.props.handleRegistration(
            {
                canceled: false,
                username: form.elements.namedItem("formGroupUserName").value,
                email: form.elements.namedItem("formGroupEmail").value,
                password: form.elements.namedItem("formGroupPassword").value
            });
        this.setState({ validated: true });
    }

    handleReset() {
        this.props.handleRegistration(
            {
                canceled: true
            }
        );
    }

    render() {
        const { validated, show } = this.state;
        if (show) {
            return (
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={e => this.handleSubmit(e)}
                    onReset={e => this.handleReset()}
                >
                    <Form.Group controlId="formGroupUserName">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control required type="text" placeholder="Enter User Name" />
                    </Form.Group>
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                        <Form.Label>Choose a Password</Form.Label>
                        <Form.Control required type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group controlId="formGroupPasswordConfirmation">
                        <Form.Label>Confirm the Password</Form.Label>
                        <Form.Control required type="password" placeholder="Password" />
                    </Form.Group>
                    <ButtonToolbar>
                        <Button variant="secondary" type="reset">
                            Cancel
                    </Button>
                        <Button variant="primary" type="submit">
                            Register
                    </Button>
                    </ButtonToolbar>
                </Form>
            );
        } else {
            return null;
        }
    }
}

RegistrationForm.propTypes = {
    show: PropTypes.bool,
    handleRegistration: PropTypes.func
}