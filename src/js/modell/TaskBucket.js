import { TASK_STATUS_VALUES, TASK_RETRIEVALSTATUS } from "./TaskGlobals";
import { TaskPersistor } from "./persist";
import { Task } from "./Task";

/* Manages all the tasks of the currrent user.
    communicates all status changes back to the main controller
 */

const retrieveAllTasks = Symbol('retrieveAllTasks');
const resetTaskList = Symbol('resetTaskList');
const processServiceResult = Symbol('processServiceResult');

export default class TaskBucket {
    constructor(sendStateFunc, userHandle, persistenceServiceURI = null) {

        /* handle to an object representing the current user */
        this.userHandle = userHandle;

        /*
           Create an instance of the proxy object beeing used for syncing the task list
           with the persistance service.
       */
        this.persistenceService = persistenceServiceURI ?
            new TaskPersistor(persistenceServiceURI, this[processServiceResult]) :
            null;

        /* reference to a function used to communicate status changes to the main controller */
        this.sendState = sendStateFunc;

        /* List of the tasks, managed by this task bucket object */
        this.tasks = [];

        /*
            used to generate a consecutive number as unique id for each task created.
            With each new task beeing created, this number will be incremented.
        */
        this.currentTaskId = 0;

        /* 
            In casee a persistence service is configured, retrieve the initial task list for 
            the current user from this service.
         */
        if (this.persistenceService) {
            /* inform the main controller that the retrieval of the tasks is ongoing */
            this.sendState(TASK_RETRIEVALSTATUS.retrievalRunning);
            [retrieveAllTasks]();
        }
    }


    /*** Declaration of private class members ***/

    /* 
        replace the current tasklist with a list of tasks retrieved from
        an external source.
    */

    [resetTaskList](taskData) {
        this.tasks = taskData.map(dataRecord => new Task(dataRecord));

        /* 
            find the value of highest task id currently existing in users' tasklist
            and set the value for the next task id beeing assingned to its successor
        */
        this.currentTaskId = taskData.reduce((maxId, task) => maxId = maxId > task.taskId ? maxId : task.taskId, 0);
    }

    /* ToDo: find a better solution for exposing private members for unit testing */
    public_resetTaskList(taskData) {
        this[resetTaskList](taskData);
    }

    /* 
        retrieve the list containing all the current users' tasks from persistance service.
    */
    [retrieveAllTasks]() {
        if (this.persistenceService) {
            this.persistenceService.retrieveTasks(this.userHandle.id);
        }
    }

    /* 
        process any answer from the persistence service
    */
    [processServiceResult](err, res) {
        if (err) {
            console.error(err);
            /* Tell the main controller that the retrieval of the task list failed */
            this.sendState(TASK_RETRIEVALSTATUS.retrievalFailed, err);
        } else {
            if (res.taskList) {
                [resetTaskList](res.taskList);
            }
            /* Tell the main controller that the tasks were successfolly retrieved */
            this.sendState(TASK_RETRIEVALSTATUS.retrievalFinished);
        }
    }
    /*** End of declaration of private class members ***/

    get taskList() {
        /* return a copy of the current task list */
        return [...this.tasks];
    }

    get numOfTasks() {
        return this.tasks.length;
    }

    /* 
        look up of a task object, specified by the unique id of the task
    */
    findTask(taskId) {
        let task = this.tasks.find(task => task.id === taskId);
        if (task) {
            return task;
        } else {
            console.error(`TaskBucket.find failed. Task with id ${taskId} does not exist in list of tasks`);
            return null;
        }
    }

    /* 
        create a new task object, depending in the description of the tasks properties,
        give it a unique id, put it into the task list and 
    */
    createTask(taskDescripton) {
        taskDescripton.taskId = this.currentTaskId++;
        taskDescripton.status = TASK_STATUS_VALUES.initialized;
        let newTask = new Task(taskDescripton);
        this.tasks.push(newTask);

        /* 
            In case a persistence service is configured, persist this new tasks data
        */
        if (this.persistenceService) {
            this.persistenceService.createTask(this.userHandle.id, newTask.serialized);
        }
        return newTask
    }

    /* 
        lookup a task, described by its' unique id and update its' attribute values 
        with those, supplied by the updateRecord object.
    */
    updateTask(taskId, updateRecord) {

        let task = this.findTask(taskId);

        if (task) {
            task.update(updateRecord);

            /* 
                In case a persistence service is configured, also update the persited copy of this task
            */
            if (this.persistenceService) {
                this.persistenceService.updateTask(this.userHandle.id, task.serialized);
            }
            return task;
        } else {
            console.error(`TaskBucket.updateTask for task ${taskId} failed. Task not found`);
            return null;
        }
    }

    removeTask(taskId) {
        let index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            /* 
                remove task object from the task list
            */
            let taskRemoved = this.tasks.splice(index, 1);

            /* 
                In case a persistence service is configured, also remove the persited copy of this task            
            */
            if (this.persistenceService) {
                this.persistenceService.deleteTask(this.userHandle.id, taskRemoved.serialized);
            }
        } else {
            console.error(`TaskBucket.remove failed. Task ${taskId} not found`);
        }
    }
}
