import React from "react";
import { Modal, ModalTitle, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import LoginForm from "./loginForm";
import RegistrationForm from "./registrationForm";

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            message: this.props.message,
            login: true
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.show !== state.show || props.message !== props.message ) {
            return ({ 
                show: props.show,
                message: props.message
             });
        }
        return null;
    }

    handleRadio(e) {
        let stateUpdate = { login: (e.target.id === "inline-radio-login") }
        this.setState(stateUpdate);
    }

    handleClose() {
        this.state.login ?
            this.props.handleLogin({ canceled: true }) :
            this.props.handleRegistration({ canceled: true });
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <ModalTitle>
                        <h1>Login</h1>
                        <p>
                           if you already have an account login. 
                            Otherwise choose register.
                        </p>
                        <p>
                            {this.state.message}
                        </p>
                    </ModalTitle>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div key={'inline-radio'} className="mb-3">
                            <Form.Check
                                inline label="Login"
                                type="radio"
                                id="inline-radio-login"
                                checked={this.state.login}
                                onChange={this.handleRadio}
                            />
                            <Form.Check
                                inline label="Register"
                                type="radio"
                                id="inline-radio-register"
                                checked={!this.state.login}
                                onChange={this.handleRadio}
                            />
                        </div>
                    </Form>
                    {/* Whether any of these forms have to be displayed depends in any case on the display of the parent */}
                    <LoginForm show={this.state.show && this.state.login} handleLogin={this.props.handleLogin} />
                    <RegistrationForm show={this.state.show && !this.state.login} handleRegistration={this.props.handleRegistration} />
                </Modal.Body>
            </Modal>
        );
    }
}

LoginView.propTypes = {
    show: PropTypes.bool,
    message: PropTypes.string,
    handleLogin: PropTypes.func,
    handleRegistration: PropTypes.func
}