const { indexOf, take } = require('underscore');
const helper = require('./helper.js');

const handleTask = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#taskName').value;
    const description = e.target.querySelector('#taskDescription').value;
    const length = e.target.querySelector('#taskLength').value;
    const myColor = "None";
    const _csrf = e.target.querySelector('#_csrf').value;
    
    if(!name || !description || !length) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, description, length, myColor, _csrf}, loadTasksFromServer);

    return false;
}

const handleDelete = (e) => {
    e.preventDefault();
    helper.hideError();

    const deletedTaskName = e.target.parentElement.querySelector(".taskName").innerHTML.substring("7");
    const _csrf = document.querySelector('#_csrf').value;

    helper.sendPost('/delete', {deletedTaskName, _csrf}, loadTasksFromServer);
    loadTasksFromServer();

    return false;
}

const handlePassChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;
    
    if(!newPass || !newPass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if(newPass !== newPass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {newPass, newPass2, _csrf});

    return false;
}

const changeColor = (e) => {
    e.preventDefault();
    helper.hideError();

    if(e.target.value !== "None"){
        e.target.parentElement.style.background = e.target.value;
    }else{
        e.target.parentElement.style.background = "#68FF7C";
    }

    const updatedTaskName = e.target.parentElement.querySelector(".taskName").innerHTML.substring("7").trim();
    const updatedColor = e.target.value;
    const _csrf = document.querySelector('#_csrf').value;

    helper.sendPost('/update', {updatedTaskName, updatedColor, _csrf}, loadTasksFromServer);

    return false;
}

const toggleVersion = (e) => {
    e.preventDefault();
    helper.hideError();

    const taskList = document.querySelectorAll(".task");

    if(e.target.checked == true){
        taskList.forEach(task => {
            task.querySelector("select").style.visibility="visible";
            task.querySelector("label").style.visibility="visible";
            if(task.querySelector("select").dataset.mycolor !== "None"){
                task.querySelector("select").parentElement.style.background = task.querySelector("select").dataset.mycolor;
            }else{
                task.querySelector("select").parentElement.style.background = "#68FF7C";
            }
        });
    }else{
        taskList.forEach(task => {
            task.querySelector("select").style.visibility="hidden";
            task.querySelector("label").style.visibility="hidden";
            task.querySelector("select").parentElement.style.background = "#68FF7C";
        });
    }
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
            <div className="taskInput">
                <label htmlFor="name">Name: </label>
                <input id="taskName" type="text" name="name" placeholder="Task Name" />
            </div>

            <div className="taskInput">
                <label htmlFor="description">Description: </label>
                <input id="taskDescription" type="text" name="description" placeholder="Task Description"/>
            </div>

            <div className="taskInput">
                <label htmlFor="length">Length (Minutes): </label>
                <input id="taskLength" type="number" min="1" name="Task Length" />
            </div>

            <div className="taskInput">
                <label htmlFor="sort">Sort: </label>
                <select id="taskSort" onChange={loadTasksFromServer}>
                    <option value="Alphabetical">Alphabetical</option>
                    <option value="Shortest">Shortest</option>
                    <option value="Longest">Longest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Newest">Newest</option>
                </select>
            </div>

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="postTaskSubmit" type="submit" value="Post Task" />

            <div className="taskInput">
                <label htmlFor="paidVersion">Paid Toggle: </label>
                <input id="paidToggle" type="checkbox" onChange={toggleVersion}/>
            </div>
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
                <label htmlFor="color" style={{visibility: "hidden"}}>Color: </label>
                <select className="taskColor" style={{visibility: "hidden"}} onChange={changeColor} data-mycolor={task.myColor}>
                    <option value="None">None</option>
                    <option value="Blue">Blue</option>
                    <option value="Red">Red</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                </select>
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
        document.getElementById('content')
    );
}

const ChangePassWindow = (props) => {
    return(
        <form id="changePassForm"
            name="ChangePassForm"
            onSubmit={handlePassChange}
            action="/changepass"
            method="POST"
            className="mainForm"
        >
            <div className="changePassInput">
                <label htmlFor="newPass">New Password: </label>
                <input id="newPass" type="password" name="newPass" placeholder="new password" />
            </div>
            <div className="changePassInput">
                <label htmlFor="newPass2">Retype Password: </label>
                <input id="newPass2" type="password" name="newPass2" placeholder="retype password" />
            </div>    
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const changePassButton = document.getElementById('changePassButton');
    const makerPageButton = document.getElementById('makerPageButton');

    changePassButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(
            <ChangePassWindow csrf={data.csrfToken} />,
            document.getElementById('content')
        );
        return false;
    });

    makerPageButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(
            <TaskForm csrf={data.csrfToken} />,
            document.getElementById('makeTask')
        );
    
        ReactDOM.render(
            <TaskList tasks={[]} />,
            document.getElementById('content')  
        );
    
        loadTasksFromServer();
        return false;
    });

    ReactDOM.render(
        <TaskForm csrf={data.csrfToken} />,
        document.getElementById('makeTask')
    );

    ReactDOM.render(
        <TaskList tasks={[]} />,
        document.getElementById('content')  
    );

    loadTasksFromServer();
}

window.onload = init;