'use restrict'
import { UserAuth } from "./authorize";

import {
    LOGIN_STATUS_VALUES,
    INITIAL_USER_DATA,
    AUTH_RETRIEVALSTATUS
} from "./authGlobals.js";


export default class UserModell {
    constructor(sendStateFunc, authServiceURI = null) {
        /* reference to a function used to communicate status changes to the main controller */
        this.sendState = sendStateFunc;

        this._userData = INITIAL_USER_DATA;
        this.loginStatus = LOGIN_STATUS_VALUES.loggedOf;

        this.processServiceResult = this.processServiceResult.bind(this);

        this.authService = new UserAuth(authServiceURI, this.processServiceResult);
    }

    /*** Declaration of private class members ***/

    /* 
        process any answer from the authorization service
    */
   processServiceResult(err, res){
    // [processServiceResult](err, res) {
        if (err) {
            console.error(err);
            this.loginStatus = LOGIN_STATUS_VALUES.loginFailed;

            /* Tell the main controller that the login / registration of the user failed */
            this.sendState(AUTH_RETRIEVALSTATUS.loginFailed, err);
        } else {
            if (res) {
                /* 
                    In case of a successfull login, the auth service replies with a
                    full user data set which we store in this user object now.
                */
                this._userData = { ...res };
                this.loginStatus = LOGIN_STATUS_VALUES.loggedIn;
            }
            /* Tell the main controller that the login / registration for the user was successfull */
            this.sendState(AUTH_RETRIEVALSTATUS.loginSuccessfull);
        }
    }
    /*** End of declaration of private class members ***/


    get id() {
        return (this._userData.id);
    }

    get name() {
        return (this._userData.name);
    }

    get email() {
        return (this._userData.email);
    }

    get userData(){
        let { id, ...user } = this._userData;
        return user;
    }

    get isLoggedIn() {
        return (this.loginStatus === LOGIN_STATUS_VALUES.loggedIn);
    }

    set name(name) {
        this._userData.name = name;
    }

    set email(email) {
        this._userData.email = email;
    }

    loggoff() {
        this.loginStatus = LOGIN_STATUS_VALUES.loggedOff;
    }

    login(credentials) {
        this.authService.loginUser(credentials);
        this.sendState(AUTH_RETRIEVALSTATUS.loginRunning);
    }

    register(credentials) {
        this.authService.registerUser(credentials);
        this.sendState(AUTH_RETRIEVALSTATUS.loginRunning);
    }
}
