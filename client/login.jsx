const helper = require('./helper.js');

//Handles login attempts by the user
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;
    
    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, _csrf});

    return false;
}

//Handles signup attempts by the user
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;
    
    if(!username || !pass ||  !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, _csrf});

    return false;
}

//React Element to display the main login window
const LoginWindow = (props) => {
    return(
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <div className="accountInput">
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
            </div>
            <div className="accountInput">
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
            </div>
            
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};


//React element to display the signup window
const SignupWindow = (props) => {
    return(
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <div className="accountInput">
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
            </div>
            <div className="accountInput">
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
            </div>
            <div className="accountInput">
                <label htmlFor="pass2">Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            </div>
        
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};

//Run on page startup
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    //Login window onclick
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    //Signup window onclick
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow csrf={data.csrfToken} />,
            document.getElementById('content'));
        return false;
    });

    //Display Login window by default
    ReactDOM.render(<LoginWindow csrf={data.csrfToken} />,
        document.getElementById('content'));
};

window.onload = init;