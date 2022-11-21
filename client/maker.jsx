const { indexOf, take } = require('underscore');
const helper = require('./helper.js');

const handleTask = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#taskName').value;
    const description = e.target.querySelector('#taskDescription').value;
    const length = e.target.querySelector('#taskLength').value;
    const _csrf = e.target.querySelector('#_csrf').value;
    
    if(!name || !description || !length) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, description, length, _csrf}, loadTasksFromServer);

    return false;
}

const handleDelete = (e) => {
    e.preventDefault();
    helper.hideError();

    const deletedTaskName = e.target.parentElement.querySelector(".taskName").value;
    const _csrf = e.target.parentElement.key;

    helper.sendPost('/delete', {deletedTaskName, _csrf}, loadTasksFromServer);

    return false;
}

const TaskForm = (props) => {
    return(
        <form id="taskForm"
            onSubmit={handleTask}
            name="taskForm"
            action="/maker"
            method="POST"
            className="taskForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="taskName" type="text" name="name" placeholder="Task Name" />

            <label htmlFor="description">Description: </label>
            <input id="taskDescription" type="text" name="description" placeholder="Task Description"/>

            <label htmlFor="length">Length (Minutes): </label>
            <input id="taskLength" type="number" min="1" name="Task Length" />

            <label htmlFor="sort">Sort: </label>
            <select id="taskSort" onChange={loadTasksFromServer}>
                <option value="Alphabetical">Alphabetical</option>
                <option value="Shortest">Shortest</option>
                <option value="Longest">Longest</option>
                <option value="Oldest">Oldest</option>
                <option value="Newest">Newest</option>
            </select>

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="postTaskSubmit" type="submit" value="Post Task" />
        </form>
    );
}

const TaskList = (props) => {
    if(props.tasks.length === 0){
        return(
            <div className="taskList">
                <h3 className="emptyTask">No Tasks Yet!</h3>
            </div>
        );
    }

    const taskNodes = props.tasks.map(task => {
        return(
            <div key={task._id} className="task">
                <h3 className="taskName" value={task.name}> Name: {task.name} </h3>
                <h3 className="taskDescription"> Description: {task.description} </h3>
                <h3 className="taskLength"> Length: {task.length} </h3>
                <h3 className="taskDate"> Date: {task.createdDate.substring(0, task.createdDate.indexOf('T'))} </h3>
                <button className="taskDelete" onClick={handleDelete}> Complete Task</button>
            </div>
        );
    });

    return(
        <div className="taskList">
            {taskNodes}
        </div>
    );
}

const sortTasks = async (tasks) => {
    const sort = document.getElementById('taskSort').value;
    if(sort === 'Alphabetical'){
        tasks.sort((a, b) => {
            if(a.name.toUpperCase() < b.name.toUpperCase()){
                return -1;
            } else if (a.name.toUpperCase() > b.name.toUpperCase()){
                return 1;
            } else {
                return 0;
            }
        });
    } else if(sort === 'Shortest'){
        tasks.sort((a, b) => {
            if(a.length < b.length){
                return -1;
            } else if(a.length > b.length){
                return 1;
            } else {
                return 0;
            }
        });
    } else if(sort === 'Longest'){
        tasks.sort((a, b) => {
            if(a.length > b.length){
                return -1;
            } else if(a.length < b.length){
                return 1;
            } else {
                return 0;
            }
        });
    } else if(sort === 'Oldest'){
        tasks.sort((a, b) => {
            if(a.createdDate < b.createdDate){
                return -1;
            } else if(a.createdDate > b.createdDate){
                return 1;
            } else {
                return 0;
            }
        });
    } else if(sort === 'Newest'){
        tasks.sort((a, b) => {
            if(a.createdDate > b.createdDate){
                return -1;
            } else if(a.createdDate < b.createdDate){
                return 1;
            } else {
                return 0;
            }
        });
    }
}

const loadTasksFromServer = async () => {
    const response = await fetch('/getTasks');
    const data = await response.json();
    sortTasks(data.tasks);
    ReactDOM.render(
        <TaskList tasks={data.tasks} />,
        document.getElementById('tasks')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <TaskForm csrf={data.csrfToken} />,
        document.getElementById('makeTask')
    );

    ReactDOM.render(
        <TaskList tasks={[]} />,
        document.getElementById('tasks')  
    );

    loadTasksFromServer();
}

window.onload = init;