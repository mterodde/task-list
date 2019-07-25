import React from "react";
import { Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import PropTypes from "prop-types";

export default class MyNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser,
      serviceConfiguration: this.props.serviceConfiguration
    }

    this.userStatus = this.userStatus.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentUser !== state.currentUser) {
      return ({
        currentUser: props.currentUser
      })
    }
    return null;
  }

  userStatus() {
    let userConfig = this.state.serviceConfiguration.find((navConfig) => { return navConfig.title === "User" });

    return (
      <NavDropdown
        title={
          this.state.currentUser ?
            <Image width="30px" className="img-responsive" src="/images/smileyAwake.png" /> :
            <Image width="30px" className="img-responsive" src="/images/smileySleeping.jpg" />
        }
      >
        {userConfig.items.map((navItem, key) => {
          return (<NavDropdown.Item key={key} id={navItem.opTitle} onClick={this.props.eventHandler}>{navItem.opTitle}</NavDropdown.Item>);
        })}
      </NavDropdown>
    )
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Things to be done</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Nav >
            {this.userStatus()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}


MyNavbar.propTypes = {
  currentEnv: PropTypes.string,
  serviceConfiguration: PropTypes.array,
  currentUser: PropTypes.object,
  eventHandler: PropTypes.func
}

