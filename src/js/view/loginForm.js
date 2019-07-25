import React from "react";
import { Form, Button, ButtonToolbar } from "react-bootstrap";
import PropTypes from "prop-types";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            validated: true
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.show !== state.show) {
            return ({ show: props.show });
        }
        return null;
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

    handleReset() {
        this.props.handleLogin(
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
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control required type="password" placeholder="Password" />
                    </Form.Group>
                    <ButtonToolbar>
                        <Button variant="secondary" type="reset">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </ButtonToolbar>
                </Form>
            );
        } else {
            return null;
        }
    }
}

LoginForm.propTypes = {
    show: PropTypes.bool,
    handleLogin: PropTypes.func
}