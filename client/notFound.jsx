const NotFoundText = (props) => {
    return(
        <div>
            <h3>ERROR: 404</h3>
            <p>Could not find page: {props.myUrl}</p>
        </div>
    );
};

const init = async () => {

    ReactDOM.render(
        <NotFoundText myUrl={window.location.href}/>,
        document.getElementById('content')  
    );
}

window.onload = init;