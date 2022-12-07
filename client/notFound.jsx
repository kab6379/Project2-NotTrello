//React element to display the page not found error (404)
const NotFoundText = (props) => {
    return(
        <div>
            <h3>ERROR: 404</h3>
            <p>Could not find page: {props.myUrl}</p>
        </div>
    );
};

//On page startup, display 404 error
const init = async () => {

    ReactDOM.render(
        <NotFoundText myUrl={window.location.href}/>,
        document.getElementById('content')  
    );
}

window.onload = init;