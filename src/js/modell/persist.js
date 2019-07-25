import { ServiceHandler } from "./serviceHandler";

export class TaskPersistor extends ServiceHandler {

  createTask(userCredentials, taskDescription) {
    let headers = this.buildHeaders(userCredentials);
    let options = this.buildOptions(headers, "POST");
    options["body"] = taskDescription;

    this.callService("create", options);
  }

  updateTask(userCredentials, taskDescription) {
    let headers = this.buildHeaders(userCredentials);
    let options = this.buildOptions(headers, "PATCH");
    options["body"] = taskDescription;

    this.callService("update", options);
  }

  deleteTask(userCredentials, taskDescription) {
    let headers = this.buildHeaders(userCredentials);
    let options = this.buildOptions(headers, "DELETE");
    options["body"] = taskDescription;

    this.callService("delete", options);
  }

  retrieveTasks(userCredentials, filter = null) {
    let headers = this.buildHeaders(userCredentials);
    let options = this.buildOptions(headers, "GET");
    options["body"] = filter;

    this.callService("retrieve", options);
  }
}
