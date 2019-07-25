export const TASK_STATUS_VALUES = {
    created: 1,
    running: 2,
    endded: 3
};

export const INITIAL_TASK = {
    /* unique id to identify the task on the client and on the server side */
    taskId: '',
    description: '',
    /* describes the tasks lifecycle (created -> running -> ended) */
    staus: TASK_STATUS_VALUES.initialized,
    ownerId: '',
    creationDate: '',
    startDate: '',
    endDate: ''
}

export const PERSISTENCE_STATUS_VALUES = {
    notPersisted: 0,
    inProgress: 1,
    persisted: 2,
    persistanceFailed: 99
}

export const TASK_RETRIEVALSTATUS = {
    retrievalRunning: 1,
    retrievalFinished: 2,
    retrievalFailed: 0
}

export const TASK_DEMO_LIST = [
    {
        id: 1,
        description: "do something"
    },
    {
        id: 2,
        description: "do something else"
    },
    {
        id: 3,
        description: "do nothing"
    },
    {
        id: 4,
        description: "do nothing more"
    },
    {
        id: 5,
        description: "do the right thing"
    },
    {
        id: 6,
        description: "do it now"
    },
]
