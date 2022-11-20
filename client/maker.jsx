const helper = require('./helper.js');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const level = e.target.querySelector('#domoLevel').value;
    const _csrf = e.target.querySelector('#_csrf').value;
    
    if(!name || !age || !level) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, level, _csrf}, loadDomosFromServer);

    return false;
}

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="number" min="1" name="level" />
            <label htmlFor="sort">Sort: </label>
            <select id="domoSort" onChange={loadDomosFromServer}>
                <option value="Alphabetical">Alphabetical</option>
                <option value="Oldest">Oldest</option>
                <option value="Youngest">Youngest</option>
                <option value="Level">Level</option>
            </select>
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
}

const DomoList = (props) => {
    if(props.domos.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoLevel"> Level: {domo.level} </h3>
            </div>
        );
    });

    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const sortDomos = async (domos) => {
    const sort = document.getElementById('domoSort').value;
    if(sort === 'Alphabetical'){
        domos.sort((a, b) => {
            if(a.name.toUpperCase() < b.name.toUpperCase()){
                return -1;
            } else if (a.name.toUpperCase() > b.name.toUpperCase()){
                return 1;
            } else {
                return 0;
            }
        });
    }else if(sort === 'Oldest'){
        domos.sort((a, b) => {
            if(a.age > b.age){
                return -1;
            } else if (a.age < b.age){
                return 1;
            } else {
                return 0;
            }
        });
    }else if(sort === 'Youngest'){
        domos.sort((a, b) => {
            if(a.age < b.age){
                return -1;
            } else if (a.age > b.age){
                return 1;
            } else {
                return 0;
            }
        });
    } else if(sort === 'Level'){
        domos.sort((a, b) => {
            if(a.level > b.level){
                return -1;
            } else if (a.level < b.level){
                return 1;
            } else {
                return 0;
            }
        });
    }
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    sortDomos(data.domos);
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')  
    );

    loadDomosFromServer();
}

window.onload = init;