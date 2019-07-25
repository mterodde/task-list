'use strict'

import { INITIAL_TASK, PERSISTENCE_STATUS_VALUES } from "./TaskGlobals";

/* Class to be used, to fully describe a task item 
    consisting of:
        - task id
        - task status
        - Id of task owner
        - task creation date
        - task start date
        - task end date
        - task description
    
    The attributes staus, creationDate, startDate and endDate as well as 
    the class attribute _persistStatus are for further use.
    These attributes are not used by the current version of the application
*/


export class Task {
    constructor(taskDecription = INITIAL_TASK){
        /* a shallow copy of the task description object is sufficent
            since it has no nested objects at all */
        this.taskData = {...taskDecription};
        this._persistStatus = PERSISTENCE_STATUS_VALUES.notPersisted;
    }

    set persistStatus(newStatus){
        this._persistStatus = newStatus;
    }

    set status(newStatus){
        this.taskData.status = newStatus;
    }

    set start(date = Date.now()){
        this.taskData.startDate = date;
    }

    set end(date = Date.now()) {
        this.taskData.endDate = date;
    }

    get id() {
        return this.taskData.taskId;
    }

    get status() {
        return this.taskData.status;
    }

    get description(){
        return this.taskData.description
    }

    get owner() {
        return this.taskData.ownerId;
    }

    get creationDate(){
        return this.taskData.creationDate;
    }

    get startDate(){
        return this.taskData.startDate;
    }

    get endDate() {
        return this.taskData.endDate;
    }

    get persistStatus(){
        return this._persistStatus;
    }

    get serialized(){
        return JSON.stringify(this.taskData);
    }

    update(dataForUpdate){
        /* 
            substitute current taskData attribute values by the 
            attribute values supplied by the dataForUpdate object
        */
        this.taskData = {...this.taskData, ...dataForUpdate};
    }
}
