"use strict";

import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Container } from "react-bootstrap";

/* 
  import the views
*/
import MyNavbar from "../view/navbar";
import AppView from "../view/appView";
import LoginView from "../view/loginView";

/* 
  import the modells
*/
import { INITIAL_TASK, TASK_RETRIEVALSTATUS, TASK_DEMO_LIST } from "../modell/TaskGlobals";
import { AUTH_RETRIEVALSTATUS } from "../modell/authGlobals";
import TaskBucket from "../modell/TaskBucket";
import UserModell from "../modell/user";

export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.myEnvironment = "NO_ENV";

    this.state = {
      taskList: TASK_DEMO_LIST,
      currentUser: null,
      showLogin: false,
      showTaskList: false,
      showWait: false,
      loginErrorMessage: '',
      taskListErrorMessage: ''
    }

    this.processChangedUserState = this.processChangedUserState.bind(this);
    this.processChangedBucketState = this.processChangedBucketState.bind(this);

    this.handleNewTask = this.handleNewTask.bind(this);

    this.handleNavigationEvent = this.handleNavigationEvent.bind(this);
    this.handleLoginInput = this.handleLoginInput.bind(this);
    this.handleRegistrationInput = this.handleRegistrationInput.bind(this);

    this.userHandle = new UserModell(this.processChangedUserState, `http://${window.location.host}/user`);
    // this.taskBucketManager = new TaskBucket(this.processChangedBucketState, this.userHandle, `http://${window.location.host}/toDo`);
    this.taskBucketManager = new TaskBucket(this.processChangedBucketState);

  }

  /***************************************************************************
                           Navigation event handler
   ***************************************************************************/
  /*
        Handles the selection of the type of calculation in the top navigation
  */
  handleNavigationEvent(e) {

    switch (e.currentTarget.id) {
      case "login":
        this.setState({ showLogin: true });
        break;

      case "logoff":
        this.userHandle.loggoff();
        this.setState({ currentUser: null });
        break;

      default:
        break;
    }
  }


  /***************************************************************************
                            Handle status changes from modell
    ***************************************************************************/

  /* 
    Used by the user management to communicate status changes
    during login and registration opreration to the controller.
  */
  processChangedUserState(status, err) {
    switch (status) {
      case AUTH_RETRIEVALSTATUS.loginSuccessfull:
        this.setState({
          showLogin: false,
          currentUser: this.userHandle.userData
        });
        break;

      case AUTH_RETRIEVALSTATUS.loginFailed:
        this.setState({ loginErrorMessage: err.message });
        break;

      default:
        break;
    }
  }

  /* 
    Used by the tasklist manager to communicate status changes
    during task list retrieval to the controller.
  */
  processChangedBucketState(status, err) {
    switch (status) {
      case TASK_RETRIEVALSTATUS.retrievalFinished:
        this.setState({ taskList: this.taskBucketManager.taskList });
        break;

      case TASK_RETRIEVALSTATUS.retrievalFailed:
        this.setState({ taskListErrorMessage: err.message });
        break;

      default:
        break;
    }
  }

  /***************************************************************************
                            User input handler
    ***************************************************************************/

  /* 
    Handels the input of a new task list item
  */

  handleNewTask(taskDescription) {
    let newTaskData = { ...INITIAL_TASK };
    newTaskData.description = taskDescription;
    newTaskData.ownerId = this.userHandle.id;
    this.taskBucketManager.createTask(newTaskData);
    this.setState({ taskList: this.taskBucketManager.taskList });
  }


  /*
       Handles the input of login data in the input view
   */

  handleLoginInput(loginRecord) {
    let { canceled, ...credentials } = loginRecord;
    if (canceled) {
      this.setState({
        showLogin: false,
        statusMessage: "login canceled"
      });
    } else {
      this.userHandle.login(credentials);
    }
  }


  /*
       Handles the input of user credentials for registration in the input view
   */

  handleRegistrationInput(registrationRecord) {
    let { canceled, ...credentials } = registrationRecord;
    if (canceled) {
      this.setState({
        showLogin: false,
        statusMessage: "registration canceled"
      });
    } else {
      this.userHandle.register(credentials);
    }
  }

  /* 
    render the page
  */

  render() {
    return (
      <div id="display-area">
        <div id="nav-area">
          <MyNavbar
            currentEnv={this.myEnvironment}
            serviceConfiguration={this.props.serviceConfiguration}
            currentUser={this.state.currentUser}
            eventHandler={this.handleNavigationEvent}
          />
        </div>
        <div id="content-area">
          <LoginView
            show={this.state.showLogin}
            message={this.state.loginErrorMessage}
            handleLogin={this.handleLoginInput}
            handleRegistration={this.handleRegistrationInput}
          />
          <Container>
            <AppView
              showTaskList={this.state.showTaskList}
              tasks={this.state.taskList}
              handleNewTask={this.handleNewTask}
            />
          </Container>
        </div>
      </div>
    );
  }
}

MainView.propTypes = {
  serviceConfiguration: PropTypes.array
};

