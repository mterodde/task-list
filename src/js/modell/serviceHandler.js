import { JWT } from "jsonwebtoken";

const processError = Symbol('processError');
const handleAppError = Symbol('handleAppError');
// const decodeResponse = Symbol('decodeResponse');

export class ServiceHandler {
    constructor(serviceURI, callback) {
        this.serviceURI = serviceURI;
        this.callback = callback;

        this.decodeResponse.bind(this);
    }

    /*** Declaration of private class members ***/

    /* 
        For new, we post all errors that occurred, back to the caller
    */
 
    [processError](err) {
        this.callback(err);
    }

    /* 
        In case the service returns a status code indicating a failure an error
        will be thrown to be handled by the prommise chains' catch operation
    */

    [handleAppError](resp) {
        if (!resp.ok) {
            throw new Error(`Application error; ${resp.statusText}`);
        }
        return resp;
    }

    /* 
        Some use cases need the payload beeing transferred ebcrypted.
        In these cases it's up to the subclass (e.g. UserAuth), to override this method.

        ToDo: method should be declared as private class member. Figure out how this
              can be done for such methods that are subject of overloading in subclasses.
    */
    decodeResponse(data) {
        this.callback(data)
    }

    /*** End of declaration of private class members ***/

    callService(opCode, options) {
        let targetURI = this.serviceURI + '/' + opCode;
        try {
            return fetch(targetURI, options)
                .then(this[handleAppError])
                .then(resp => resp.json())
                .then(this.decodeResponse)
                .catch(this[processError]);
        } catch (error) {
            this.callback(error);
        }
    }

    buildOptions(headers, method) {
        let options = {
            method: method,
            mode: "cors",
            cache: "no-cache",
            credentials: "omit",
            redirect: "follow",
            referrer: "no-referrer"
        };
        options['headers'] = headers;
        return options;
    }

    buildHeaders(userCredentials) {
        let headers = new Headers();
        headers.append("Access-Control-Request-Headers", "Authorization");
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${JWT.sign(userCredentials, "UserSecret")}`);
        return headers;
    }
}
