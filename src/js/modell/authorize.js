import { JWT } from "jsonwebtoken";
import { ServiceHandler } from "./serviceHandler";

export class UserAuth extends ServiceHandler {
  constructor(serviceURI, callback) {
    super(serviceURI, callback);

    this.decodeResponse = this.decodeResponse.bind(this);
  }

  /* 
        Override method from superclass

        Decrypt the user credentials that were transferred encrypted 
        within the message body.
     */
  decodeResponse(data) {
    try {
      let decryptedData = JWT.verify(data.user, "UserSecret");
      this.callback(null, decryptedData);
    } catch (error) {
      this.callback(error);
    }
  }

  registerUser(userCredentials) {
    let headers = this.buildHeaders(userCredentials);
    let options = this.buildOptions(headers, "POST");
    this.callService("register", options);
  }

  loginUser(userCredentials) {
    let headers = this.buildHeaders(userCredentials);
    let options = this.buildOptions(headers, "GET");
    this.callService("login", options);
  }

  buildHeaders(userCredentials) {
    let headers = new Headers();
    headers.append("Access-Control-Request-Headers", "Authorization");
    headers.append(
      "Authorization",
      `Bearer ${JWT.sign(userCredentials, "UserSecret")}`
    );
    return headers;
  }
}

