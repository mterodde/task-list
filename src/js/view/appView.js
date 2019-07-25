import React from "react";
import PropTypes from "prop-types";

import { HeaderView } from "./headerView";
import { TaskListView } from "./taskListView";
import { DataMaintenanceView } from "./dataMaintenanceView";

export default function AppView(props) {

    return (
        <main id="mainArea">
            <HeaderView />
            <TaskListView show={props.showTaskList} tasks={props.tasks}></TaskListView>
            <DataMaintenanceView handleNewTask={props.handleNewTask} />
        </main>
    )
}

AppView.propTypes = {
    showTaskList: PropTypes.bool,
    tasks: PropTypes.array,
    handleNewTask: PropTypes.func
}